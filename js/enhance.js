/*
 * Beauty Enhance — image processing core.
 * Pure JavaScript, no dependencies. Works both in a Web Worker and on the main thread.
 *
 * Techniques used:
 *  - Gray-world white balance
 *  - Per-channel auto levels (percentile stretch)
 *  - Guided filter (He et al.) for edge-preserving denoise and skin smoothing
 *  - YCbCr skin detection for portrait retouching
 *  - Large-radius unsharp mask for "clarity" (local contrast)
 *  - Small-radius unsharp mask on luminance for sharpening
 *  - Tone curve: brightness (gamma), contrast, vibrance, warmth
 */
(function (root) {
  'use strict';

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  // ---------- Box blur (O(N), any radius) ----------
  function boxH(src, dst, w, h, r) {
    const norm = 1 / (2 * r + 1);
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let acc = 0;
      for (let k = -r; k <= r; k++) acc += src[row + clamp(k, 0, w - 1)];
      for (let x = 0; x < w; x++) {
        dst[row + x] = acc * norm;
        const add = x + r + 1, sub = x - r;
        acc += src[row + (add < w ? add : w - 1)] - src[row + (sub > 0 ? sub : 0)];
      }
    }
  }

  function boxV(src, dst, w, h, r) {
    const norm = 1 / (2 * r + 1);
    const acc = new Float64Array(w);
    for (let k = -r; k <= r; k++) {
      const yy = clamp(k, 0, h - 1) * w;
      for (let x = 0; x < w; x++) acc[x] += src[yy + x];
    }
    for (let y = 0; y < h; y++) {
      const row = y * w;
      const add = Math.min(y + r + 1, h - 1) * w;
      const sub = Math.max(y - r, 0) * w;
      for (let x = 0; x < w; x++) {
        dst[row + x] = acc[x] * norm;
        acc[x] += src[add + x] - src[sub + x];
      }
    }
  }

  function boxBlur(src, w, h, r, tmp, out) {
    r = Math.max(1, Math.round(r));
    boxH(src, tmp, w, h, r);
    boxV(tmp, out, w, h, r);
    return out;
  }

  // Three box passes ≈ Gaussian blur
  function gaussBlur(src, w, h, r, tmp, out) {
    const rr = Math.max(1, Math.round(r / 1.7));
    boxBlur(src, w, h, rr, tmp, out);
    boxBlur(out, w, h, rr, tmp, out);
    boxBlur(out, w, h, rr, tmp, out);
    return out;
  }

  // ---------- Guided filter (self-guided) ----------
  function guidedFilter(I, w, h, r, eps, buf) {
    const n = w * h;
    const { meanI, meanII, tmp, a, b } = buf;
    const II = buf.II;
    for (let i = 0; i < n; i++) II[i] = I[i] * I[i];
    boxBlur(I, w, h, r, tmp, meanI);
    boxBlur(II, w, h, r, tmp, meanII);
    for (let i = 0; i < n; i++) {
      const m = meanI[i];
      const v = meanII[i] - m * m;
      const ai = v / (v + eps);
      a[i] = ai;
      b[i] = m - ai * m;
    }
    boxBlur(a, w, h, r, tmp, meanI);  // reuse buffers: meanI <- mean_a
    boxBlur(b, w, h, r, tmp, meanII); // meanII <- mean_b
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) out[i] = meanI[i] * I[i] + meanII[i];
    return out;
  }

  function makeBuffers(n) {
    return {
      meanI: new Float32Array(n), meanII: new Float32Array(n), II: new Float32Array(n),
      tmp: new Float32Array(n), a: new Float32Array(n), b: new Float32Array(n),
    };
  }

  // ---------- Skin mask (YCbCr) ----------
  function skinMask(R, G, B, w, h, blurR, buf) {
    const n = w * h;
    const m = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const r = R[i] * 255, g = G[i] * 255, b = B[i] * 255;
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      // soft membership instead of a hard cut
      const dcb = Math.max(0, Math.abs(cb - 102) - 22) / 10;
      const dcr = Math.max(0, Math.abs(cr - 152) - 20) / 10;
      const dy = y < 40 ? (40 - y) / 30 : 0;
      m[i] = Math.max(0, 1 - dcb - dcr - dy);
    }
    const out = new Float32Array(n);
    gaussBlur(m, w, h, blurR, buf.tmp, out);
    return out;
  }

  // ---------- Main pipeline ----------
  const DEFAULTS = {
    autoLevels: 0, whiteBalance: 0, denoise: 0, smooth: 0, skinOnly: true,
    sharpen: 0, clarity: 0, brightness: 0, contrast: 0, vibrance: 0, warmth: 0,
  };

  function process(imageData, options, onProgress) {
    const o = Object.assign({}, DEFAULTS, options || {});
    const progress = onProgress || function () {};
    const w = imageData.width, h = imageData.height, n = w * h;
    const d = imageData.data;
    const scaleRef = Math.min(w, h);

    progress(0.02, 'prepare');
    let R = new Float32Array(n), G = new Float32Array(n), B = new Float32Array(n);
    for (let i = 0, j = 0; i < n; i++, j += 4) {
      R[i] = d[j] / 255; G[i] = d[j + 1] / 255; B[i] = d[j + 2] / 255;
    }
    const buf = makeBuffers(n);

    // 1. White balance (gray world)
    if (o.whiteBalance > 0) {
      progress(0.08, 'color');
      let sr = 0, sg = 0, sb = 0;
      for (let i = 0; i < n; i++) { sr += R[i]; sg += G[i]; sb += B[i]; }
      sr /= n; sg /= n; sb /= n;
      const gray = (sr + sg + sb) / 3;
      const k = o.whiteBalance;
      const gr = 1 + (clamp(gray / (sr || 1e-6), 0.7, 1.4) - 1) * k;
      const gg = 1 + (clamp(gray / (sg || 1e-6), 0.7, 1.4) - 1) * k;
      const gb = 1 + (clamp(gray / (sb || 1e-6), 0.7, 1.4) - 1) * k;
      for (let i = 0; i < n; i++) { R[i] *= gr; G[i] *= gg; B[i] *= gb; }
    }

    // 2. Auto levels (per-channel percentile stretch)
    if (o.autoLevels > 0) {
      progress(0.14, 'color');
      const k = o.autoLevels;
      [R, G, B].forEach(function (C) {
        const hist = new Uint32Array(256);
        for (let i = 0; i < n; i++) hist[clamp((C[i] * 255) | 0, 0, 255)]++;
        const loCount = n * 0.003, hiCount = n * 0.997;
        let acc = 0, lo = 0, hi = 255;
        for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= loCount) { lo = v; break; } }
        acc = 0;
        for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= hiCount) { hi = v; break; } }
        if (hi - lo < 10) return;
        const l = lo / 255, s = 255 / (hi - lo);
        for (let i = 0; i < n; i++) {
          const v = C[i];
          C[i] = v + ((v - l) * s - v) * k;
        }
      });
    }

    // 3. Denoise (guided filter, all channels)
    if (o.denoise > 0) {
      const r = Math.max(1, Math.round((scaleRef / 600) * (1 + o.denoise * 2)));
      const e = Math.pow(0.015 + 0.05 * o.denoise, 2);
      const k = Math.min(1, o.denoise * 1.2);
      const chans = [R, G, B];
      for (let c = 0; c < 3; c++) {
        progress(0.2 + c * 0.08, 'denoise');
        const C = chans[c];
        const q = guidedFilter(C, w, h, r, e, buf);
        for (let i = 0; i < n; i++) C[i] += (q[i] - C[i]) * k;
      }
    }

    // 4. Beauty: skin smoothing
    if (o.smooth > 0) {
      progress(0.45, 'beauty');
      const r = Math.max(2, Math.round((scaleRef / 140) * (0.6 + o.smooth)));
      const e = Math.pow(0.03 + 0.07 * o.smooth, 2);
      const mask = o.skinOnly ? skinMask(R, G, B, w, h, r * 1.5, buf) : null;
      const k = o.smooth * 0.85; // keep a little natural texture
      const chans = [R, G, B];
      for (let c = 0; c < 3; c++) {
        progress(0.5 + c * 0.06, 'beauty');
        const C = chans[c];
        const q = guidedFilter(C, w, h, r, e, buf);
        if (mask) {
          for (let i = 0; i < n; i++) {
            const mk = mask[i] * k;
            C[i] += (q[i] - C[i]) * mk + 0.02 * o.smooth * mask[i]; // soft glow
          }
        } else {
          for (let i = 0; i < n; i++) C[i] += (q[i] - C[i]) * k;
        }
      }
    }

    // Luminance helper for detail passes
    function luminance() {
      const L = new Float32Array(n);
      for (let i = 0; i < n; i++) L[i] = 0.299 * R[i] + 0.587 * G[i] + 0.114 * B[i];
      return L;
    }

    // 5. Clarity (local contrast)
    if (o.clarity > 0) {
      progress(0.7, 'detail');
      const L = luminance();
      const blurL = new Float32Array(n);
      gaussBlur(L, w, h, Math.max(4, scaleRef / 40), buf.tmp, blurL);
      const k = o.clarity * 0.7;
      for (let i = 0; i < n; i++) {
        const dl = (L[i] - blurL[i]) * k;
        R[i] += dl; G[i] += dl; B[i] += dl;
      }
    }

    // 6. Sharpen (unsharp mask on luminance)
    if (o.sharpen > 0) {
      progress(0.8, 'detail');
      const L = luminance();
      const blurL = new Float32Array(n);
      const r = Math.max(1, scaleRef / 900);
      gaussBlur(L, w, h, r * 1.7, buf.tmp, blurL);
      const k = o.sharpen * 1.6;
      const thr = 0.008;
      for (let i = 0; i < n; i++) {
        let dl = L[i] - blurL[i];
        if (dl > -thr && dl < thr) continue; // don't amplify flat noise
        dl *= k;
        R[i] += dl; G[i] += dl; B[i] += dl;
      }
    }

    // 7. Tone & color
    progress(0.9, 'finish');
    const gamma = Math.pow(2, -o.brightness * 1.1);
    const con = 1 + o.contrast;
    const vib = o.vibrance;
    const warm = o.warmth * 0.06;
    const out = new Uint8ClampedArray(n * 4);
    for (let i = 0, j = 0; i < n; i++, j += 4) {
      let r = clamp(R[i], 0, 1), g = clamp(G[i], 0, 1), b = clamp(B[i], 0, 1);
      if (gamma !== 1) { r = Math.pow(r, gamma); g = Math.pow(g, gamma); b = Math.pow(b, gamma); }
      if (con !== 1) { r = (r - 0.5) * con + 0.5; g = (g - 0.5) * con + 0.5; b = (b - 0.5) * con + 0.5; }
      if (vib !== 0) {
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        const sat = mx - mn;
        const amt = vib > 0 ? vib * (1 - sat) : vib;
        const l = 0.299 * r + 0.587 * g + 0.114 * b;
        r = l + (r - l) * (1 + amt); g = l + (g - l) * (1 + amt); b = l + (b - l) * (1 + amt);
      }
      if (warm !== 0) { r += warm; b -= warm; }
      out[j] = r * 255 + 0.5; out[j + 1] = g * 255 + 0.5; out[j + 2] = b * 255 + 0.5;
      out[j + 3] = d[j + 3];
    }
    progress(1, 'done');
    return out;
  }

  const api = { process: process, DEFAULTS: DEFAULTS };
  root.BeautyEnhance = api;

  // Web Worker entry point
  if (typeof WorkerGlobalScope !== 'undefined' && root instanceof WorkerGlobalScope) {
    root.onmessage = function (e) {
      const msg = e.data;
      try {
        const img = { width: msg.width, height: msg.height, data: new Uint8ClampedArray(msg.buffer) };
        const out = process(img, msg.options, function (p, stage) {
          root.postMessage({ id: msg.id, type: 'progress', value: p, stage: stage });
        });
        root.postMessage({ id: msg.id, type: 'done', buffer: out.buffer, width: msg.width, height: msg.height }, [out.buffer]);
      } catch (err) {
        root.postMessage({ id: msg.id, type: 'error', message: String(err && err.message || err) });
      }
    };
  }
})(typeof self !== 'undefined' ? self : this);
