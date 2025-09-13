// Dữ liệu demo
const DATA = [
  { name: "Tool A", category: "AI Generator", img: "https://via.placeholder.com/300x150?text=Tool+A", url: "#", desc: "Description A" },
  { name: "Tool B", category: "AI Writer", img: "https://via.placeholder.com/300x150?text=Tool+B", url: "#", desc: "Description B" },
  { name: "Tool C", category: "AI Generator", img: "https://via.placeholder.com/300x150?text=Tool+C", url: "#", desc: "Description C" },
  { name: "Tool D", category: "AI Chatbot", img: "https://via.placeholder.com/300x150?text=Tool+D", url: "#", desc: "Description D" }
];

let favorites = [];
let currentPage = 1;
const itemsPerPage = 3;

// Render danh sách card
function renderCards() {
  const container = document.getElementById("cardsContainer");
  const filter = document.getElementById("categoryFilter").value;
  let data = filter === "all" ? DATA : DATA.filter(d => d.category === filter);

  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(start, start + itemsPerPage);

  container.innerHTML = "";
  paginatedData.forEach(item => {
    const card = document.createElement("div");
    card.className = "travel-card";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <h3><a href="${item.url}" target="_blank">${item.name}</a></h3>
      <p>${item.desc}</p>
      <span class="favorite-icon ${favorites.includes(item.name) ? "favorited" : ""}" onclick="toggleFavorite('${item.name}')">♥</span>
    `;
    container.appendChild(card);
  });

  renderPagination(data.length);
}

// Toggle favorite
function toggleFavorite(name) {
  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
  } else {
    favorites.push(name);
  }
  renderCards();
  renderFavorites();
}

// Render favorites
function renderFavorites() {
  const container = document.getElementById("favoritesContainer");
  container.innerHTML = "";
  favorites.forEach(name => {
    const item = DATA.find(d => d.name === name);
    if (item) {
      const card = document.createElement("div");
      card.className = "travel-card";
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}" />
        <h3><a href="${item.url}" target="_blank">${item.name}</a></h3>
        <p>${item.desc}</p>
        <span class="favorite-icon favorited" onclick="toggleFavorite('${item.name}')">♥</span>
      `;
      container.appendChild(card);
    }
  });
}

// Render pagination
function renderPagination(totalItems) {
  const container = document.getElementById("pagination");
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  container.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = (i === currentPage);
    btn.onclick = () => { currentPage = i; renderCards(); };
    container.appendChild(btn);
  }
}

// Init
(function init() {
  console.log("Widget loaded OK from Cloudflare Worker");
  const select = document.getElementById("categoryFilter");
  const cats = Array.from(new Set(DATA.map(d => d.category)));
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
  select.onchange = () => { currentPage = 1; renderCards(); };
  renderCards();
})();
