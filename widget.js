// widget.js

const DATA = [
  {name:"ChatGPT", category:"AI Assistant", img:"https://via.placeholder.com/120", url:"https://chat.openai.com", desc:"AI chatbot powered by GPT."},
  {name:"MidJourney", category:"AI Art", img:"https://via.placeholder.com/120", url:"https://midjourney.com", desc:"AI image generator."},
  {name:"Runway", category:"Video Editing", img:"https://via.placeholder.com/120", url:"https://runwayml.com", desc:"AI-powered video editor."}
];

let favorites = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

function renderCards() {
  const container = document.getElementById("cardContainer");
  if (!container) {
    console.error("widget.js: element #cardContainer not found");
    return;
  }
  container.innerHTML = "";

  const inputSearch = document.getElementById("searchInput");
  const selectCat = document.getElementById("categoryFilter");
  if (!inputSearch || !selectCat) {
    console.error("widget.js: searchInput or categoryFilter element missing");
    return;
  }
  const search = inputSearch.value.toLowerCase();
  const category = selectCat.value;

  const filtered = DATA.filter(d =>
    (category === "all" || d.category === category) &&
    (d.name.toLowerCase().includes(search) || d.desc.toLowerCase().includes(search))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  pageItems.forEach(d => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${d.img}" alt="${d.name}" />
      <span class="favorite-icon ${favorites.includes(d.name) ? "favorited" : ""}" onclick="toggleFavorite(this, '${d.name}')">★</span>
      <h2>${d.name}</h2>
      <p>${d.desc}</p>
      <a href="${d.url}" target="_blank" rel="noopener">Visit</a>
    `;
    container.appendChild(card);
  });

  renderPagination(totalPages);
  updateFavoriteIcons();
}

function renderPagination(totalPages) {
  const paginationEl = document.getElementById("pagination");
  if (!paginationEl) {
    console.error("widget.js: #pagination element missing");
    return;
  }
  paginationEl.innerHTML = "";

  // prev button
  const prev = document.createElement("button");
  prev.textContent = "Prev";
  prev.disabled = currentPage <= 1;
  prev.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderCards();
    }
  };
  paginationEl.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) {
      btn.className = "active";
      btn.disabled = true;
    }
    btn.onclick = () => {
      currentPage = i;
      renderCards();
    };
    paginationEl.appendChild(btn);
  }

  const next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = currentPage >= totalPages;
  next.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCards();
    }
  };
  paginationEl.appendChild(next);
}

function toggleFavorite(el, name) {
  if (!name) return;
  const idx = favorites.indexOf(name);
  if (idx === -1) favorites.push(name);
  else favorites.splice(idx, 1);

  updateFavoriteSummary();
  updateFavoriteIcons();
}

function updateFavoriteSummary() {
  const summary = document.querySelector(".favorite-summary");
  if (summary) {
    summary.textContent = `★ Favorites (${favorites.length})`;
  }
}

function updateFavoriteIcons() {
  document.querySelectorAll(".favorite-icon").forEach(el => {
    const n = el.getAttribute("data-name") || el.textContent;
    if (n && favorites.includes(n)) {
      el.classList.add("favorited");
    } else {
      el.classList.remove("favorited");
    }
  });
}

function renderFavoriteList() {
  const list = document.getElementById("favoriteList");
  if (!list) return;
  list.innerHTML = "";
  if (favorites.length === 0) {
    list.innerHTML = "<div>No favorites yet.</div>";
  } else {
    favorites.forEach(name => {
      const item = document.createElement("div");
      item.textContent = `★ ${name}`;
      list.appendChild(item);
    });
  }
}

function toggleFavoriteList() {
  const list = document.getElementById("favoriteList");
  if (!list) {
    console.error("widget.js: #favoriteList missing");
    return;
  }
  if (list.style.display === "block") {
    list.style.display = "none";
  } else {
    list.style.display = "block";
    renderFavoriteList();
  }
}

// Init
(function init() {
  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("categoryFilter");
    const inputSearch = document.getElementById("searchInput");
    if (!select || !inputSearch) {
      console.error("widget.js: required filter/search elements missing at init");
      return;
    }
    // build category options
    const cats = Array.from(new Set(DATA.map(d => d.category)));
    cats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    });
    inputSearch.addEventListener("input", () => {
      currentPage = 1;
      renderCards();
    });
    select.addEventListener("change", () => {
      currentPage = 1;
      renderCards();
    });
    // initial render
    renderCards();
  });
})();
