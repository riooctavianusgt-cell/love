document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const bgm = document.getElementById("bgm2");
  const creditWrapper = document.querySelector(".credit-wrapper");
  const openingText = document.querySelector(".opening-text");
  const loveLetter = document.getElementById("loveLetter");

  startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    openingText.style.display = "none";
    creditWrapper.classList.remove("hidden");
    bgm.play();

    // Tampilkan surat setelah kredit selesai
    setTimeout(() => {
      loveLetter.classList.remove("hidden");
    }, 20000);
  });

  // Hati jatuh
  function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "❤";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = Math.random() * 2 + 3 + "s";
    document.querySelector(".heart-rain").appendChild(heart);
    setTimeout(() => { heart.remove(); }, 5000);
  }

  setInterval(createHeart, 300);

  // Confetti effect
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

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
      if (c.y > canvas.height) c.y = -10;
    });
    requestAnimationFrame(draw);
  }

  draw();
}

// Tampilkan setelah surat muncul
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  bgm.play();
  openingText.style.display = "none";
  creditWrapper.classList.remove("hidden");

  // ⏱️ Timer MULAI SETELAH tombol diklik
  setTimeout(() => {
    loveLetter.classList.remove("hidden");
    launchConfetti();
  }, 20000);
});


});
