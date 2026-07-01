// ─── ADMIN PASSWORD PROTECTION ────────────────
const ADMIN_PASSWORD = 'highflyer2026';
const SESSION_KEY = 'hf_admin_auth';

function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

function authenticate(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.reload();
}

function initAdminAuth() {
  if (isAuthenticated()) {
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('admin-app').style.display = 'flex';
    return;
  }
  document.getElementById('auth-overlay').style.display = 'flex';
  document.getElementById('admin-app').style.display = 'none';
}

function handleLogin(e) {
  e.preventDefault();
  const pwd = document.getElementById('admin-password').value;
  const errEl = document.getElementById('auth-error');

  if (authenticate(pwd)) {
    document.getElementById('auth-overlay').style.display = 'none';
    document.getElementById('admin-app').style.display = 'flex';
  } else {
    errEl.style.display = 'block';
    document.getElementById('admin-password').value = '';
    document.getElementById('admin-password').focus();
    setTimeout(() => errEl.style.display = 'none', 3000);
  }
}
