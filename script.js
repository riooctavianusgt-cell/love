document.addEventListener("DOMContentLoaded", function () {
  const text = "Miya, jangan galau lagi yah ❤️";
  let index = 0;

  function typeText() {
    if (index < text.length) {
      document.getElementById("romanticText").innerHTML += text.charAt(index);
      index++;
      setTimeout(typeText, 100);
    }
  }

  typeText();

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

  const noBtn = document.getElementById("noBtn");
  let sadClicks = 0;
  const sadTexts = [
    "enggak , masih galau 😢",
    "masih galau banget 😞",
    "kenapa sih 😭",
    "beneran galau gitu? 🥺",
    "aku jadi sedih nih... 😣",
  ];

  noBtn.addEventListener("click", function (e) {
    e.target.style.position = "absolute";
    e.target.style.top = Math.floor(Math.random() * 90 + 5) + "%";
    e.target.style.left = Math.floor(Math.random() * 90 + 5) + "%";
    sadClicks++;
    e.target.textContent = sadTexts[sadClicks % sadTexts.length];
  });

  document.getElementById("yesBtn").addEventListener("click", function () {
  window.location.href = "index2.html";
});

});
