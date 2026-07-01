// ─── SEED DATA ────────────────────────────────
const seedPosts = [
  {
    id: 'post-1',
    title: 'Top 10 Hidden Gems in Southeast Asia',
    slug: 'hidden-gems-southeast-asia',
    category: 'Destinations',
    tags: ['Southeast Asia', 'Adventure', 'Budget'],
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    excerpt: 'Beyond the tourist trail lies a world of breathtaking landscapes, ancient temples, and untouched beaches waiting to be discovered.',
    content: `<h2>Beyond the Beaten Path</h2>
<p>Southeast Asia is one of the world's most diverse travel destinations — and most travelers barely scratch the surface. While Bali, Bangkok, and Singapore draw millions, there are dozens of extraordinary places waiting just off the beaten path.</p>
<h3>1. Kampot, Cambodia</h3>
<p>A sleepy riverside town with French colonial architecture, pepper plantations, and a pace of life that feels like the world forgot to rush.</p>
<h3>2. Phong Nha, Vietnam</h3>
<p>Home to some of the world's largest caves, this UNESCO-listed national park is a spelunker's dream. Son Doong Cave alone can fit a 40-story building inside.</p>
<h3>3. Koh Lipe, Thailand</h3>
<p>Crystal-clear turquoise waters, pristine coral reefs, and none of the overcrowding of Phuket. This tiny island near the Malaysia border is paradise redefined.</p>
<p>At Highflyer Travel, we specialise in crafting itineraries that take you beyond the postcard — contact us to plan your Southeast Asian adventure.</p>`,
    author: 'Highflyer Travel',
    date: '2026-06-15',
    published: true
  },
  {
    id: 'post-2',
    title: 'Sri Lanka in 10 Days: The Ultimate Itinerary',
    slug: 'sri-lanka-10-days-itinerary',
    category: 'Sri Lanka',
    tags: ['Sri Lanka', 'Itinerary', 'Culture'],
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80',
    excerpt: 'From ancient cities and misty highlands to wildlife safaris and golden beaches — here\'s how to make the most of 10 days in the Pearl of the Indian Ocean.',
    content: `<h2>The Pearl of the Indian Ocean</h2>
<p>Sri Lanka packs an extraordinary variety of experiences into a relatively compact island. Ten days is enough to taste its magic — but you'll leave wanting more.</p>
<h3>Days 1–2: Colombo</h3>
<p>Arrive in the vibrant capital. Explore Pettah market, the Dutch Hospital, and Galle Face Green. Sample street food and settle into the city's rhythm.</p>
<h3>Days 3–4: Cultural Triangle</h3>
<p>Head north to Sigiriya — the 5th-century rock fortress that rises 200 metres above the jungle. Nearby Dambulla Cave Temple is equally unmissable.</p>
<h3>Days 5–6: Kandy & Tea Country</h3>
<p>The Temple of the Tooth, Peradeniya Botanical Gardens, and then up into the cloud-draped tea highlands of Nuwara Eliya.</p>
<h3>Days 7–8: Ella</h3>
<p>Nine Arch Bridge, Little Adam's Peak, and the world's most scenic train ride. Ella is the highlight for many visitors.</p>
<h3>Days 9–10: South Coast Beaches</h3>
<p>Wind down in Mirissa or Unawatuna. If you're lucky, spot blue whales on a morning boat trip.</p>`,
    author: 'Zafrina Hassen',
    date: '2026-06-10',
    published: true
  },
  {
    id: 'post-3',
    title: 'Essential Travel Tips for First-Time Flyers',
    slug: 'travel-tips-first-time-flyers',
    category: 'Travel Tips',
    tags: ['First Time', 'Flying', 'Tips'],
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    excerpt: 'Flying for the first time? Don\'t worry — with the right preparation, it\'s an experience you\'ll enjoy from the moment you step into the airport.',
    content: `<h2>Your First Flight, Made Easy</h2>
<p>There's a first time for everything — including flying. The airport can feel overwhelming at first, but once you know what to expect, it becomes second nature.</p>
<h3>Arrive Early</h3>
<p>For international flights, aim to arrive at least 3 hours before departure. This gives you time to check in, clear immigration and security, and find your gate without rushing.</p>
<h3>Pack Smart</h3>
<p>Keep liquids under 100ml in a clear bag for carry-on. Valuables, medication, and a change of clothes should always go in your cabin bag — not checked luggage.</p>
<h3>Download Your Airline App</h3>
<p>Most airlines let you check in online 24–48 hours before departure. You'll save time at the airport and can choose your seat in advance.</p>
<h3>What to Expect on Board</h3>
<p>Once airborne, relax. Flight attendants are there to help. Stay hydrated, move your legs occasionally on long flights, and set your watch to the destination timezone early.</p>
<p>Need help with bookings or have questions? Our team at Highflyer Travel is always ready to help make your journey seamless.</p>`,
    author: 'Fahad Fahir',
    date: '2026-05-28',
    published: true
  },
  {
    id: 'post-4',
    title: 'Exploring the Wonders of Japan',
    slug: 'exploring-japan',
    category: 'Destinations',
    tags: ['Japan', 'Asia', 'Culture'],
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    excerpt: 'Ancient temples, neon-lit cities, cherry blossoms, and bullet trains — Japan is unlike anywhere else on Earth.',
    content: `<h2>The Land of the Rising Sun</h2>
<p>Japan is a country of extraordinary contrasts — ultramodern technology sits alongside thousand-year-old traditions. It's one of the most rewarding destinations in the world.</p>
<h3>Tokyo</h3>
<p>The world's largest city is an assault on the senses in the best possible way. Shibuya Crossing, Shinjuku, Harajuku, Tsukiji fish market — each neighbourhood has its own personality.</p>
<h3>Kyoto</h3>
<p>The cultural heart of Japan. Fushimi Inari's thousands of torii gates, the bamboo groves of Arashiyama, and countless geisha walking through Gion.</p>
<h3>Osaka</h3>
<p>Japan's food capital. Takoyaki, ramen, okonomiyaki — and the spectacular Dotonbori entertainment district that never sleeps.</p>`,
    author: 'Sasanka Atapattu',
    date: '2026-05-18',
    published: true
  }
];

function initBlogData() {
  if (!localStorage.getItem('hf_posts')) {
    localStorage.setItem('hf_posts', JSON.stringify(seedPosts));
  }
}

function getPosts() {
  return JSON.parse(localStorage.getItem('hf_posts') || '[]');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ─── BLOG LISTING PAGE ───────────────────────
function initBlogPage() {
  const grid = document.querySelector('.blog-grid');
  const filters = document.querySelectorAll('.filter-btn');
  if (!grid) return;

  initBlogData();

  let activeCategory = 'All';

  function render() {
    const posts = getPosts().filter(p => p.published);
    const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);

    if (filtered.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:var(--gray);grid-column:1/-1;padding:40px">No posts in this category yet.</p>';
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <div class="blog-card animate-in" onclick="window.location.href='blog-post.html?id=${p.id}'">
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
          <span style="font-size:13px;color:var(--gray)">By ${p.author}</span>
          <span class="read-more">Read More →</span>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.animate-in').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 50);
    });
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      render();
    });
  });

  render();
}

// ─── BLOG POST PAGE ───────────────────────────
function initPostPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  initBlogData();
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (!post) {
    document.body.innerHTML = '<div style="text-align:center;padding:100px 20px"><h2>Post not found</h2><a href="blog.html">← Back to Blog</a></div>';
    return;
  }

  document.title = `${post.title} — HighFlyer Travel`;

  const heroImg = document.querySelector('.post-hero-img');
  const heroTitle = document.querySelector('.post-hero-title');
  const heroCat = document.querySelector('.post-hero-cat');
  const heroDate = document.querySelector('.post-hero-date');
  const heroAuthor = document.querySelector('.post-hero-author');
  const contentEl = document.querySelector('.post-content-body');

  if (heroImg) heroImg.src = post.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80';
  if (heroTitle) heroTitle.textContent = post.title;
  if (heroCat) heroCat.textContent = post.category;
  if (heroDate) heroDate.textContent = formatDate(post.date);
  if (heroAuthor) heroAuthor.textContent = `By ${post.author}`;
  if (contentEl) contentEl.innerHTML = post.content;

  // Related posts
  const relatedGrid = document.querySelector('.related-grid');
  if (relatedGrid) {
    const related = posts
      .filter(p => p.published && p.id !== post.id && p.category === post.category)
      .slice(0, 3);

    if (related.length > 0) {
      relatedGrid.innerHTML = related.map(p => `
        <div class="blog-card" onclick="window.location.href='blog-post.html?id=${p.id}'">
          <img src="${p.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'}" alt="${p.title}" loading="lazy">
          <div class="blog-card-body">
            <div class="blog-meta">
              <span class="blog-category">${p.category}</span>
            </div>
            <h3>${p.title}</h3>
            <p>${p.excerpt}</p>
          </div>
          <div class="blog-card-footer">
            <span class="read-more">Read More →</span>
          </div>
        </div>
      `).join('');
    } else {
      relatedGrid.closest('section').style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initBlogData();
  initBlogPage();
  initPostPage();
});
