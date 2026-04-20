// ── HOME PAGE JS ──────────────────────────────────────────────

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function scrollTo(id)   { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }
function showMsg(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = 'form-msg ' + type;
}

// Apply saved language on every page load
window.addEventListener('DOMContentLoaded', () => {
  applyLanguage(currentLang);
});

// ── AADHAAR NUMBER CLIENT-SIDE VALIDATION ────────────────────
// Verhoeff tables (mirrors backend)
const _V_D = [
  [0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0]
];
const _V_P = [
  [0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]
];

function verhoeffCheck(num) {
  let c = 0;
  const digits = num.split('').reverse();
  for (let i = 0; i < digits.length; i++)
    c = _V_D[c][_V_P[i % 8][parseInt(digits[i])]];
  return c === 0;
}

function validateAadhaarNumber(raw) {
  const num = raw.replace(/[\s\-]/g, '');
  if (!num)              return 'Aadhaar number is required';
  if (!/^\d+$/.test(num)) return 'Aadhaar number must contain only digits';
  if (num.length !== 12) return `Aadhaar must be 12 digits (you entered ${num.length})`;
  if ('01'.includes(num[0])) return 'Aadhaar number cannot start with 0 or 1';
  if (new Set(num).size === 1) return 'Aadhaar number is invalid';
  if (!verhoeffCheck(num)) return 'Aadhaar number is invalid — please check and re-enter';
  return null; // valid
}

function validateAadhaarImageClient(file) {
  if (!file) return 'Aadhaar card image is required';
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['jpg','jpeg','png'].includes(ext))
    return 'Aadhaar image must be JPG or PNG';
  if (file.size < 5000)
    return 'File is too small. Please upload a clear photo of your Aadhaar card';
  if (file.size > 10 * 1024 * 1024)
    return 'File is too large (max 10 MB)';
  return null; // passes client checks; server does deeper checks
}

// Real-time Aadhaar number feedback
function onAadhaarInput() {
  const raw = document.getElementById('f_aadhar').value;
  const hint = document.getElementById('aadhar-hint');
  if (!raw) { hint.textContent = ''; return; }
  const err = validateAadhaarNumber(raw);
  if (err) {
    hint.textContent = '❌ ' + err;
    hint.className = 'field-hint error';
  } else {
    hint.textContent = '✅ Valid Aadhaar number';
    hint.className = 'field-hint success';
  }
}

// Image preview on file select
function onAadhaarImageSelect() {
  const file = document.getElementById('f_aadhar_img').files[0];
  const hint = document.getElementById('img-hint');
  const preview = document.getElementById('img-preview');

  if (!file) { hint.textContent=''; preview.style.display='none'; return; }

  const err = validateAadhaarImageClient(file);
  if (err) {
    hint.textContent = '❌ ' + err;
    hint.className = 'field-hint error';
    preview.style.display = 'none';
    return;
  }

  // Show preview
  const reader = new FileReader();
  reader.onload = e => {
    preview.src = e.target.result;
    preview.style.display = 'block';

    // Check aspect ratio from actual image dimensions
    const img = new window.Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      if (ratio < 1.3) {
        hint.textContent = '❌ This does not look like an Aadhaar card. Please upload a landscape card photo';
        hint.className = 'field-hint error';
        preview.style.display = 'none';
      } else if (ratio > 2.0) {
        hint.textContent = '❌ Image is too wide. Please upload a proper Aadhaar card photo';
        hint.className = 'field-hint error';
        preview.style.display = 'none';
      } else {
        hint.textContent = '✅ Image looks like a valid Aadhaar card';
        hint.className = 'field-hint success';
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ── FARMER REGISTER ──────────────────────────────────────────
async function registerFarmer() {
  const name    = document.getElementById('f_name').value.trim();
  const email   = document.getElementById('f_email').value.trim();
  const password= document.getElementById('f_password').value;
  const confirm = document.getElementById('f_confirm').value;
  const phone   = document.getElementById('f_phone').value.trim();
  const aadhar  = document.getElementById('f_aadhar').value.trim();
  const imgFile = document.getElementById('f_aadhar_img').files[0];

  // Field presence
  if (!name || !email || !password || !phone || !aadhar)
    return showMsg('farmer-msg', t('val_all_required'), 'error');

  // Password match
  if (password !== confirm)
    return showMsg('farmer-msg', t('val_password_match'), 'error');

  // Phone
  if (phone.length !== 10 || isNaN(phone))
    return showMsg('farmer-msg', t('val_phone_digits'), 'error');

  // ── Aadhaar number (client-side) ──────────────────────────
  const numErr = validateAadhaarNumber(aadhar);
  if (numErr) return showMsg('farmer-msg', numErr, 'error');

  // ── Aadhaar image (client-side) ───────────────────────────
  const imgErr = validateAadhaarImageClient(imgFile);
  if (imgErr) return showMsg('farmer-msg', imgErr, 'error');

  // Show uploading state
  showMsg('farmer-msg', '⏳ Validating and uploading...', 'success');

  const fd = new FormData();
  fd.append('name', name);
  fd.append('email', email);
  fd.append('password', password);
  fd.append('phone', phone);
  fd.append('aadhar_number', aadhar);
  fd.append('aadhar_image', imgFile);

  const res  = await fetch('/api/signup/farmer', { method: 'POST', body: fd });
  const data = await res.json();
  showMsg('farmer-msg', data.message, data.success ? 'success' : 'error');
  if (data.success) {
    document.getElementById('farmerForm').reset();
    document.getElementById('aadhar-hint').textContent = '';
    document.getElementById('img-hint').textContent = '';
    document.getElementById('img-preview').style.display = 'none';
  }
}

// ── LOGIN ────────────────────────────────────────────────────
async function doLogin() {
  const role     = document.getElementById('loginRole').value;
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password)
    return showMsg('login-msg', t('val_login_fill'), 'error');

  const res  = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, email, password })
  });
  const data = await res.json();
  if (data.success) {
    window.location.href = '/dashboard';
  } else {
    showMsg('login-msg', t('val_login_failed'), 'error');
  }
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
});
