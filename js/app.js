(function () {
  'use strict';

  // ---------- i18n ----------
  const I18N = {
    ar: {
      appName: 'Beauty Enhance',
      heroTitle: 'اجعل صورك أوضح وأجمل بلمسة واحدة',
      heroSub: 'تحسين الجودة، تنعيم البشرة، تكبير الدقة، وإصلاح الألوان — كل ذلك داخل جهازك دون رفع صورك لأي خادم.',
      dropTitle: 'اختر صورة أو اسحبها هنا',
      dropSub: 'JPG ، PNG ، WEBP — يمكنك أيضاً اللصق (Ctrl+V)',
      choose: 'اختيار صورة',
      f1: 'تحسين تلقائي ذكي', f2: 'تجميل البورتريه', f3: 'تكبير حتى 4×', f4: 'ترميم الصور القديمة',
      before: 'قبل', after: 'بعد',
      working: 'جارٍ التحسين…',
      modeTitle: 'نوع التحسين', scaleTitle: 'الدقة', tuneTitle: 'ضبط يدوي',
      skinOnly: 'تنعيم البشرة فقط (حماية العيون والشعر)',
      reset: 'إعادة الضبط', download: 'حفظ الصورة', newPhoto: 'صورة جديدة',
      privacy: '🔒 تتم المعالجة بالكامل داخل متصفحك. صورك لا تغادر جهازك.',
      m_auto: 'تلقائي', m_beauty: 'تجميل', m_hd: 'وضوح HD', m_old: 'صورة قديمة', m_color: 'ألوان', m_night: 'إضاءة', m_none: 'الأصل',
      s_autoLevels: 'التوازن التلقائي', s_whiteBalance: 'توازن الأبيض', s_denoise: 'إزالة التشويش',
      s_smooth: 'تنعيم البشرة', s_sharpen: 'الحدّة', s_clarity: 'الوضوح',
      s_brightness: 'السطوع', s_contrast: 'التباين', s_vibrance: 'حيوية الألوان', s_warmth: 'الدفء',
      st_prepare: 'تحضير الصورة…', st_color: 'تصحيح الألوان…', st_denoise: 'إزالة التشويش…',
      st_beauty: 'تنعيم البشرة…', st_detail: 'استعادة التفاصيل…', st_finish: 'اللمسات الأخيرة…', st_done: 'تم!', st_upscale: 'تكبير الدقة…',
      saved: 'تم حفظ الصورة ✓', badFile: 'الملف ليس صورة صالحة', scaleLimited: 'تم تقليل التكبير لتجنّب تجاوز حدود الذاكرة',
      aiTitle: 'أدوات الذكاء الاصطناعي', ai_bg: 'إزالة الخلفية', ai_color: 'تلوين الصورة', ai_face: 'ترميم الوجوه',
      ai_undo: 'إلغاء تعديلات الذكاء الاصطناعي', cloudTag: 'سحابي', freeTag: 'مجاني',
      bgTitle: 'الخلفية', bg_transparent: 'شفافة', bg_white: 'بيضاء', bg_blur: 'ضبابية', bg_color: 'لون',
      aiSettings: 'إعدادات الذكاء الاصطناعي (fal.ai)', falKey: 'مفتاح fal.ai API', falKeyHint: 'يُحفظ على جهازك فقط ويُرسل إلى fal.ai وحدها. احصل عليه من fal.ai/dashboard/keys',
      cloudColor: 'استخدام السحابة للتلوين (أسرع وأدق على الجوال)', saveKey: 'حفظ', keySaved: 'تم حفظ المفتاح ✓',
      st_loadModel: 'تحميل النموذج… (مرة واحدة فقط)', st_thinking: 'الذكاء الاصطناعي يعمل…', st_upload: 'إرسال الصورة…', st_download: 'استلام النتيجة…',
      needKey: 'هذه الميزة تحتاج مفتاح fal.ai — أضيفيه في الإعدادات', badKey: 'مفتاح fal.ai غير صحيح', aiFail: 'تعذّر تنفيذ العملية: ', aiLoading: 'أدوات الذكاء الاصطناعي ما زالت تُحمَّل، حاولي بعد لحظة',
      cloudNote: 'سيتم إرسال الصورة إلى fal.ai لمعالجتها.',
    },
    en: {
      appName: 'Beauty Enhance',
      heroTitle: 'Make your photos sharper and more beautiful in one tap',
      heroSub: 'Enhance quality, smooth skin, upscale resolution and fix colors — all on your device. Your photos are never uploaded.',
      dropTitle: 'Choose a photo or drop it here',
      dropSub: 'JPG, PNG, WEBP — you can also paste (Ctrl+V)',
      choose: 'Choose photo',
      f1: 'Smart auto enhance', f2: 'Portrait beauty', f3: 'Upscale up to 4×', f4: 'Old photo restore',
      before: 'Before', after: 'After',
      working: 'Enhancing…',
      modeTitle: 'Enhancement', scaleTitle: 'Resolution', tuneTitle: 'Fine-tune',
      skinOnly: 'Smooth skin only (protect eyes & hair)',
      reset: 'Reset', download: 'Save photo', newPhoto: 'New photo',
      privacy: '🔒 Processing runs entirely in your browser. Your photos never leave your device.',
      m_auto: 'Auto', m_beauty: 'Beauty', m_hd: 'HD Clarity', m_old: 'Old photo', m_color: 'Color', m_night: 'Low light', m_none: 'Original',
      s_autoLevels: 'Auto levels', s_whiteBalance: 'White balance', s_denoise: 'Denoise',
      s_smooth: 'Skin smoothing', s_sharpen: 'Sharpness', s_clarity: 'Clarity',
      s_brightness: 'Brightness', s_contrast: 'Contrast', s_vibrance: 'Vibrance', s_warmth: 'Warmth',
      st_prepare: 'Preparing…', st_color: 'Correcting colors…', st_denoise: 'Removing noise…',
      st_beauty: 'Smoothing skin…', st_detail: 'Restoring detail…', st_finish: 'Finishing touches…', st_done: 'Done!', st_upscale: 'Upscaling…',
      saved: 'Photo saved ✓', badFile: 'That file is not a valid image', scaleLimited: 'Upscale reduced to stay within memory limits',
      aiTitle: 'AI tools', ai_bg: 'Remove background', ai_color: 'Colorize photo', ai_face: 'Restore faces',
      ai_undo: 'Undo AI edits', cloudTag: 'Cloud', freeTag: 'Free',
      bgTitle: 'Background', bg_transparent: 'Transparent', bg_white: 'White', bg_blur: 'Blurred', bg_color: 'Color',
      aiSettings: 'AI settings (fal.ai)', falKey: 'fal.ai API key', falKeyHint: 'Stored on this device only and sent only to fal.ai. Get one at fal.ai/dashboard/keys',
      cloudColor: 'Use the cloud for colorizing (faster and better on phones)', saveKey: 'Save', keySaved: 'Key saved ✓',
      st_loadModel: 'Downloading model… (first time only)', st_thinking: 'AI at work…', st_upload: 'Sending photo…', st_download: 'Receiving result…',
      needKey: 'This feature needs a fal.ai key — add it in AI settings', badKey: 'The fal.ai key was rejected', aiFail: 'Could not finish: ', aiLoading: 'AI tools are still loading, try again in a moment',
      cloudNote: 'The photo will be sent to fal.ai for processing.',
    },
  };
  let lang = 'ar';
  try { lang = localStorage.getItem('be-lang') || 'ar'; } catch (e) { /* ignore */ }
  const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;

  // ---------- Presets ----------
  const SLIDERS = [
    { key: 'autoLevels', min: 0, max: 1 },
    { key: 'whiteBalance', min: 0, max: 1 },
    { key: 'denoise', min: 0, max: 1 },
    { key: 'smooth', min: 0, max: 1 },
    { key: 'sharpen', min: 0, max: 1 },
    { key: 'clarity', min: 0, max: 1 },
    { key: 'brightness', min: -1, max: 1 },
    { key: 'contrast', min: -1, max: 1 },
    { key: 'vibrance', min: -1, max: 1 },
    { key: 'warmth', min: -1, max: 1 },
  ];
  const ZERO = { autoLevels: 0, whiteBalance: 0, denoise: 0, smooth: 0, sharpen: 0, clarity: 0, brightness: 0, contrast: 0, vibrance: 0, warmth: 0 };
  const MODES = [
    { id: 'auto', icon: '✦', p: { autoLevels: .7, whiteBalance: .4, denoise: .35, sharpen: .5, clarity: .3, vibrance: .2, contrast: .05 } },
    { id: 'beauty', icon: '♡', p: { autoLevels: .5, whiteBalance: .3, denoise: .3, smooth: .7, sharpen: .35, clarity: .1, brightness: .08, vibrance: .12, warmth: .12 } },
    { id: 'hd', icon: '◈', scale: 2, p: { autoLevels: .4, denoise: .45, sharpen: .75, clarity: .35, vibrance: .1 } },
    { id: 'old', icon: '⟲', p: { autoLevels: 1, whiteBalance: .7, denoise: .8, sharpen: .6, clarity: .35, contrast: .1, vibrance: .15 } },
    { id: 'color', icon: '❋', p: { autoLevels: .85, whiteBalance: .8, vibrance: .4, contrast: .1, clarity: .15, sharpen: .2 } },
    { id: 'night', icon: '☾', p: { autoLevels: .8, whiteBalance: .4, denoise: .7, brightness: .35, clarity: .2, sharpen: .3, vibrance: .15 } },
  ];
  const MAX_PIXELS = 16.7e6;  // keep canvases within mobile browser limits
  const MAX_INPUT_SIDE = 4096;

  // ---------- State ----------
  const state = {
    original: null,      // canvas: the photo as loaded (possibly downscaled)
    source: null,        // canvas: original + any AI edits; the enhance pipeline starts here
    aiEdited: false,
    hasAlpha: false,     // true after background removal
    bg: 'transparent',   // transparent | white | blur | #rrggbb
    srcW: 0, srcH: 0,
    scale: 1,
    effectiveScale: 1,
    base: null,          // ImageData at current scale (unprocessed)
    params: Object.assign({}, ZERO),
    skinOnly: true,
    mode: 'auto',
    fileName: 'photo',
    jobId: 0,
    split: 0.5,
  };

  // ---------- Elements ----------
  const $ = (id) => document.getElementById(id);
  const uploadView = $('uploadView'), editorView = $('editorView');
  const fileInput = $('fileInput'), dropzone = $('dropzone');
  const stage = $('stage'), beforeCanvas = $('beforeCanvas'), afterCanvas = $('afterCanvas'), divider = $('divider');
  const busy = $('busy'), busyText = $('busyText'), busyBar = $('busyBar');
  const modesEl = $('modes'), slidersEl = $('sliders'), scaleGroup = $('scaleGroup');
  const meta = $('meta'), toastEl = $('toast');

  // ---------- Worker (with main-thread fallback) ----------
  let worker = null;
  try {
    worker = new Worker('js/enhance.js');
  } catch (e) { worker = null; }

  function runEnhance(imageData, options, onProgress) {
    const id = ++state.jobId;
    return new Promise(function (resolve, reject) {
      if (worker) {
        const copy = new Uint8ClampedArray(imageData.data);
        const fail = function () {
          // Worker unavailable (e.g. opened from file://) — fall back to the main thread
          worker.removeEventListener('message', handler);
          worker.removeEventListener('error', fail);
          worker = null;
          runEnhance(imageData, options, onProgress).then(function (r) { resolve({ id: id, data: r.data }); state.jobId = id; }, reject);
        };
        worker.addEventListener('error', fail);
        const handler = function (e) {
          const m = e.data;
          if (m.id !== id) return;
          if (m.type === 'progress') onProgress(m.value, m.stage);
          else {
            worker.removeEventListener('message', handler);
            worker.removeEventListener('error', fail);
            if (m.type === 'done') resolve({ id: id, data: new Uint8ClampedArray(m.buffer) });
            else reject(new Error(m.message));
          }
        };
        worker.addEventListener('message', handler);
        worker.postMessage({ id: id, width: imageData.width, height: imageData.height, buffer: copy.buffer, options: options }, [copy.buffer]);
      } else {
        // let the spinner paint before blocking work
        setTimeout(function () {
          try {
            const out = window.BeautyEnhance.process(imageData, options, onProgress);
            resolve({ id: id, data: out });
          } catch (err) { reject(err); }
        }, 30);
      }
    });
  }

  // ---------- UI building ----------
  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    $('langBtn').textContent = lang === 'ar' ? 'EN' : 'عربي';
    buildModes();
    buildSliders();
  }

  function buildModes() {
    modesEl.innerHTML = '';
    MODES.forEach(function (m) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mode' + (state.mode === m.id ? ' active' : '');
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', state.mode === m.id);
      b.innerHTML = '<span class="m-ico" aria-hidden="true">' + m.icon + '</span><span>' + t('m_' + m.id) + '</span>';
      b.onclick = function () { selectMode(m.id); };
      modesEl.appendChild(b);
    });
  }

  function buildSliders() {
    slidersEl.innerHTML = '';
    SLIDERS.forEach(function (s) {
      const row = document.createElement('div');
      row.className = 'slider-row';
      const id = 'sl_' + s.key;
      row.innerHTML = '<label for="' + id + '"><span>' + t('s_' + s.key) + '</span><output id="o_' + s.key + '"></output></label>' +
        '<input type="range" id="' + id + '" min="' + s.min * 100 + '" max="' + s.max * 100 + '" step="1">';
      slidersEl.appendChild(row);
      const input = row.querySelector('input');
      input.value = Math.round(state.params[s.key] * 100);
      row.querySelector('output').textContent = input.value;
      input.addEventListener('input', function () {
        state.params[s.key] = input.value / 100;
        row.querySelector('output').textContent = input.value;
        scheduleEnhance();
      });
    });
  }

  function syncSliders() {
    SLIDERS.forEach(function (s) {
      const input = $('sl_' + s.key);
      if (!input) return;
      input.value = Math.round(state.params[s.key] * 100);
      $('o_' + s.key).textContent = input.value;
    });
  }

  function selectMode(id) {
    state.mode = id;
    const m = MODES.find(function (x) { return x.id === id; });
    state.params = Object.assign({}, ZERO, m ? m.p : {});
    if (m && m.scale && state.scale < m.scale) setScale(m.scale, true);
    buildModes();
    syncSliders();
    enhance();
  }

  function setScale(s, silent) {
    state.scale = s;
    scaleGroup.querySelectorAll('button').forEach(function (b) { b.classList.toggle('active', Number(b.dataset.scale) === s); });
    state.base = null;
    if (!silent) enhance();
  }

  // ---------- Image loading ----------
  function loadFile(file) {
    if (!file || !/^image\//.test(file.type)) { toast(t('badFile')); return; }
    state.fileName = (file.name || 'photo').replace(/\.[^.]+$/, '');
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = function () {
      let w = img.naturalWidth, h = img.naturalHeight;
      const k = Math.min(1, MAX_INPUT_SIDE / Math.max(w, h));
      w = Math.round(w * k); h = Math.round(h * k);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      state.original = c; state.source = c; state.srcW = w; state.srcH = h; state.base = null;
      state.aiEdited = false; state.hasAlpha = false; state.bg = 'transparent';
      updateAiUi();
      uploadView.hidden = true; editorView.hidden = false;
      window.scrollTo(0, 0);
      const known = MODES.some(function (m) { return m.id === state.mode; });
      selectMode(known ? state.mode : 'auto');
    };
    img.onerror = function () { URL.revokeObjectURL(url); toast(t('badFile')); };
    img.src = url;
  }

  // Step-wise 2× upscaling keeps edges smoother than a single big jump.
  function buildBase() {
    let s = state.scale;
    while (s > 1 && state.srcW * state.srcH * s * s > MAX_PIXELS) s /= 2;
    if (s !== state.scale) toast(t('scaleLimited'));
    state.effectiveScale = s;
    let cur = state.source, cw = state.srcW, ch = state.srcH;
    const tw = state.srcW * s, th = state.srcH * s;
    while (cw < tw) {
      const nw = Math.min(tw, cw * 2), nh = Math.min(th, ch * 2);
      const c = document.createElement('canvas');
      c.width = nw; c.height = nh;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(cur, 0, 0, nw, nh);
      cur = c; cw = nw; ch = nh;
    }
    beforeCanvas.width = afterCanvas.width = cw;
    beforeCanvas.height = afterCanvas.height = ch;
    const bctx = beforeCanvas.getContext('2d');
    // "Before" shows the original pixels (nearest-neighbour when upscaled) for an honest comparison
    bctx.imageSmoothingEnabled = false;
    bctx.drawImage(state.original, 0, 0, cw, ch);
    const tmp = cur.getContext('2d');
    state.base = tmp.getImageData(0, 0, cw, ch);
    fitStage();
  }

  // ---------- Enhance ----------
  let debounce = null;
  function scheduleEnhance() {
    state.mode = 'custom';
    modesEl.querySelectorAll('.mode').forEach(function (b) { b.classList.remove('active'); });
    clearTimeout(debounce);
    debounce = setTimeout(enhance, 350);
  }

  function showBusy(on) { busy.hidden = !on; if (on) { busyBar.style.width = '0%'; busyText.textContent = t('working'); } }

  async function enhance() {
    if (!state.source) return;
    showBusy(true);
    if (!state.base) {
      busyText.textContent = t('st_upscale');
      await new Promise(function (r) { setTimeout(r, 30); });
      buildBase();
    }
    const opts = Object.assign({}, state.params, { skinOnly: state.skinOnly });
    const isZero = Object.keys(ZERO).every(function (k) { return !opts[k]; });
    try {
      let result;
      if (isZero) result = { id: ++state.jobId, data: state.base.data };
      else result = await runEnhance(state.base, opts, function (p, stage) {
        busyBar.style.width = Math.round(p * 100) + '%';
        busyText.textContent = t('st_' + stage);
      });
      if (result.id !== state.jobId) return; // a newer job superseded this one
      const out = new ImageData(new Uint8ClampedArray(result.data), state.base.width, state.base.height);
      lastResult = out;
      renderAfter();
      meta.textContent = state.srcW + '×' + state.srcH + '  →  ' + state.base.width + '×' + state.base.height +
        (state.effectiveScale > 1 ? '  (' + state.effectiveScale + '×)' : '');
      showBusy(false);
    } catch (err) {
      console.error(err);
      showBusy(false);
      toast(String(err.message || err));
    }
  }

  // ---------- Output compositing (background fill) ----------
  let lastResult = null;
  const layer = document.createElement('canvas');
  function renderAfter() {
    if (!lastResult) return;
    const w = lastResult.width, h = lastResult.height;
    layer.width = w; layer.height = h;
    layer.getContext('2d').putImageData(lastResult, 0, 0);
    const ctx = afterCanvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    if (state.hasAlpha && state.bg !== 'transparent') {
      if (state.bg === 'white') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
      else if (state.bg === 'blur') {
        ctx.filter = 'blur(' + Math.round(Math.max(w, h) / 60) + 'px)';
        ctx.drawImage(beforeCanvas, -w * 0.03, -h * 0.03, w * 1.06, h * 1.06);
        ctx.filter = 'none';
      } else { ctx.fillStyle = state.bg; ctx.fillRect(0, 0, w, h); }
    }
    ctx.drawImage(layer, 0, 0);
    ctx.restore();
    stage.classList.toggle('checker', state.hasAlpha && state.bg === 'transparent');
  }

  // ---------- AI tools ----------
  const aiButtons = { bg: $('aiBg'), color: $('aiColor'), face: $('aiFace') };
  function getKey() { try { return localStorage.getItem('be-fal-key') || ''; } catch (e) { return ''; } }
  function useCloudColor() { try { return localStorage.getItem('be-cloud-color') === '1'; } catch (e) { return false; } }

  function updateAiUi() {
    $('bgOptions').hidden = !state.hasAlpha;
    $('aiUndo').hidden = !state.aiEdited;
    document.querySelectorAll('#bgOptions [data-bg]').forEach(function (b) {
      b.classList.toggle('active', b.dataset.bg === state.bg || (b.dataset.bg === 'color' && /^#/.test(state.bg)));
    });
  }

  function aiReady() {
    if (window.BeautyAI) return true;
    toast(t('aiLoading'));
    return false;
  }

  async function runAi(kind) {
    if (!state.source || !aiReady()) return;
    const progress = function (p, stage) {
      busyBar.style.width = Math.round(p * 100) + '%';
      busyText.textContent = t('st_' + stage);
    };
    const cloud = kind === 'face' || (kind === 'color' && useCloudColor());
    if (cloud && !getKey()) { $('aiSettingsBox').open = true; $('tune').open = false; $('falKey').focus(); toast(t('needKey')); return; }
    Object.values(aiButtons).forEach(function (b) { b.disabled = true; });
    showBusy(true);
    busyText.textContent = cloud ? t('st_upload') : t('st_loadModel');
    try {
      let canvas;
      if (kind === 'bg') canvas = await window.BeautyAI.removeBackground(state.source, progress);
      else if (cloud) canvas = await window.BeautyAI.cloudRun(kind === 'face' ? 'face' : 'colorize', state.source, getKey(), progress);
      else canvas = await window.BeautyAI.colorizeLocal(state.source, progress);
      // Bring the result back to the working size so before/after line up.
      if (canvas.width !== state.srcW || canvas.height !== state.srcH) {
        const c = document.createElement('canvas');
        c.width = state.srcW; c.height = state.srcH;
        const cx = c.getContext('2d');
        cx.imageSmoothingQuality = 'high';
        cx.drawImage(canvas, 0, 0, c.width, c.height);
        canvas = c;
      }
      state.source = canvas;
      state.aiEdited = true;
      if (kind === 'bg') { state.hasAlpha = true; state.bg = 'transparent'; $('formatSel').value = 'image/png'; }
      state.base = null;
      updateAiUi();
      await enhance();
    } catch (err) {
      console.error(err);
      showBusy(false);
      const m = String(err && err.message || err);
      toast(m === 'NO_KEY' ? t('needKey') : m === 'BAD_KEY' ? t('badKey') : t('aiFail') + m);
    } finally {
      Object.values(aiButtons).forEach(function (b) { b.disabled = false; });
    }
  }

  aiButtons.bg.addEventListener('click', function () { runAi('bg'); });
  aiButtons.color.addEventListener('click', function () { runAi('color'); });
  aiButtons.face.addEventListener('click', function () { runAi('face'); });
  $('aiUndo').addEventListener('click', function () {
    state.source = state.original; state.aiEdited = false; state.hasAlpha = false; state.bg = 'transparent';
    state.base = null; updateAiUi(); enhance();
  });
  $('bgOptions').addEventListener('click', function (e) {
    const b = e.target.closest('[data-bg]');
    if (!b) return;
    if (b.dataset.bg === 'color') { $('bgColor').click(); return; }
    state.bg = b.dataset.bg; updateAiUi(); renderAfter();
  });
  $('bgColor').addEventListener('input', function (e) { state.bg = e.target.value; updateAiUi(); renderAfter(); });

  $('falKey').value = getKey();
  $('cloudColor').checked = useCloudColor();
  $('saveKey').addEventListener('click', function () {
    try { localStorage.setItem('be-fal-key', $('falKey').value.trim()); } catch (e) { /* ignore */ }
    toast(t('keySaved'));
  });
  $('cloudColor').addEventListener('change', function (e) {
    try { localStorage.setItem('be-cloud-color', e.target.checked ? '1' : '0'); } catch (err) { /* ignore */ }
  });

  // ---------- Before/after slider ----------
  function fitStage() {
    const w = afterCanvas.width, h = afterCanvas.height;
    if (!w) return;
    const maxW = stage.parentElement.clientWidth;
    const maxH = Math.max(240, window.innerHeight * 0.7);
    const k = Math.min(maxW / w, maxH / h);
    const dw = Math.floor(w * k), dh = Math.floor(h * k);
    [afterCanvas, beforeCanvas].forEach(function (c) { c.style.width = dw + 'px'; c.style.height = dh + 'px'; });
    stage.style.width = dw + 'px';
    stage.style.margin = '0 auto';
    setSplit(state.split);
  }

  function setSplit(f) {
    f = Math.max(0, Math.min(1, f));
    state.split = f;
    beforeCanvas.style.clipPath = 'inset(0 ' + ((1 - f) * 100) + '% 0 0)';
    divider.style.left = (f * 100) + '%';
    divider.setAttribute('aria-valuenow', Math.round(f * 100));
  }

  let dragging = false;
  stage.addEventListener('pointerdown', function (e) {
    dragging = true; stage.setPointerCapture(e.pointerId); move(e);
  });
  stage.addEventListener('pointermove', function (e) { if (dragging) move(e); });
  stage.addEventListener('pointerup', function () { dragging = false; });
  stage.addEventListener('pointercancel', function () { dragging = false; });
  function move(e) {
    const r = stage.getBoundingClientRect();
    setSplit((e.clientX - r.left) / r.width);
  }
  divider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { setSplit(state.split - 0.05); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setSplit(state.split + 0.05); e.preventDefault(); }
  });
  window.addEventListener('resize', fitStage);

  // ---------- Download ----------
  $('downloadBtn').addEventListener('click', function () {
    const type = $('formatSel').value;
    const ext = type === 'image/png' ? 'png' : 'jpg';
    let src = afterCanvas;
    if (type === 'image/jpeg' && state.hasAlpha) {
      src = document.createElement('canvas');
      src.width = afterCanvas.width; src.height = afterCanvas.height;
      const cx = src.getContext('2d');
      cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, src.width, src.height);
      cx.drawImage(afterCanvas, 0, 0);
    }
    src.toBlob(function (blob) {
      if (!blob) return;
      const file = new File([blob], state.fileName + '-enhanced.' + ext, { type: type });
      // Mobile: offer the share sheet so it can go straight to the gallery
      if (navigator.canShare && navigator.canShare({ files: [file] }) && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        navigator.share({ files: [file] }).catch(function () { saveBlob(file); });
      } else saveBlob(file);
    }, type, 0.95);
  });
  function saveBlob(file) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    toast(t('saved'));
  }

  // ---------- Misc events ----------
  fileInput.addEventListener('change', function () { loadFile(fileInput.files[0]); fileInput.value = ''; });
  ['dragenter', 'dragover'].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add('drag'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove('drag'); });
  });
  dropzone.addEventListener('drop', function (e) { loadFile(e.dataTransfer.files[0]); });
  dropzone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
  document.addEventListener('dragover', function (e) { e.preventDefault(); });
  document.addEventListener('drop', function (e) { e.preventDefault(); if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });
  document.addEventListener('paste', function (e) {
    const item = Array.from(e.clipboardData ? e.clipboardData.items : []).find(function (i) { return i.type.startsWith('image/'); });
    if (item) loadFile(item.getAsFile());
  });

  scaleGroup.addEventListener('click', function (e) {
    const b = e.target.closest('button[data-scale]');
    if (b) setScale(Number(b.dataset.scale));
  });
  $('skinOnly').addEventListener('change', function (e) { state.skinOnly = e.target.checked; enhance(); });
  $('resetBtn').addEventListener('click', function () { selectMode('auto'); });
  $('newBtn').addEventListener('click', function () {
    state.source = null; state.original = null; state.base = null; lastResult = null;
    editorView.hidden = true; uploadView.hidden = false;
  });
  $('langBtn').addEventListener('click', function () {
    lang = lang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('be-lang', lang); } catch (e) { /* ignore */ }
    applyLang();
  });

  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  applyLang();
})();
