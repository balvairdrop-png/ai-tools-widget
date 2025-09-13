// Demo data
const DATA = [
  {name:"ChatGPT", category:"AI Assistant", img:"https://via.placeholder.com/120", url:"https://chat.openai.com", desc:"AI chatbot powered by GPT."},
  {name:"MidJourney", category:"AI Art", img:"https://via.placeholder.com/120", url:"https://midjourney.com", desc:"AI image generator."},
  {name:"Runway", category:"Video Editing", img:"https://via.placeholder.com/120", url:"https://runwayml.com", desc:"AI-powered video editor."}
];

let favorites = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

// Render cards
function renderCards() {
  const container = document.getElementById("cardContainer");
  container.innerHTML = "";

  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;

  const filtered = DATA.filter(d =>
    (category === "all" || d.category === category) &&
    (d.name.toLowerCase().includes(search) || d.desc.toLowerCase().includes(search))
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages) currentPage = 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  pageItems.forEach(d => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${d.img}" alt="${d.name}">
      <span class="favorite-icon ${favorites.includes(d.name) ? "favorited" : ""}" onclick="toggleFavorite(this,'${d.name}')">♥</span>
      <h2>${d.name}</h2>
      <p>${d.desc}</p>
      <a href="${d.url}" target="_blank">Visit</a>
    `;
    container.appendChild(card);
  });

  renderPagination(totalPages);
}

// Render pagination
function renderPagination(totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = (i === currentPage) ? "active" : "";
    btn.onclick = () => { currentPage = i; renderCards(); };
    pagination.appendChild(btn);
  }
}

// Toggle favorite
function toggleFavorite(el, name) {
  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
    el.classList.remove("favorited");
  } else {
    favorites.push(name);
    el.classList.add("favorited");
  }
  updateFavoriteSummary();
}

// Show/hide favorites list
function toggleFavoriteList() {
  const list = document.getElementById("favoriteList");
  if (list.style.display === "block") {
    list.style.display = "none";
  } else {
    list.style.display = "block";
    renderFavoriteList();
  }
}

// Render favorites list
function renderFavoriteList() {
  const list = document.getElementById("favoriteList");
  list.innerHTML = favorites.length
    ? favorites.map(f => `<div>★ ${f}</div>`).join("")
    : "<em>No favorites yet.</em>";
}

// Update summary
function updateFavoriteSummary() {
  document.querySelector(".favorite-summary").textContent = `★ Favorites (${favorites.length})`;
}

// Init
(function init() {
  const select = document.getElementById("categoryFilter");
  const cats = Array.from(new Set(DATA.map(d => d.category)));
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });

  document.getElementById("searchInput").addEventListener("input", renderCards);
  document.getElementById("categoryFilter").addEventListener("change", renderCards);

  renderCards();
})();
