// ─── DATA HELPERS ─────────────────────────────
function getPosts() {
  return JSON.parse(localStorage.getItem('hf_posts') || '[]');
}

function savePosts(posts) {
  localStorage.setItem('hf_posts', JSON.stringify(posts));
}

function generateId() {
  return 'post-' + Date.now();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── NAVIGATION ───────────────────────────────
let currentPanel = 'dashboard';
let editingPostId = null;
let deleteTargetId = null;

function showPanel(name) {
  currentPanel = name;
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));

  const panel = document.getElementById('panel-' + name);
  const navItem = document.querySelector(`[data-panel="${name}"]`);
  if (panel) panel.classList.add('active');
  if (navItem) navItem.classList.add('active');

  const topbarTitle = document.querySelector('.admin-topbar h1');
  const titles = {
    dashboard: 'Dashboard',
    posts: 'Blog Posts',
    new: 'New Post',
    edit: 'Edit Post'
  };
  if (topbarTitle) topbarTitle.textContent = titles[name] || 'Dashboard';

  if (name === 'dashboard') renderDashboard();
  if (name === 'posts') renderPostsTable();
  if (name === 'new') resetEditor();
}

// ─── DASHBOARD ────────────────────────────────
function renderDashboard() {
  const posts = getPosts();
  const published = posts.filter(p => p.published).length;
  const drafts = posts.filter(p => !p.published).length;
  const categories = [...new Set(posts.map(p => p.category))].length;

  setEl('stat-total', posts.length);
  setEl('stat-published', published);
  setEl('stat-drafts', drafts);
  setEl('stat-categories', categories);

  const recentBody = document.getElementById('recent-posts-body');
  if (!recentBody) return;

  const recent = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  recentBody.innerHTML = recent.map(p => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:12px">
          <img class="post-thumb" src="${p.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=120&q=60'}" alt="">
          <strong style="font-size:14px">${p.title}</strong>
        </div>
      </td>
      <td>${p.category}</td>
      <td><span class="status-badge ${p.published ? 'status-published' : 'status-draft'}">${p.published ? 'Published' : 'Draft'}</span></td>
      <td>${formatDate(p.date)}</td>
      <td>
        <div class="table-actions">
          <button class="table-btn table-btn-edit" onclick="editPost('${p.id}')">Edit</button>
          <button class="table-btn table-btn-view" onclick="viewPost('${p.id}')">View</button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--gray);padding:30px">No posts yet. <a href="#" onclick="showPanel(\'new\')" style="color:var(--navy)">Create your first post →</a></td></tr>';
}

// ─── POSTS TABLE ─────────────────────────────
function renderPostsTable() {
  const posts = getPosts();
  const tbody = document.getElementById('posts-table-body');
  if (!tbody) return;

  tbody.innerHTML = posts.map(p => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:12px">
          <img class="post-thumb" src="${p.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=120&q=60'}" alt="">
          <div>
            <strong style="font-size:14px;display:block">${p.title}</strong>
            <span style="font-size:12px;color:var(--gray)">${p.excerpt.substring(0, 60)}...</span>
          </div>
        </div>
      </td>
      <td>${p.category}</td>
      <td>${p.author}</td>
      <td><span class="status-badge ${p.published ? 'status-published' : 'status-draft'}">${p.published ? 'Published' : 'Draft'}</span></td>
      <td>${formatDate(p.date)}</td>
      <td>
        <div class="table-actions">
          <button class="table-btn table-btn-edit" onclick="editPost('${p.id}')">Edit</button>
          <button class="table-btn table-btn-view" onclick="viewPost('${p.id}')">View</button>
          <button class="table-btn table-btn-delete" onclick="confirmDelete('${p.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--gray);padding:30px">No posts yet.</td></tr>';
}

// ─── EDITOR ──────────────────────────────────
function resetEditor() {
  editingPostId = null;
  setVal('post-title', '');
  setVal('post-category', '');
  setVal('post-tags', '');
  setVal('post-author', 'Highflyer Travel');
  setVal('post-date', new Date().toISOString().split('T')[0]);
  setVal('post-excerpt', '');
  setVal('post-image', '');
  setVal('post-status', 'published');
  const editor = document.getElementById('post-content');
  if (editor) editor.innerHTML = '';
  updateImagePreview('');

  const heading = document.getElementById('editor-heading');
  if (heading) heading.textContent = 'Create New Post';
}

function editPost(id) {
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (!post) return;

  editingPostId = id;
  showPanel('new');

  const heading = document.getElementById('editor-heading');
  if (heading) heading.textContent = 'Edit Post';

  setTimeout(() => {
    setVal('post-title', post.title);
    setVal('post-category', post.category);
    setVal('post-tags', (post.tags || []).join(', '));
    setVal('post-author', post.author);
    setVal('post-date', post.date);
    setVal('post-excerpt', post.excerpt);
    setVal('post-image', post.image || '');
    setVal('post-status', post.published ? 'published' : 'draft');
    const editor = document.getElementById('post-content');
    if (editor) editor.innerHTML = post.content;
    updateImagePreview(post.image || '');
  }, 50);
}

function savePost(publish) {
  const title = getVal('post-title').trim();
  if (!title) { alert('Please enter a post title.'); return; }

  const content = document.getElementById('post-content')?.innerHTML || '';
  const excerpt = getVal('post-excerpt').trim() || stripHtml(content).substring(0, 160) + '...';
  const tagsRaw = getVal('post-tags');
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const statusVal = getVal('post-status');

  const postData = {
    id: editingPostId || generateId(),
    title,
    slug: slugify(title),
    category: getVal('post-category') || 'Destinations',
    tags,
    image: getVal('post-image').trim(),
    excerpt,
    content,
    author: getVal('post-author') || 'Highflyer Travel',
    date: getVal('post-date') || new Date().toISOString().split('T')[0],
    published: publish !== undefined ? publish : statusVal === 'published'
  };

  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === postData.id);

  if (idx > -1) {
    posts[idx] = postData;
  } else {
    posts.unshift(postData);
  }

  savePosts(posts);
  showToast(postData.published ? 'Post published!' : 'Draft saved!');
  showPanel('posts');
}

function confirmDelete(id) {
  deleteTargetId = id;
  document.getElementById('delete-modal')?.classList.add('active');
}

function cancelDelete() {
  deleteTargetId = null;
  document.getElementById('delete-modal')?.classList.remove('active');
}

function doDelete() {
  if (!deleteTargetId) return;
  const posts = getPosts().filter(p => p.id !== deleteTargetId);
  savePosts(posts);
  deleteTargetId = null;
  document.getElementById('delete-modal')?.classList.remove('active');
  renderPostsTable();
  showToast('Post deleted.');
}

function viewPost(id) {
  window.open(`blog-post.html?id=${id}`, '_blank');
}

// ─── TOOLBAR ─────────────────────────────────
function formatText(cmd, val) {
  document.getElementById('post-content').focus();
  document.execCommand(cmd, false, val || null);
}

function insertLink() {
  const url = prompt('Enter URL:');
  if (url) {
    document.getElementById('post-content').focus();
    document.execCommand('createLink', false, url);
  }
}

function insertImage() {
  const url = prompt('Enter image URL:');
  if (url) {
    document.getElementById('post-content').focus();
    document.execCommand('insertHTML', false, `<img src="${url}" alt="" style="max-width:100%;border-radius:8px;margin:16px 0">`);
  }
}

// ─── IMAGE PREVIEW ───────────────────────────
function updateImagePreview(url) {
  const box = document.querySelector('.image-preview-box');
  if (!box) return;
  const img = box.querySelector('img');
  const placeholder = box.querySelector('.image-preview-placeholder');
  if (url) {
    img.src = url;
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    if (placeholder) placeholder.style.display = 'block';
  }
}

// ─── TOAST ───────────────────────────────────
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    background: 'var(--navy)', color: 'white',
    padding: '14px 24px', borderRadius: '8px',
    fontFamily: 'Poppins, sans-serif', fontSize: '14px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    zIndex: '9999', opacity: '0', transition: 'opacity 0.3s'
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.style.opacity = '1', 10);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ─── HELPERS ─────────────────────────────────
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function getVal(id) {
  return document.getElementById(id)?.value || '';
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

// ─── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => showPanel(item.dataset.panel));
  });

  const imageInput = document.getElementById('post-image');
  if (imageInput) {
    imageInput.addEventListener('input', () => updateImagePreview(imageInput.value.trim()));
  }

  showPanel('dashboard');
});
