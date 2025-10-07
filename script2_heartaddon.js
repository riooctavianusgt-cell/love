// script2_heartaddon.js (STABIL V2)
// Fix: "For Miya" tidak hilang & glow hati jelas.
// Arsitektur: 
// 1) Phase DRAW: gambar hati sekali (turtle style).
// 2) Phase GLOW: loop tunggal yang menggambar heart glow + teks "For"->"Miya" (typewriter) + optional sparkles.

(function(){
  function onReady(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // ===== Utility =====
  const TAU = Math.PI * 2;
  const clamp01 = v => Math.max(0, Math.min(1, v));

  // Parametric heart
  function heartXY(t){
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
    return {x, y};
  }

  // Audio chime kecil (no file)
  function playChime(freq=880, durMs=200, vol=0.15){
    try{
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const actx = new Ctx();
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(g); g.connect(actx.destination);
      const t0 = actx.currentTime;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(vol, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs/1000);
      o.start(t0);
      o.stop(t0 + durMs/1000 + 0.05);
    }catch(e){}
  }

  // Confetti #2 (pastel, simple)
  function launchConfetti2(ms=2500){
    let canvas = document.getElementById('confettiCanvas2');
    if(!canvas){
      canvas = document.createElement('canvas');
      canvas.id = 'confettiCanvas2';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    function resize(){
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    }
    resize();
    addEventListener('resize', resize);

    const colors = ['#ffc0cb','#ffd1dc','#ffe4e1','#ffe1f0','#ffd6e7','#ffcad4'];
    const parts = Array.from({length:120}, ()=>({
      x: Math.random()*canvas.width,
      y: -Math.random()*canvas.height,
      vx: (Math.random()-0.5)*1,
      vy: Math.random()*2+1,
      r: Math.random()*4+2,
      c: colors[(Math.random()*colors.length)|0]
    }));

    let stopAt = performance.now() + ms;
    let run = true;

    function loop(ts){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const p of parts){
        p.x += p.vx; p.y += p.vy;
        if(p.y > canvas.height+20){ p.y = -10; p.x = Math.random()*canvas.width; }
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,TAU);
        ctx.fill();
      }
      if(run) requestAnimationFrame(loop);
      if(ts >= stopAt){ run = false; setTimeout(()=>ctx.clearRect(0,0,canvas.width,canvas.height), 300); }
    }
    requestAnimationFrame(loop);
  }

  // ===== HEART SCENE =====
  function createHeartScene(canvas){
    const ctx = canvas.getContext('2d');

    // responsive setup (retina-safe)
    function resize(){
      const dpr = Math.max(1, devicePixelRatio || 1);
      canvas.width  = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize();
    addEventListener('resize', resize);

    // geometry
    const cx = innerWidth/2;
    const cy = innerHeight/2;
    const scale = Math.min(innerWidth, innerHeight)/40;

    // precompute curve
    const steps = 800;
    const pts = [];
    for(let i=0; i<=steps; i++){
      const t = (i/steps)*TAU;
      const p = heartXY(t);
      pts.push({ x: cx + p.x*scale, y: cy - p.y*scale });
    }

    // Drawing helpers
    function drawHeartPath(lw=3, stroke='#d6336c', upto=pts.length){
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for(let i=1;i<upto;i++){
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    }

    // Sparkles state (render in glow phase)
    const sparkles = [];
    function addSparkle(){
      const base = Math.min(innerWidth, innerHeight)*0.6;
      sparkles.push({
        x: cx + (Math.random()-0.5)*base,
        y: cy + (Math.random()-0.5)*base,
        r: Math.random()*1.2 + 0.4,
        life: 0,
        max: 700 + Math.random()*600
      });
      if (sparkles.length > 60) sparkles.shift();
    }
    function drawSparkles(){
      if(Math.random()<0.6) addSparkle();
      for(const s of sparkles){
        s.life += 16;
        const a = 1 - Math.abs((s.life/s.max)*2 - 1);
        ctx.save();
        ctx.globalAlpha = Math.max(0,a);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(s.x,s.y,s.r,0,TAU);
        ctx.fill();
        ctx.restore();
      }
    }

    // Phase 1: DRAW turtle-style once
    function drawPhase(duration=3000, onDone){
      let start = null;
      function frame(ts){
        if(!start) start = ts;
        const p = clamp01((ts - start)/duration);
        const upto = Math.max(1, Math.floor(1 + (pts.length-1)*p));

        ctx.clearRect(0,0,innerWidth,innerHeight);
        drawHeartPath(3, '#d6336c', upto);

        // turtle head
        if(p < 1){
          const head = pts[upto-1];
          const prev = pts[Math.max(0, upto-2)];
          const ang = Math.atan2(head.y - prev.y, head.x - prev.x);
          ctx.save();
          ctx.translate(head.x, head.y);
          ctx.rotate(ang);
          ctx.beginPath();
          const s = 8;
          ctx.moveTo(0,0);
          ctx.lineTo(-s, s/2);
          ctx.lineTo(-s,-s/2);
          ctx.closePath();
          ctx.fillStyle = '#d6336c';
          ctx.fill();
          ctx.restore();

          requestAnimationFrame(frame);
        } else {
          onDone && onDone();
        }
      }
      requestAnimationFrame(frame);
    }

    // Phase 2: GLOW + TYPEWRITER in ONE LOOP (stabil)
    function glowPhase(){
      const t0 = performance.now();

      // typewriter state
      const word1 = 'For';
      const word2 = 'Miya';
      const base = Math.min(innerWidth, innerHeight);
      const fontSize = Math.max(28, Math.floor(base*0.06));
      const forY  = cy - fontSize*0.7;
      const miyaY = cy + fontSize*0.7;
      const letterDelay = 90;        // ms/letter
      const betweenWordsDelay = 500; // ms
      const showForAt = 300;         // ms setelah glow mulai
      const showMiyaAt = showForAt + word1.length*letterDelay + betweenWordsDelay;

      // chime trigger flags
      let forChimePlayed = false;
      let miyaChimePlayed = false;

      function frame(ts){
        const t = (ts - t0)/1000; // detik
        ctx.clearRect(0,0,innerWidth,innerHeight);

        // 1) HEART GLOW
        const beat = (Math.sin(t*2*Math.PI*0.8)+1)/2; // 0..1 @0.8Hz
        const lw = 3 + beat*1.6;
        const blur = 10 + beat*18;

        ctx.save();
        ctx.shadowBlur = blur;
        ctx.shadowColor = '#d6336c';
        drawHeartPath(lw, '#d6336c');
        ctx.restore();

        // 2) SPARKLES di atas glow
        drawSparkles();

        // 3) TYPEWRITER TEXT
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${fontSize}px Segoe UI, sans-serif`;
        ctx.fillStyle = '#d6336c';

        const elapsedMs = (ts - t0);

        // "For"
        if(elapsedMs > showForAt){
          !forChimePlayed && (playChime(880, 200, 0.2), forChimePlayed = true);
          const letters = Math.min(word1.length, Math.floor((elapsedMs - showForAt)/letterDelay)+1);
          ctx.fillText(word1.slice(0, letters), cx, forY);
        }

        // "Miya"
        if(elapsedMs > showMiyaAt){
          !miyaChimePlayed && (playChime(660, 200, 0.2), miyaChimePlayed = true);
          const letters = Math.min(word2.length, Math.floor((elapsedMs - showMiyaAt)/letterDelay)+1);
          // keep full "For" visible
          ctx.fillText(word1, cx, forY);
          ctx.fillText(word2.slice(0, letters), cx, miyaY);
        }

        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      // Confetti#2 on start of phase
      launchConfetti2(2800);
    }

    return {
      start: ()=>{
        // optional overlay (soft gradient)
        let overlay = document.getElementById('heartBgOverlay');
        if(!overlay){
          overlay = document.createElement('div');
          overlay.id = 'heartBgOverlay';
          overlay.style.position = 'fixed';
          overlay.style.inset = '0';
          overlay.style.pointerEvents = 'none';
          overlay.style.zIndex = '11';
          overlay.style.background = 'radial-gradient(1200px 800px at 50% 50%, rgba(255,182,193,0.55), rgba(255,192,203,0.0))';
          overlay.style.opacity = '0';
          overlay.style.transition = 'opacity .8s ease';
          document.body.appendChild(overlay);
        }
        overlay.offsetHeight; // reflow
        overlay.style.opacity = '1';

        // Phase 1 then Phase 2
        drawPhase(3000, glowPhase);
      }
    };
  }

  // ===== Wiring to UI =====
  onReady(()=>{
    const loveLetter   = document.getElementById('loveLetter');
    const confirmBtn   = document.getElementById('confirmHeartBtn');
    const turtleCanvas = document.getElementById('turtleCanvas');

    if(!confirmBtn || !turtleCanvas || !loveLetter) return;

    // Replay button
    let replay = document.getElementById('replayHeartBtn');
    if(!replay){
      replay = document.createElement('button');
      replay.id = 'replayHeartBtn';
      replay.textContent = 'Replay ❤️';
      replay.style.display = 'none';
      replay.style.position = 'fixed';
      replay.style.bottom = '24px';
      replay.style.left = '50%';
      replay.style.transform = 'translateX(-50%)';
      replay.style.background = '#fff0f5';
      replay.style.color = '#d6336c';
      replay.style.border = 'none';
      replay.style.borderRadius = '999px';
      replay.style.padding = '10px 18px';
      replay.style.fontWeight = '700';
      replay.style.boxShadow = '0 6px 18px rgba(255,105,180,.35)';
      replay.style.cursor = 'pointer';
      replay.style.zIndex = '17';
      document.body.appendChild(replay);
    }

    function startScene(){
      // hide letter, show canvas
      loveLetter.classList.add('hidden');
      turtleCanvas.style.display = 'block';

      // clear canvas
      const ctx = turtleCanvas.getContext('2d');
      ctx.clearRect(0,0,innerWidth,innerHeight);

      // start scene
      const scene = createHeartScene(turtleCanvas);
      scene.start();

      // show replay after sedikit delay
      setTimeout(()=>{ replay.style.display = 'inline-block'; }, 3500);
    }

    confirmBtn.addEventListener('click', startScene);

    replay.addEventListener('click', ()=>{
      replay.style.display = 'none';
      startScene();
    });
  });
})();
