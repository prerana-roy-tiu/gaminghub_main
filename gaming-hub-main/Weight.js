
const GRAVITY = {
  mercury: 0.38,
  venus: 0.91,
  earth: 1.0,
  moon: 0.165,
  mars: 0.38,
  jupiter: 2.34,
  saturn: 1.06,
  uranus: 0.92,
  neptune: 1.19,
  pluto: 0.06,
  sun: 27.01,
};

const NAMES = {
  mercury: "Mercury",
  venus: "Venus",
  earth: "Earth",
  moon: "the Moon",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
  sun: "the Sun",
};

const form = document.getElementById("weight-form");
const weightInput = document.getElementById("weight");
const unitSelect = document.getElementById("unit");
const planetSelect = document.getElementById("planet");
const errorEl = document.getElementById("error");

const resultSection = document.getElementById("result-section");
const planetNameEl = document.getElementById("planet-name");
const convertedEl = document.getElementById("converted");
const resultUnitEl = document.getElementById("result-unit");
const detailEl = document.getElementById("detail");

function formatNumber(n, maxDecimals = 2) {
  return Number(n).toLocaleString(undefined, {
    maximumFractionDigits: maxDecimals,
  });
}

function calculate() {
  const raw = weightInput.value.trim();
  const unit = unitSelect.value; 
  const planetKey = planetSelect.value;

  
  errorEl.textContent = "";
  resultSection.hidden = true;

  if (raw === "") {
    errorEl.textContent = "Please enter a number.";
    return;
  }
  const weight = Number(raw);
  if (!Number.isFinite(weight)) {
    errorEl.textContent = "Invalid number.";
    return;
  }
  if (weight <= 0) {
    errorEl.textContent = "Weight must be greater than zero.";
    return;
  }

  
  const factor = GRAVITY[planetKey];
  const converted = weight * factor;

  planetNameEl.textContent = NAMES[planetKey];
  convertedEl.textContent = formatNumber(converted, 2);
  resultUnitEl.textContent = unit;

  const friendly =
    unit === "kg"
      ? `If you weigh ${formatNumber(weight)} kg on Earth, you would weigh ${formatNumber(
          converted
        )} kg on ${NAMES[planetKey]} (gravity ×${factor}).`
      : `If you weigh ${formatNumber(weight)} lb on Earth, you would weigh ${formatNumber(
          converted
        )} lb on ${NAMES[planetKey]} (gravity ×${factor}).`;

  detailEl.textContent = friendly;
  resultSection.hidden = false;
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  calculate();
});


[weightInput, unitSelect, planetSelect].forEach((el) =>
  el.addEventListener("input", () => {
    if (!resultSection.hidden) calculate();
  })
);
