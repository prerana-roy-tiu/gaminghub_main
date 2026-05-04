const form = document.getElementById("heartbeat-form");
const dobInput = document.getElementById("dob");
const errorEl = document.getElementById("error");
const resultSection = document.getElementById("result");
const beatsEl = document.getElementById("beats");
const heartEl = document.querySelector(".heart");
const heartbeatSound = document.getElementById("heartbeat-sound");


function animateCountUp(element, target, duration = 2500) {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    let progress = Math.min(elapsed / duration, 1);
    progress = 1 - Math.pow(1 - progress, 3);

    const currentValue = Math.floor(progress * target);
    element.textContent = currentValue.toLocaleString();


    const minSpeed = 0.7; 
    const maxSpeed = 1.5; 
    const speed = maxSpeed - (maxSpeed - minSpeed) * progress;
    heartEl.style.animationDuration = `${speed}s`;

    if (!heartbeatSound.paused) heartbeatSound.currentTime = 0;
    heartbeatSound.play().catch(() => {}); 

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.textContent = "";
  resultSection.hidden = true;

  const dobValue = dobInput.value;
  if (!dobValue) {
    errorEl.textContent = "Please enter your date of birth.";
    return;
  }

  const dob = new Date(dobValue);
  const now = new Date();

  if (dob > now) {
    errorEl.textContent = "Your birth date cannot be in the future!";
    return;
  }

  const diffMs = now - dob;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const beats = diffMinutes * 72;

  resultSection.hidden = false;
  animateCountUp(beatsEl, beats, 2500);
});
