// ── HOME PAGE JS ──────────────────────────────────────────────

function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
function scrollTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
function showMsg(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = 'form-msg ' + type;
}

// ── FARMER REGISTER ──────────────────────────────────────────
async function registerFarmer() {
  const name = document.getElementById('f_name').value.trim();
  const email = document.getElementById('f_email').value.trim();
  const password = document.getElementById('f_password').value;
  const confirm = document.getElementById('f_confirm').value;
  const phone = document.getElementById('f_phone').value.trim();
  const aadhar = document.getElementById('f_aadhar').value.trim();

  if (!name || !email || !password || !phone || !aadhar)
    return showMsg('farmer-msg', 'All fields are required', 'error');
  if (password !== confirm)
    return showMsg('farmer-msg', 'Passwords do not match', 'error');
  if (phone.length !== 10 || isNaN(phone))
    return showMsg('farmer-msg', 'Phone must be 10 digits', 'error');

  const fd = new FormData();
  fd.append('name', name); fd.append('email', email);
  fd.append('password', password); fd.append('phone', phone);
  fd.append('aadhar_number', aadhar);
  const img = document.getElementById('f_aadhar_img').files[0];
  if (img) fd.append('aadhar_image', img);

  const res = await fetch('/api/signup/farmer', { method: 'POST', body: fd });
  const data = await res.json();
  showMsg('farmer-msg', data.message, data.success ? 'success' : 'error');
  if (data.success) document.getElementById('farmerForm').reset();
}


// ── LOGIN ────────────────────────────────────────────────────
async function doLogin() {
  const role = document.getElementById('loginRole').value;
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password)
    return showMsg('login-msg', 'Enter email and password', 'error');

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ role, email, password })
  });
  const data = await res.json();
  if (data.success) {
    window.location.href = '/dashboard';
  } else {
    showMsg('login-msg', data.message || 'Login failed', 'error');
  }
}

// ── LANGUAGE SWITCHER (Stub) ─────────────────────────────────
function changeLanguage(lang) {
  console.log('Language changed to:', lang);
  // Full i18n can be plugged in here
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
  }
});
