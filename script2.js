// script2.js (FINAL)
// Alur: Start -> kredit -> (20s) tampil love letter + confetti
//       Tombol confirm untuk gambar hati DIHANDLE di script2_heartaddon.js

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const bgm = document.getElementById("bgm2");
  const creditWrapper = document.querySelector(".credit-wrapper");
  const openingText = document.querySelector(".opening-text");
  const loveLetter = document.getElementById("loveLetter");

  // ---- Hati jatuh (rain) ----
  function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "❤";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = Math.random() * 2 + 3 + "s";
    document.querySelector(".heart-rain").appendChild(heart);
    setTimeout(() => { heart.remove(); }, 5000);
  }
  // mulai rain langsung / atau nanti? (tetap seperti sebelumnya)
  const heartRainInterval = setInterval(createHeart, 300);

  // ---- Confetti ----
  function launchConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const confetti = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.fill();
        c.y += c.d;
        if (c.y > canvas.height) {
          c.y = -10;
          c.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ---- Start flow (SATU listener saja) ----
  startBtn.addEventListener("click", () => {
    // sembunyikan pembuka
    startBtn.style.display = "none";
    if (openingText) openingText.style.display = "none";

    // tampilkan kredit
    creditWrapper.classList.remove("hidden");

    // mainkan bgm (ignore error autoplay)
    if (bgm && bgm.play) bgm.play().catch(()=>{});

    // setelah 20 detik -> tampil love letter + confetti
    setTimeout(() => {
      loveLetter.classList.remove("hidden");
      launchConfetti();
    }, 20000);
  });
});
