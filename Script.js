document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const canvas = document.getElementById('preview-canvas');
  const ctx = canvas.getContext('2d');

  let presetState = null;
  let activeLayerIndex = 0;
  let currentTime = 0;
  let isPlaying = false;
  let animationFrameId = null;

  // UI Elements
  const layerList = document.getElementById('layer-list');
  const galleryPicker = document.getElementById('gallery-picker');
  const presetFileInput = document.getElementById('preset-file-input');
  const btnImportLink = document.getElementById('btn-import-link');
  const btnUsePreset = document.getElementById('btn-use-preset');
  const btnExport = document.getElementById('btn-export');
  const btnSave = document.getElementById('btn-save');
  const btnPlay = document.getElementById('btn-play');
  const timeline = document.getElementById('timeline-slider');

  // Default preset contoh
  const defaultPreset = {
    title: "Cinematic Glow",
    duration: 5.0,
    layers: [
      { id: "l1", name: "Background", imgSrc: "https://picsum.photos/id/1018/800/1200", posX: 0, posY: 0, scale: 1, startTime: 0, endTime: 5, brightness: 100, contrast: 100, saturate: 100, transition: "fade" },
      { id: "l2", name: "Subject", imgSrc: "https://picsum.photos/id/1025/800/1200", posX: 0, posY: 0, scale: 1, startTime: 1, endTime: 4, brightness: 110, contrast: 105, saturate: 120, transition: "zoom" }
    ]
  };

  function loadPreset(data) {
    presetState = data;
    document.getElementById('preset-title').textContent = data.title;
    timeline.max = data.duration;
    loadImages(() => {
      renderLayerList();
      bindInputs();
      btnUsePreset.classList.remove('hidden');
    });
  }

  function loadImages(cb) {
    let loaded = 0;
    presetState.layers.forEach(l => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = l.imgSrc;
      img.onload = () => { l.imgElement = img; if(++loaded === presetState.layers.length) cb(); };
      img.onerror = () => { l.imgElement = null; if(++loaded === presetState.layers.length) cb(); };
    });
  }

  function renderCanvas() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#000"; ctx.fillRect(0,0,canvas.width,canvas.height);
    if(!presetState) return;

    presetState.layers.forEach(l => {
      if(currentTime >= l.startTime && currentTime <= l.endTime && l.imgElement){
        ctx.save();
        let alpha = 1, scale = l.scale, x = canvas.width/2 + l.posX, y = canvas.height/2 + l.posY;
        const p = (currentTime - l.startTime) / (l.endTime - l.startTime);
        if(l.transition === "fade") alpha = p < 0.2? p/0.2 : p > 0.8? (1-p)/0.2 : 1;
        if(l.transition === "zoom") scale += Math.sin(p*Math.PI)*0.1;
        if(l.transition === "slide") x += p < 0.2? (1-p/0.2)*-100 : 0;

        ctx.translate(x,y); ctx.scale(scale,scale);
        ctx.filter = `brightness(${l.brightness}%) contrast(${l.contrast}%) saturate(${l.saturate}%)`;
        ctx.globalAlpha = alpha;
        const w = canvas.width*0.8; const h = (l.imgElement.height/l.imgElement.width)*w;
        ctx.drawImage(l.imgElement, -w/2, -h/2, w, h);
        ctx.restore();
      }
    });
    document.getElementById('time-display').textContent = `${fmt(currentTime)} / ${fmt(presetState.duration)}`;
    timeline.value = currentTime;
  }

  function fmt(s){ return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toFixed(2).padStart(5,'0')}` }

  function loop(ts){
    if(isPlaying){ currentTime += 0.016; if(currentTime > presetState.duration) currentTime = 0; }
    renderCanvas();
    animationFrameId = requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  function renderLayerList(){
    layerList.innerHTML = '';
    presetState.layers.forEach((l,i)=>{
      const div = document.createElement('div');
      div.className = `layer-item ${i===activeLayerIndex?'active':''}`;
      div.innerHTML = `<div class="layer-info"><img src="${l.imgSrc}" class="layer-thumb"><span class="layer-title">${l.name}</span></div><button class="btn btn-outline replace">Ganti</button>`;
      div.onclick = e => { if(!e.target.classList.contains('replace')){ activeLayerIndex=i; renderLayerList(); bindInputs(); } };
      div.querySelector('.replace').onclick = () => { activeLayerIndex=i; galleryPicker.click(); };
      layerList.appendChild(div);
    });
    lucide.createIcons();
  }

  function bindInputs(){
    const l = presetState.layers[activeLayerIndex];
    ['pos-x','pos-y','scale-slider','time-start','time-end','effect-brightness','effect-contrast','effect-saturate'].forEach(id=>{
      document.getElementById(id).value = l[id.replace('scale-slider','scale').replace('effect-','')];
    });
    document.getElementById('effect-transition').value = l.transition;
  }

  // Event Listeners
  ['pos-x','pos-y','scale-slider','time-start','time-end','effect-brightness','effect-contrast','effect-saturate'].forEach(id=>{
    document.getElementById(id).oninput = e => {
      const key = id.replace('scale-slider','scale').replace('effect-','');
      presetState.layers[activeLayerIndex][key] = parseFloat(e.target.value);
    }
  });
  document.getElementById('effect-transition').onchange = e => presetState.layers[activeLayerIndex].transition = e.target.value;
  timeline.oninput = e => currentTime = parseFloat(e.target.value);
  btnPlay.onclick = () => { isPlaying =!isPlaying; btnPlay.innerHTML = `<i data-lucide="${isPlaying?'pause':'play'}"></i>`; lucide.createIcons(); };

  galleryPicker.onchange = e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image(); img.src = ev.target.result;
      img.onload = () => {
        presetState.layers[activeLayerIndex].imgElement = img;
        presetState.layers[activeLayerIndex].imgSrc = ev.target.result;
        renderLayerList();
      }
    };
    reader.readAsDataURL(file);
  };

  presetFileInput.onchange = e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => { try{ loadPreset(JSON.parse(ev.target.result)); } catch{ alert("File preset tidak valid") } };
    reader.readAsText(file);
  };

  btnImportLink.onclick = () => {
    const url = prompt("Masukkan link preset.json:");
    if(!url) return;
    fetch(url).then(r=>r.json()).then(loadPreset).catch(()=>alert("Gagal load link preset"));
  };

  btnUsePreset.onclick = () => {
    btnUsePreset.classList.add('hidden');
    btnExport.classList.remove('hidden');
  };

  btnExport.onclick = () => {
    btnExport.classList.add('hidden');
    document.getElementById('export-progress-container').classList.remove('hidden');
    let p = 0;
    const iv = setInterval(()=>{
      p+=4; document.getElementById('export-progress-fill').style.width = p+'%';
      document.getElementById('export-progress-text').textContent = `Rendering 2990p @ 1020fps: ${p}%`;
      if(p>=100){ clearInterval(iv); document.getElementById('export-progress-container').classList.add('hidden');
        btnSave.href = canvas.toDataURL('image/png'); btnSave.classList.remove('hidden');
      }
    },80);
  };

  // Load default saat awal
  loadPreset(defaultPreset);
});
