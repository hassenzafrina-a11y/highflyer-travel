// ─── NAVBAR SCROLL ────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ─── ACTIVE NAV LINK ─────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ─── MOBILE NAV ──────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// ─── SEARCH BAR ──────────────────────────────
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let selectedYear = new Date().getFullYear();
let selectedMonth = null;
let adults = 2;
let children = 0;

// Destination data — organized by region (G Adventures style)
const destinationRegions = [
  {
    name: 'Sri Lanka',
    tagline: 'The pearl of the Indian Ocean',
    destinations: [
      { name: 'Colombo',       badge: 'Popular'    },
      { name: 'Kandy',         badge: 'Top Seller' },
      { name: 'Sigiriya',      badge: 'Trending'   },
      { name: 'Galle',         badge: null          },
      { name: 'Ella',          badge: 'Trending'   },
      { name: 'Nuwara Eliya',  badge: null          },
      { name: 'Mirissa',       badge: null          },
      { name: 'Trincomalee',   badge: null          },
    ]
  },
  {
    name: 'Asia',
    tagline: 'Ancient temples, vibrant cities, world-class cuisine',
    destinations: [
      { name: 'Bali',          badge: 'Popular'    },
      { name: 'Bangkok',       badge: 'Popular'    },
      { name: 'Tokyo',         badge: 'Top Seller' },
      { name: 'Singapore',     badge: null          },
      { name: 'Vietnam',       badge: 'Trending'   },
      { name: 'Kuala Lumpur',  badge: null          },
      { name: 'Thailand',      badge: null          },
      { name: 'Japan',         badge: null          },
    ]
  },
  {
    name: 'Indian Ocean',
    tagline: 'Crystal lagoons, islands, and luxury retreats',
    destinations: [
      { name: 'Maldives',      badge: 'Top Seller' },
      { name: 'India',         badge: 'Popular'    },
      { name: 'Seychelles',    badge: null          },
      { name: 'Mauritius',     badge: null          },
    ]
  },
  {
    name: 'Middle East',
    tagline: 'Ancient wonders and dazzling modernity',
    destinations: [
      { name: 'Dubai',         badge: 'Popular'    },
      { name: 'Abu Dhabi',     badge: null          },
      { name: 'Morocco',       badge: 'Trending'   },
      { name: 'Jordan',        badge: null          },
    ]
  },
  {
    name: 'Europe',
    tagline: 'History, culture, and breathtaking landscapes',
    destinations: [
      { name: 'Paris',         badge: null          },
      { name: 'Santorini',     badge: 'Popular'    },
      { name: 'Iceland',       badge: 'Trending'   },
      { name: 'Rome',          badge: null          },
    ]
  },
];

function initSearch() {
  const dateField = document.getElementById('date-field');
  const travelersField = document.getElementById('travelers-field');
  const dateDropdown = document.getElementById('date-dropdown');
  const travelersDropdown = document.getElementById('travelers-dropdown');
  const destInput = document.getElementById('dest-input');
  const destDropdown = document.getElementById('dest-dropdown-list');

  if (!dateField) return;

  renderDateDropdown();
  renderTravelersDropdown();

  // ── Destination dropdown ──
  if (destInput && destDropdown) {
    let highlightIdx = -1;

    function badgeHtml(badge) {
      if (!badge) return '';
      const cls = badge.toLowerCase().replace(' ', '-');
      return `<span class="dest-badge dest-badge-${cls}">${badge}</span>`;
    }

    function renderDestDropdown(query) {
      const q = (query || '').toLowerCase().trim();

      if (q) {
        // Search mode: flat filtered list across all regions
        const results = [];
        destinationRegions.forEach(region => {
          region.destinations.forEach(d => {
            if (d.name.toLowerCase().includes(q) || region.name.toLowerCase().includes(q)) {
              results.push({ ...d, region: region.name });
            }
          });
        });

        if (results.length === 0) {
          destDropdown.innerHTML = `<div class="dest-no-results">No destinations found for "<strong>${query}</strong>"</div>`;
        } else {
          destDropdown.innerHTML = `
            <div class="dest-section-label">Search results</div>
            ${results.map((d, i) => `
              <div class="dest-result-item" data-idx="${i}" data-name="${d.name}" onmousedown="selectDest('${d.name}')">
                <div class="dest-result-info">
                  <span class="dest-result-name">${highlightMatch(d.name, q)}</span>
                  ${badgeHtml(d.badge)}
                </div>
                <span class="dest-result-region">${d.region}</span>
              </div>
            `).join('')}
          `;
        }
      } else {
        // Browse mode: regional mega panel
        destDropdown.innerHTML = `
          <div class="dest-section-label">Popular destinations</div>
          ${destinationRegions.map(region => `
            <div class="dest-region-block">
              <div class="dest-region-header">
                <span class="dest-region-name">${region.name}</span>
                <span class="dest-region-tagline">${region.tagline}</span>
              </div>
              <div class="dest-region-grid">
                ${region.destinations.map(d => `
                  <div class="dest-place-item" onmousedown="selectDest('${d.name}')">
                    <span class="dest-place-name">${d.name}</span>
                    ${badgeHtml(d.badge)}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        `;
      }
      highlightIdx = -1;
    }

    function highlightMatch(text, q) {
      if (!q) return text;
      const idx = text.toLowerCase().indexOf(q);
      if (idx === -1) return text;
      return text.slice(0, idx) + `<mark>${text.slice(idx, idx + q.length)}</mark>` + text.slice(idx + q.length);
    }

    const destClearBtn = document.getElementById('dest-clear');

    function updateDestClear() {
      if (destClearBtn) destClearBtn.style.display = destInput.value ? 'flex' : 'none';
    }

    destInput.addEventListener('focus', () => {
      renderDestDropdown(destInput.value);
      destDropdown.classList.add('active');
      closeOtherDropdowns();
    });

    destInput.addEventListener('click', () => {
      if (!destDropdown.classList.contains('active')) {
        renderDestDropdown(destInput.value);
        destDropdown.classList.add('active');
        closeOtherDropdowns();
      }
    });

    destInput.addEventListener('input', () => {
      renderDestDropdown(destInput.value);
      destDropdown.classList.add('active');
      updateDestClear();
    });

    destInput.addEventListener('keydown', (e) => {
      const items = destDropdown.querySelectorAll('.dest-dropdown-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightIdx = Math.min(highlightIdx + 1, items.length - 1);
        items.forEach((el, i) => el.classList.toggle('highlighted', i === highlightIdx));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightIdx = Math.max(highlightIdx - 1, 0);
        items.forEach((el, i) => el.classList.toggle('highlighted', i === highlightIdx));
      } else if (e.key === 'Enter') {
        if (highlightIdx >= 0 && items[highlightIdx]) {
          selectDest(items[highlightIdx].dataset.name);
        } else {
          destDropdown.classList.remove('active');
        }
      } else if (e.key === 'Escape') {
        destDropdown.classList.remove('active');
      }
    });
  }

  function closeOtherDropdowns() {
    dateDropdown?.classList.remove('active');
    travelersDropdown?.classList.remove('active');
  }

  dateField.addEventListener('click', (e) => {
    e.stopPropagation();
    destDropdown?.classList.remove('active');
    dateDropdown.classList.toggle('active');
    travelersDropdown.classList.remove('active');
  });

  travelersField.addEventListener('click', (e) => {
    e.stopPropagation();
    destDropdown?.classList.remove('active');
    travelersDropdown.classList.toggle('active');
    dateDropdown.classList.remove('active');
  });

  document.addEventListener('click', () => {
    dateDropdown.classList.remove('active');
    travelersDropdown.classList.remove('active');
    destDropdown?.classList.remove('active');
  });

  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const dest = document.getElementById('dest-input')?.value?.trim();
      if (!dest) {
        document.getElementById('dest-input')?.focus();
        return;
      }
      window.location.href = `search.html?q=${encodeURIComponent(dest)}`;
    });
  }
}

function toggleDateDropdown(e) {
  e.stopPropagation();
  var dd = document.getElementById('date-dropdown');
  var td = document.getElementById('travelers-dropdown');
  var dest = document.getElementById('dest-dropdown-list');
  td && td.classList.remove('active');
  dest && dest.classList.remove('active');
  dd && dd.classList.toggle('active');
}

function toggleTravelersDropdown(e) {
  e.stopPropagation();
  var dd = document.getElementById('date-dropdown');
  var td = document.getElementById('travelers-dropdown');
  var dest = document.getElementById('dest-dropdown-list');
  dd && dd.classList.remove('active');
  dest && dest.classList.remove('active');
  td && td.classList.toggle('active');
}

function doSearch() {
  const dest = document.getElementById('dest-input')?.value?.trim();
  if (!dest) { document.getElementById('dest-input')?.focus(); return; }
  window.location.href = `search.html?q=${encodeURIComponent(dest)}`;
}

function selectDest(name) {
  const input = document.getElementById('dest-input');
  const dropdown = document.getElementById('dest-dropdown-list');
  const clearBtn = document.getElementById('dest-clear');
  if (input) input.value = name;
  if (dropdown) dropdown.classList.remove('active');
  if (clearBtn) clearBtn.style.display = 'flex';
}

function clearDest() {
  const input = document.getElementById('dest-input');
  const dropdown = document.getElementById('dest-dropdown-list');
  const clearBtn = document.getElementById('dest-clear');
  if (input) { input.value = ''; input.focus(); }
  if (clearBtn) clearBtn.style.display = 'none';
  if (dropdown) {
    // re-render regional list and show it
    input && input.dispatchEvent(new Event('focus'));
  }
}

function renderDateDropdown() {
  const dropdown = document.getElementById('date-dropdown');
  if (!dropdown) return;

  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();
  const isPastYear = selectedYear < curYear;
  const canGoBack = selectedYear > curYear;

  dropdown.innerHTML = `
    <div class="year-nav">
      <button onclick="changeYear(-1);event.stopPropagation()" ${!canGoBack ? 'disabled' : ''}>&#8249;</button>
      <strong id="year-label">${selectedYear}</strong>
      <button onclick="changeYear(1);event.stopPropagation()">&#8250;</button>
    </div>
    <div class="month-grid">
      ${months.map((m, i) => {
        const isPast = isPastYear || (selectedYear === curYear && i < curMonth);
        return `<button class="month-btn ${selectedMonth === i ? 'selected' : ''} ${isPast ? 'disabled' : ''}" onclick="selectMonth(${i})">${m}</button>`;
      }).join('')}
    </div>
  `;
}

function changeYear(dir) {
  const curYear = new Date().getFullYear();
  const next = selectedYear + dir;
  if (next < curYear) return;
  selectedYear = next;
  renderDateDropdown();
}

function selectMonth(i) {
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth();
  if (selectedYear === curYear && i < curMonth) selectedYear = curYear + 1;
  selectedMonth = i;
  renderDateDropdown();
  const dateValue = document.getElementById('date-display');
  if (dateValue) dateValue.textContent = `${months[i]} ${selectedYear}`;
  document.getElementById('date-dropdown')?.classList.remove('active');
}

function renderTravelersDropdown() {
  const dropdown = document.getElementById('travelers-dropdown');
  if (!dropdown) return;

  dropdown.innerHTML = `
    <div class="travelers-counter">
      <div class="counter-row">
        <div>
          <div class="counter-label">Adults</div>
          <div class="counter-sub">Age 18+</div>
        </div>
        <div class="counter-controls">
          <button class="counter-btn" onclick="changeCount('adults', -1);event.stopPropagation()">−</button>
          <span class="counter-num" id="adults-count">${adults}</span>
          <button class="counter-btn" onclick="changeCount('adults', 1);event.stopPropagation()">+</button>
        </div>
      </div>
      <div class="counter-row">
        <div>
          <div class="counter-label">Children</div>
          <div class="counter-sub">Age 2–17</div>
        </div>
        <div class="counter-controls">
          <button class="counter-btn" onclick="changeCount('children', -1);event.stopPropagation()">−</button>
          <span class="counter-num" id="children-count">${children}</span>
          <button class="counter-btn" onclick="changeCount('children', 1);event.stopPropagation()">+</button>
        </div>
      </div>
      <button class="btn btn-navy" style="width:100%;justify-content:center" onclick="applyTravelers();event.stopPropagation()">Done</button>
    </div>
  `;
}

function changeCount(type, dir) {
  if (type === 'adults') adults = Math.max(1, adults + dir);
  else children = Math.max(0, children + dir);
  renderTravelersDropdown();
}

function applyTravelers() {
  const val = `${adults} Adult${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children !== 1 ? 'ren' : ''}` : ''}`;
  const el = document.getElementById('travelers-display');
  if (el) el.textContent = val;
  document.getElementById('travelers-dropdown')?.classList.remove('active');
}

// ─── SCROLL ANIMATIONS ────────────────────────
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

// ─── COUNTER ANIMATION ────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target);
    let count = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        el.textContent = target + (el.dataset.suffix || '');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(count) + (el.dataset.suffix || '');
      }
    }, 20);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ─── BLOG PREVIEW ON HOME ────────────────────
function loadHomeBlogPosts() {
  const container = document.querySelector('.home-blog-grid');
  if (!container) return;

  const posts = JSON.parse(localStorage.getItem('hf_posts') || '[]')
    .filter(p => p.published)
    .slice(0, 3);

  if (posts.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--gray);grid-column:1/-1">No blog posts yet. Check back soon!</p>';
    return;
  }

  container.innerHTML = posts.map(p => `
    <div class="blog-card" onclick="window.location.href='blog-post.html?id=${p.id}'">
      <img src="${p.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'}" alt="${p.title}" loading="lazy">
      <div class="blog-card-body">
        <div class="blog-meta">
          <span class="blog-category">${p.category}</span>
          <span class="blog-date">${formatDate(p.date)}</span>
        </div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
      </div>
      <div class="blog-card-footer">
        <span class="read-more">Read More →</span>
      </div>
    </div>
  `).join('');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initAnimations();
  loadHomeBlogPosts();
});
