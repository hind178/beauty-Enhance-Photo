/*
 * Beauty Enhance — AI tools.
 *
 *  1. removeBackground  — in-browser, @imgly/background-removal (ISNet fp16 model, ~80 MB, cached by the browser)
 *  2. colorizeLocal     — in-browser, DDColor-tiny ONNX (~135 MB, stored in Cache Storage after first download)
 *  3. cloud*            — fal.ai hosted models (CodeFormer face restore, DDColor colorize) using the user's own API key
 *
 * Exposes window.BeautyAI. Loaded as an ES module; "onnxruntime-web" is resolved by the import map in index.html.
 */

const IMGLY_URL = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/dist/index.mjs';
const DDCOLOR_URL = 'https://huggingface.co/edgetools/ddcolor/resolve/main/ddcolor-tiny-fp16.onnx';
const MODEL_CACHE = 'beauty-enhance-models-v1';
const FAL_BASE = 'https://fal.run/';

// ---------------------------------------------------------------- helpers
function canvasFrom(source, w, h) {
  const c = document.createElement('canvas');
  c.width = w || source.width; c.height = h || source.height;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, c.width, c.height);
  return c;
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), type || 'image/png', quality);
  });
}

async function blobToCanvas(blob) {
  const bmp = await createImageBitmap(blob);
  const c = canvasFrom(bmp, bmp.width, bmp.height);
  if (bmp.close) bmp.close();
  return c;
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

// Download with progress and keep a copy in Cache Storage so the next visit is instant.
async function fetchModel(url, onProgress) {
  let cache = null;
  try { cache = await caches.open(MODEL_CACHE); } catch (e) { cache = null; }
  if (cache) {
    const hit = await cache.match(url);
    if (hit) { onProgress(1); return new Uint8Array(await hit.arrayBuffer()); }
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error('Model download failed (HTTP ' + res.status + ')');
  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body.getReader();
  const chunks = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    if (total) onProgress(got / total);
  }
  const bytes = new Uint8Array(got);
  let off = 0;
  for (const c of chunks) { bytes.set(c, off); off += c.length; }
  if (cache) {
    try { await cache.put(url, new Response(bytes, { headers: { 'content-type': 'application/octet-stream' } })); } catch (e) { /* quota — fine */ }
  }
  return bytes;
}

// ---------------------------------------------------------------- color math (sRGB <-> CIE Lab, D65, OpenCV float convention)
const XN = 0.950456, ZN = 1.088754;
function toLinear(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function toGamma(c) { return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }
function fLab(t) { return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; }
function fInv(t) { return t > 0.206893 ? t * t * t : (t - 16 / 116) / 7.787; }

function rgbToLab(r, g, b, out) {
  r = toLinear(r); g = toLinear(g); b = toLinear(b);
  const x = (0.412453 * r + 0.357580 * g + 0.180423 * b) / XN;
  const y = 0.212671 * r + 0.715160 * g + 0.072169 * b;
  const z = (0.019334 * r + 0.119193 * g + 0.950227 * b) / ZN;
  const fx = fLab(x), fy = fLab(y), fz = fLab(z);
  out[0] = 116 * fy - 16;
  out[1] = 500 * (fx - fy);
  out[2] = 200 * (fy - fz);
  return out;
}

function labToRgb(L, a, bb, out) {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - bb / 200;
  const x = fInv(fx) * XN, y = fInv(fy), z = fInv(fz) * ZN;
  const r = 3.240479 * x - 1.537150 * y - 0.498535 * z;
  const g = -0.969256 * x + 1.875992 * y + 0.041556 * z;
  const b = 0.055648 * x - 0.204043 * y + 1.057311 * z;
  out[0] = toGamma(Math.min(1, Math.max(0, r)));
  out[1] = toGamma(Math.min(1, Math.max(0, g)));
  out[2] = toGamma(Math.min(1, Math.max(0, b)));
  return out;
}

// ---------------------------------------------------------------- 1. background removal
let imglyPromise = null;
function loadImgly() {
  if (!imglyPromise) imglyPromise = import(IMGLY_URL).catch((e) => { imglyPromise = null; throw e; });
  return imglyPromise;
}

/** @returns {Promise<HTMLCanvasElement>} canvas with transparent background */
async function removeBackground(sourceCanvas, onProgress) {
  onProgress(0.02, 'loadModel');
  const lib = await loadImgly();
  const input = await canvasToBlob(sourceCanvas, 'image/png');
  const blob = await lib.removeBackground(input, {
    model: 'isnet_fp16',
    output: { format: 'image/png' },
    progress: (key, current, total) => {
      if (/fetch/.test(key) && total) onProgress(0.05 + 0.75 * (current / total), 'loadModel');
      else if (/compute/.test(key)) onProgress(0.85, 'thinking');
    },
  });
  onProgress(1, 'done');
  return blobToCanvas(blob);
}

// ---------------------------------------------------------------- 2. local colorization (DDColor-tiny)
let ddcolorSession = null;
async function getDDColor(onProgress) {
  if (ddcolorSession) return ddcolorSession;
  const ort = (await import('onnxruntime-web')).default;
  ort.env.wasm.numThreads = self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 2) : 1;
  const bytes = await fetchModel(DDCOLOR_URL, (p) => onProgress(0.02 + 0.68 * p, 'loadModel'));
  onProgress(0.72, 'thinking');
  ddcolorSession = { ort, session: await ort.InferenceSession.create(bytes, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' }) };
  return ddcolorSession;
}

/** @returns {Promise<HTMLCanvasElement>} colorized copy of sourceCanvas */
async function colorizeLocal(sourceCanvas, onProgress) {
  const { ort, session } = await getDDColor(onProgress);
  const S = 512;

  // Model input: the luminance-only (grey) version of the photo, RGB in [0,1], NCHW.
  const small = canvasFrom(sourceCanvas, S, S).getContext('2d').getImageData(0, 0, S, S).data;
  const input = new Float32Array(3 * S * S);
  const lab = [0, 0, 0], rgb = [0, 0, 0];
  for (let i = 0; i < S * S; i++) {
    rgbToLab(small[i * 4] / 255, small[i * 4 + 1] / 255, small[i * 4 + 2] / 255, lab);
    labToRgb(lab[0], 0, 0, rgb);
    input[i] = rgb[0]; input[S * S + i] = rgb[1]; input[2 * S * S + i] = rgb[2];
  }
  onProgress(0.8, 'thinking');
  const feeds = {};
  feeds[session.inputNames[0]] = new ort.Tensor('float32', input, [1, 3, S, S]);
  const result = await session.run(feeds);
  const out = result[session.outputNames[0]];
  let ab = out.data;
  if (!(ab instanceof Float32Array)) ab = Float32Array.from(ab); // e.g. Float16Array outputs
  onProgress(0.92, 'finish');

  // Upsample predicted a/b to full size (bilinear) and merge with the original full-resolution L.
  const w = sourceCanvas.width, h = sourceCanvas.height;
  const ctx = sourceCanvas.getContext('2d');
  const full = ctx.getImageData(0, 0, w, h);
  const d = full.data;
  const plane = S * S;
  for (let y = 0; y < h; y++) {
    const sy = Math.min(S - 1, Math.max(0, ((y + 0.5) * S) / h - 0.5));
    const y0 = Math.floor(sy), y1 = Math.min(S - 1, y0 + 1), fy = sy - y0;
    for (let x = 0; x < w; x++) {
      const sx = Math.min(S - 1, Math.max(0, ((x + 0.5) * S) / w - 0.5));
      const x0 = Math.floor(sx), x1 = Math.min(S - 1, x0 + 1), fx = sx - x0;
      const i00 = y0 * S + x0, i01 = y0 * S + x1, i10 = y1 * S + x0, i11 = y1 * S + x1;
      const w00 = (1 - fx) * (1 - fy), w01 = fx * (1 - fy), w10 = (1 - fx) * fy, w11 = fx * fy;
      const a = ab[i00] * w00 + ab[i01] * w01 + ab[i10] * w10 + ab[i11] * w11;
      const b = ab[plane + i00] * w00 + ab[plane + i01] * w01 + ab[plane + i10] * w10 + ab[plane + i11] * w11;
      const j = (y * w + x) * 4;
      rgbToLab(d[j] / 255, d[j + 1] / 255, d[j + 2] / 255, lab);
      labToRgb(lab[0], a, b, rgb);
      d[j] = rgb[0] * 255 + 0.5; d[j + 1] = rgb[1] * 255 + 0.5; d[j + 2] = rgb[2] * 255 + 0.5;
    }
  }
  const outCanvas = document.createElement('canvas');
  outCanvas.width = w; outCanvas.height = h;
  outCanvas.getContext('2d').putImageData(full, 0, 0);
  onProgress(1, 'done');
  return outCanvas;
}

// ---------------------------------------------------------------- 3. cloud (fal.ai, user's own key)
function findImageUrl(obj) {
  if (!obj || typeof obj !== 'object') return null;
  if (typeof obj.url === 'string' && /^https?:|^data:/.test(obj.url)) return obj.url;
  for (const k of ['image', 'images', 'output']) {
    if (obj[k]) { const u = findImageUrl(Array.isArray(obj[k]) ? obj[k][0] : obj[k]); if (u) return u; }
  }
  for (const v of Object.values(obj)) {
    const u = Array.isArray(v) ? findImageUrl(v[0]) : findImageUrl(v);
    if (u) return u;
  }
  return null;
}

const CLOUD_TOOLS = {
  face: { endpoint: 'fal-ai/codeformer', body: { fidelity: 0.6, upscale_factor: 2, face_upscale: true } },
  colorize: { endpoint: 'fal-ai/ddcolor', body: {} },
};

/** @returns {Promise<HTMLCanvasElement>} */
async function cloudRun(tool, sourceCanvas, apiKey, onProgress) {
  const spec = CLOUD_TOOLS[tool];
  if (!spec) throw new Error('Unknown tool ' + tool);
  if (!apiKey) throw new Error('NO_KEY');
  onProgress(0.05, 'upload');
  // Keep uploads modest: JPEG, max 2048px on the long side.
  const k = Math.min(1, 2048 / Math.max(sourceCanvas.width, sourceCanvas.height));
  const send = k < 1 ? canvasFrom(sourceCanvas, Math.round(sourceCanvas.width * k), Math.round(sourceCanvas.height * k)) : sourceCanvas;
  const dataUrl = await blobToDataURL(await canvasToBlob(send, 'image/jpeg', 0.95));
  onProgress(0.2, 'thinking');
  const res = await fetch(FAL_BASE + spec.endpoint, {
    method: 'POST',
    headers: { Authorization: 'Key ' + apiKey.trim(), 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({ image_url: dataUrl }, spec.body)),
  });
  if (res.status === 401 || res.status === 403) throw new Error('BAD_KEY');
  if (!res.ok) {
    let msg = 'HTTP ' + res.status;
    try { const j = await res.json(); msg += ' — ' + (j.detail ? JSON.stringify(j.detail) : JSON.stringify(j)); } catch (e) { /* ignore */ }
    throw new Error(msg);
  }
  const json = await res.json();
  const url = findImageUrl(json);
  if (!url) throw new Error('No image in response');
  onProgress(0.85, 'download');
  const imgRes = await fetch(url);
  if (!imgRes.ok) throw new Error('Result download failed (HTTP ' + imgRes.status + ')');
  const canvas = await blobToCanvas(await imgRes.blob());
  onProgress(1, 'done');
  return canvas;
}

window.BeautyAI = {
  removeBackground,
  colorizeLocal,
  cloudRun,
  _lab: { rgbToLab, labToRgb },
};
window.dispatchEvent(new Event('beautyai-ready'));
