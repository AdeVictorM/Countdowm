const TARGET_KEY = "countdownTarget";

const els = {
  targetDisplay: document.getElementById("targetDisplay"),
  countdown: document.getElementById("countdown"),
  daysValue: document.getElementById("daysValue"),
  hoursValue: document.getElementById("hoursValue"),
  minutesValue: document.getElementById("minutesValue"),
  secondsValue: document.getElementById("secondsValue"),
  completeMessage: document.getElementById("completeMessage"),
  presetRow: document.getElementById("presetRow"),
  customTargetForm: document.getElementById("customTargetForm"),
  customTargetInput: document.getElementById("customTargetInput"),
};

let targetDate = loadTarget();
let intervalId = null;
let lastRendered = { days: null, hours: null, minutes: null, seconds: null };

// ---- Target persistence ----
function loadTarget() {
  const stored = localStorage.getItem(TARGET_KEY);
  if (stored) {
    const date = new Date(stored);
    if (!isNaN(date)) return date;
  }
  // Default: 24 hours from now
  const fallback = new Date(Date.now() + 24 * 60 * 60 * 1000);
  localStorage.setItem(TARGET_KEY, fallback.toISOString());
  return fallback;
}

function setTarget(date) {
  targetDate = date;
  localStorage.setItem(TARGET_KEY, date.toISOString());
  lastRendered = { days: null, hours: null, minutes: null, seconds: null };
  els.completeMessage.hidden = true;
  els.countdown.hidden = false;
  renderTargetLabel();
  tick();
  if (!intervalId) {
    intervalId = setInterval(tick, 1000);
  }
}

function renderTargetLabel() {
  els.targetDisplay.textContent = targetDate.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---- Rendering ----
function pad(num) {
  return String(num).padStart(2, "0");
}

function setUnit(el, value, key) {
  const text = pad(value);
  if (el.textContent !== text) {
    el.textContent = text;
    if (lastRendered[key] !== null) {
      el.classList.remove("is-updating");
      void el.offsetWidth; // restart animation
      el.classList.add("is-updating");
    }
  }
  lastRendered[key] = value;
}

function tick() {
  const diffMs = targetDate.getTime() - Date.now();

  if (diffMs <= 0) {
    setUnit(els.daysValue, 0, "days");
    setUnit(els.hoursValue, 0, "hours");
    setUnit(els.minutesValue, 0, "minutes");
    setUnit(els.secondsValue, 0, "seconds");
    els.completeMessage.hidden = false;
    clearInterval(intervalId);
    intervalId = null;
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  setUnit(els.daysValue, days, "days");
  setUnit(els.hoursValue, hours, "hours");
  setUnit(els.minutesValue, minutes, "minutes");
  setUnit(els.secondsValue, seconds, "seconds");
}

// ---- Presets ----
function nextNewYear() {
  const now = new Date();
  return new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
}

els.presetRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".preset");
  if (!btn) return;

  const preset = btn.dataset.preset;
  const now = Date.now();
  let next;

  if (preset === "1h") next = new Date(now + 60 * 60 * 1000);
  else if (preset === "24h") next = new Date(now + 24 * 60 * 60 * 1000);
  else if (preset === "7d") next = new Date(now + 7 * 24 * 60 * 60 * 1000);
  else if (preset === "newyear") next = nextNewYear();

  if (next) setTarget(next);
});

// ---- Custom target ----
els.customTargetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = els.customTargetInput.value;
  if (!value) return;
  const date = new Date(value);
  if (isNaN(date)) return;
  setTarget(date);
  els.customTargetInput.value = "";
});

// ---- Init ----
renderTargetLabel();
tick();
intervalId = setInterval(tick, 1000);