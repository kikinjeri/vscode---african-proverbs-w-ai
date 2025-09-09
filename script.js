let data = [];
let matches = [];
let matchIndex = 0;
const STORAGE_KEY = "african_history_v1";

// Elements
const input = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const flagEl = document.getElementById("flag");
const countryNameEl = document.getElementById("country-name");
const proverbEl = document.getElementById("proverb");
const recipeTitleEl = document.getElementById("recipe-title");
const stepsEl = document.getElementById("recipe-steps");
const imgEl = document.getElementById("recipe-img");
const resultIndex = document.getElementById("result-index");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const askAiBtn = document.getElementById("ask-ai");
const historyPanel = document.getElementById("history-panel");
const historyList = document.getElementById("history-list");
const showHistoryBtn = document.getElementById("show-history");
const clearHistoryBtn = document.getElementById("clear-history");
const historyCount = document.getElementById("history-count");

// Load JSON
fetch("data.json")
  .then(res => res.json())
  .then(json => data = json);

// Search
function performSearch(q) {
  q = q.trim().toLowerCase();
  if (!q) return;

  matches = data.filter(item =>
    item.name.toLowerCase().includes(q)
  );

  matchIndex = 0;
  if (matches.length) {
    addToHistory(matches[0].name);
  }
  renderCurrent();
}

// Render result
function renderCurrent() {
  if (!matches.length) {
    flagEl.textContent = "🌍";
    countryNameEl.textContent = "No result";
    proverbEl.textContent = "Try Nigeria, Kenya, Ghana, Egypt, Ethiopia...";
    recipeTitleEl.textContent = "—";
    stepsEl.innerHTML = "<li>No recipe</li>";
    imgEl.src = "";
    resultIndex.style.display = "none";
    return;
  }

  const item = matches[matchIndex];
  flagEl.textContent = item.flag;
  countryNameEl.textContent = item.name;
  proverbEl.textContent = item.proverb;
  recipeTitleEl.textContent = item.recipe.title;
  stepsEl.innerHTML = "";
  item.recipe.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    stepsEl.appendChild(li);
  });
  imgEl.src = item.recipe.img;
  imgEl.alt = item.recipe.title;

  if (matches.length > 1) {
    resultIndex.style.display = "block";
    resultIndex.textContent = `${matchIndex + 1} / ${matches.length}`;
  } else {
    resultIndex.style.display = "none";
  }
}

// History
function loadHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveHistory(h) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
}

function addToHistory(name) {
  let h = loadHistory();
  h = [name, ...h.filter(x => x !== name)];
  if (h.length > 20) h.pop();
  saveHistory(h);
  renderHistory();
}

function renderHistory() {
  const h = loadHistory();
  historyCount.textContent = h.length;
  historyList.innerHTML = "";
  if (!h.length) {
    historyList.innerHTML = "<small>No history yet</small>";
    return;
  }
  h.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.textContent = item;
    div.onclick = () => {
      input.value = item;
      performSearch(item);
      historyPanel.style.display = "none";
    };
    historyList.appendChild(div);
  });
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
}

// Navigation
prevBtn.onclick = () => {
  if (!matches.length) return;
  matchIndex = (matchIndex - 1 + matches.length) % matches.length;
  renderCurrent();
};
nextBtn.onclick = () => {
  if (!matches.length) return;
  matchIndex = (matchIndex + 1) % matches.length;
  renderCurrent();
};

// Ask AI (stubbed)
askAiBtn.onclick = () => {
  if (!matches.length) {
    alert("Search first!");
    return;
  }
  const item = matches[matchIndex];
  alert(`${item.flag} ${item.name}\n\nProverb: ${item.proverb}\n\nDish: ${item.recipe.title}`);
};

// Events
searchBtn.onclick = () => performSearch(input.value);
input.onkeydown = e => {
  if (e.key === "Enter") performSearch(input.value);
};

showHistoryBtn.onclick = () => {
  historyPanel.style.display = historyPanel.style.display === "none" ? "block" : "none";
};
clearHistoryBtn.onclick = () => {
  if (confirm("Clear history?")) clearHistory();
};

// Init
renderHistory();
