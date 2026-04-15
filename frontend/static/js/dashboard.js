// ── DASHBOARD JS – All Roles ──────────────────────────────────
let currentRole = '';
let currentUser = '';
let _rentEquip  = null;   // holds current equipment object for rent modal

const MENUS = {
  admin:    [['➕ Add Producer','showAddProducer'],['🏭 Producers','showProducers'],['👨‍🌾 Customers','showCustomers']],
  producer: [['➕ Add Equipment','showAddEquipment'],['🚜 Equipments','showEquipments'],
             ['⏰ Alert Excess Time','showAlerts'],['👷 Add QC Person','showAddQC'],['👁 View QC','showViewQC']],
  farmer:   [['🌾 All Equipments','showAllEquipments'],['📋 My Rentals','showMyRentals']],
  qc:       [['✅ Quality Check','showQualityCheck']]
};

// ── INIT ─────────────────────────────────────────────────────
window.onload = async () => {
  const res  = await fetch('/api/session');
  const data = await res.json();
  if (!data.logged_in) { window.location.href = '/'; return; }

  currentRole = data.role;
  currentUser = data.name;

  const su = document.getElementById('sidebarUser');
  su.innerHTML = `<strong style="color:#fff">${data.name}</strong><br><span style="font-size:.78rem;opacity:.7">${data.role.toUpperCase()}</span>`;

  const nav = document.getElementById('sidebarNav');
  MENUS[currentRole].forEach(([label, fn]) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.onclick = () => { window[fn](); setActive(btn); };
    nav.appendChild(btn);
  });

  if (currentRole === 'farmer') document.getElementById('alertBell').style.display = 'block';

  const firstFn = MENUS[currentRole][0][1];
  window[firstFn]();
  nav.querySelector('button').classList.add('active');
};

function setActive(btn) {
  document.querySelectorAll('.sidebar-nav button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/';
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function panel(html)    { document.getElementById('panelArea').innerHTML = html; }

function statusBadge(s) {
  const map = { in_rent:'badge-blue', in_qc:'badge-yellow', returned:'badge-green', rejected:'badge-red' };
  const label = { in_rent:'In Rent', in_qc:'In QC', returned:'Returned', rejected:'Rejected' };
  return `<span class="badge ${map[s]||'badge-blue'}">${label[s]||s}</span>`;
}

// ════════════════════════════════════════════════════════════
// ── ADMIN ────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════

function showAddProducer() {
  document.getElementById('pageTitle').textContent = 'Add Producer';
  panel(`<div class="card">
    <h3>Add New Producer</h3>
    <div class="form-grid">
      <div class="form-group"><label>Name</label><input id="p_name" placeholder="Producer / Company Name"/></div>
      <div class="form-group"><label>Email</label><input id="p_email" type="email" placeholder="Email"/></div>
      <div class="form-group"><label>Password</label><input id="p_pass" type="password" placeholder="Password"/></div>
      <div class="form-group"><label>Phone (10 digits)</label><input id="p_phone" maxlength="10" placeholder="9876543210"/></div>
      <div class="form-group" style="grid-column:1/-1"><label>Address</label>
        <textarea id="p_addr" rows="2" placeholder="Full address"></textarea></div>
    </div>
    <button class="submit-btn" onclick="addProducer()">Add Producer</button>
    <div id="prod-msg" class="form-msg"></div>
  </div>`);
}

async function addProducer() {
  const name=v('p_name'), email=v('p_email'), password=v('p_pass'), phone=v('p_phone'), address=v('p_addr');
  if (!name||!email||!password||!phone||!address) return msg('prod-msg','All fields are required',false);
  if (phone.length!==10||isNaN(phone))            return msg('prod-msg','Phone must be 10 digits',false);
  const res = await post('/api/admin/producers',{name,email,password,phone,address});
  msg('prod-msg', res.message, res.success);
  if (res.success) { document.getElementById('p_name').closest('form') && document.getElementById('p_name').closest('form').reset(); }
}

async function showProducers() {
  document.getElementById('pageTitle').textContent = 'Producers';
  const data = await get('/api/admin/producers');
  const rows = data.map(p=>`<tr>
    <td>${p.name}</td><td>${p.phone}</td><td>${p.email}</td><td>${p.address||'-'}</td>
    <td><button class="danger-btn" onclick="deleteProducer(${p.id})">🗑 Delete</button></td>
  </tr>`).join('');
  panel(`<div class="card"><h3>All Producers (${data.length})</h3><div class="table-wrap">
    <table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Address</th><th>Action</th></tr></thead>
    <tbody>${rows||'<tr><td colspan="5" class="empty">No producers yet</td></tr>'}</tbody></table>
  </div></div>`);
}

async function deleteProducer(id) {
  if (!confirm('Delete this producer and all their data?')) return;
  const res = await fetch(`/api/admin/producers/${id}`,{method:'DELETE'});
  showProducers();
}

async function showCustomers() {
  document.getElementById('pageTitle').textContent = 'Customers (Farmers)';
  const data = await get('/api/admin/farmers');
  const rows = data.map(f=>`<tr>
    <td>${f.name}</td><td>${f.phone||'-'}</td><td>${f.aadhar_number||'-'}</td><td>${f.email}</td>
  </tr>`).join('');
  panel(`<div class="card"><h3>Registered Farmers (${data.length})</h3><div class="table-wrap">
    <table><thead><tr><th>Name</th><th>Phone</th><th>Aadhar</th><th>Email</th></tr></thead>
    <tbody>${rows||'<tr><td colspan="4" class="empty">No farmers registered yet</td></tr>'}</tbody></table>
  </div></div>`);
}

// ════════════════════════════════════════════════════════════
// ── PRODUCER ─────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════

function showAddEquipment() {
  document.getElementById('pageTitle').textContent = 'Add Equipment';
  panel(`<div class="card"><h3>Add New Equipment</h3>
    <div class="form-grid">
      <div class="form-group"><label>Equipment Name</label><input id="eq_name" placeholder="e.g. Mahindra Tractor"/></div>
      <div class="form-group"><label>Used For</label><input id="eq_used" placeholder="e.g. Ploughing, Harvesting"/></div>
      <div class="form-group"><label>Rent / Day (₹)</label><input id="eq_rent" type="number" min="1" placeholder="500"/></div>
      <div class="form-group"><label>Quantity</label><input id="eq_qty" type="number" min="1" placeholder="2"/></div>
      <div class="form-group"><label>Max Rental Days</label><input id="eq_max" type="number" min="1" placeholder="30"/></div>
      <div class="form-group"><label>Safety Deposit (₹)</label><input id="eq_dep" type="number" min="0" placeholder="5000"/></div>
      <div class="form-group" style="grid-column:1/-1"><label>Description</label>
        <textarea id="eq_desc" rows="2" placeholder="Brief description of the equipment"></textarea></div>
      <div class="form-group" style="grid-column:1/-1"><label>Equipment Image (JPG / PNG)</label>
        <input id="eq_img" type="file" accept=".jpg,.jpeg,.png"/></div>
    </div>
    <button class="submit-btn" onclick="addEquipment()">Add Equipment</button>
    <div id="eq-msg" class="form-msg"></div>
  </div>`);
}

async function addEquipment() {
  const name=v('eq_name'), used=v('eq_used'), rent=v('eq_rent');
  const qty=v('eq_qty'), max=v('eq_max'), dep=v('eq_dep');
  if (!name||!used||!rent||!qty||!max||!dep) return msg('eq-msg','All fields are required',false);

  const fd = new FormData();
  fd.append('name',name); fd.append('used_for',used);
  fd.append('rent_per_day',rent); fd.append('quantity',qty);
  fd.append('max_days',max); fd.append('safety_deposit',dep);
  fd.append('description',v('eq_desc'));
  const imgFile = document.getElementById('eq_img').files[0];
  if (imgFile) fd.append('image', imgFile);

  const res = await fetch('/api/producer/equipments',{method:'POST',body:fd});
  const data = await res.json();
  msg('eq-msg', data.message, data.success);
  if (data.success) showAddEquipment();
}

async function showEquipments() {
  document.getElementById('pageTitle').textContent = 'My Equipments';
  const data = await get('/api/producer/equipments');
  if (!data.length) { panel('<div class="card"><p class="empty">No equipments added yet. Click "Add Equipment" to start.</p></div>'); return; }
  const cards = data.map(e=>`<div class="eq-card">
    <div class="eq-card-img">${e.image?`<img src="${e.image}" alt="${e.name}"/>`:'🚜'}</div>
    <div class="eq-card-body">
      <h4>${e.name}</h4>
      <p>📌 ${e.used_for}</p>
      <p>📦 Qty: <strong>${e.quantity}</strong> &nbsp;|&nbsp; ⏱ Max: ${e.max_days} days</p>
      <p>🔒 Deposit: ₹${e.safety_deposit}</p>
      <div class="eq-card-price">₹${e.rent_per_day} / day</div>
      <div class="eq-card-actions">
        <button class="info-btn" onclick='openUpdateModal(${e.id},"${esc(e.name)}","${esc(e.used_for)}",${e.rent_per_day},${e.quantity},${e.max_days},${e.safety_deposit},"${esc(e.description||"")}")'>✏ Update</button>
        <button class="danger-btn" onclick="deleteEquipment(${e.id})">🗑 Delete</button>
      </div>
    </div>
  </div>`).join('');
  panel(`<div class="eq-cards">${cards}</div>`);
}

function esc(s){ return String(s).replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

async function deleteEquipment(id) {
  if (!confirm('Delete this equipment?')) return;
  await fetch(`/api/producer/equipments/${id}`,{method:'DELETE'});
  showEquipments();
}

function openUpdateModal(id,name,used,rent,qty,max,dep,desc) {
  document.getElementById('updateFormContent').innerHTML = `
    <div class="form-grid">
      <div class="form-group"><label>Name</label><input id="u_name" value="${name}"/></div>
      <div class="form-group"><label>Used For</label><input id="u_used" value="${used}"/></div>
      <div class="form-group"><label>Rent/Day (₹)</label><input id="u_rent" type="number" value="${rent}"/></div>
      <div class="form-group"><label>Quantity</label><input id="u_qty" type="number" value="${qty}"/></div>
      <div class="form-group"><label>Max Days</label><input id="u_max" type="number" value="${max}"/></div>
      <div class="form-group"><label>Safety Deposit (₹)</label><input id="u_dep" type="number" value="${dep}"/></div>
      <div class="form-group" style="grid-column:1/-1"><label>Description</label>
        <textarea id="u_desc" rows="2">${desc}</textarea></div>
    </div>
    <button class="submit-btn" onclick="updateEquipment(${id})">💾 Save Changes</button>
    <div id="upd-msg" class="form-msg"></div>`;
  openModal('updateModal');
}

async function updateEquipment(id) {
  const body = {name:v('u_name'),used_for:v('u_used'),rent_per_day:v('u_rent'),
                quantity:v('u_qty'),max_days:v('u_max'),safety_deposit:v('u_dep'),description:v('u_desc')};
  const res = await put(`/api/producer/equipments/${id}`, body);
  msg('upd-msg', res.message, res.success);
  if (res.success) { setTimeout(()=>{ closeModal('updateModal'); showEquipments(); }, 900); }
}

async function showAlerts() {
  document.getElementById('pageTitle').textContent = 'Alert Excess Time';
  const data = await get('/api/producer/alerts/excess');
  const rows = data.map(r=>`<tr>
    <td>${r.farmer_name}</td><td>${r.equipment_name}</td>
    <td>${r.from_date}</td><td>${r.to_date}</td>
    <td>${r.max_days}</td><td>${r.selected_days}</td>
    <td><button class="warn-btn" onclick="sendAlert(${r.id},this)">🔔 Alert</button></td>
  </tr>`).join('');
  panel(`<div class="card"><h3>Overdue Rentals</h3>
    ${data.length?'':'<p style="color:var(--green);margin-bottom:1rem">✅ No overdue rentals right now!</p>'}
    <div class="table-wrap"><table>
      <thead><tr><th>Farmer</th><th>Equipment</th><th>From</th><th>To Date</th><th>Max Days</th><th>Selected Days</th><th>Action</th></tr></thead>
      <tbody>${rows||'<tr><td colspan="7" class="empty">All returns are on time 🎉</td></tr>'}</tbody>
    </table></div></div>`);
}

async function sendAlert(id, btn) {
  btn.disabled = true; btn.textContent = '✅ Sent';
  const res = await post(`/api/producer/alerts/${id}`,{});
  if (!res.success) { btn.disabled=false; btn.textContent='🔔 Alert'; alert(res.message); }
}

function showAddQC() {
  document.getElementById('pageTitle').textContent = 'Add QC Person';
  panel(`<div class="card"><h3>Add Quality Checker</h3>
    <div class="form-grid">
      <div class="form-group"><label>Full Name</label><input id="qc_name" placeholder="QC Person Name"/></div>
      <div class="form-group"><label>Phone (10 digits)</label><input id="qc_phone" maxlength="10" placeholder="9876543210"/></div>
      <div class="form-group"><label>Email</label><input id="qc_email" type="email" placeholder="qc@example.com"/></div>
      <div class="form-group"><label>Password</label><input id="qc_pass" type="password" placeholder="Set login password"/></div>
    </div>
    <button class="submit-btn" onclick="addQC()">Add QC Person</button>
    <div id="qc-msg" class="form-msg"></div>
  </div>`);
}

async function addQC() {
  const name=v('qc_name'),phone=v('qc_phone'),email=v('qc_email'),password=v('qc_pass');
  if (!name||!phone||!email||!password) return msg('qc-msg','All fields required',false);
  if (phone.length!==10||isNaN(phone))  return msg('qc-msg','Phone must be 10 digits',false);
  const res = await post('/api/producer/qc',{name,phone,email,password});
  msg('qc-msg', res.message, res.success);
  if (res.success) showAddQC();
}

async function showViewQC() {
  document.getElementById('pageTitle').textContent = 'QC Team';
  const data = await get('/api/producer/qc');
  const rows = data.map(q=>`<tr>
    <td>${q.name}</td><td>${q.phone}</td><td>${q.email}</td>
    <td><button class="danger-btn" onclick="deleteQC(${q.id})">🗑 Delete</button></td>
  </tr>`).join('');
  panel(`<div class="card"><h3>QC Persons (${data.length})</h3><div class="table-wrap">
    <table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Action</th></tr></thead>
    <tbody>${rows||'<tr><td colspan="4" class="empty">No QC persons added yet</td></tr>'}</tbody></table>
  </div></div>`);
}

async function deleteQC(id) {
  if (!confirm('Remove this QC person?')) return;
  await fetch(`/api/producer/qc/${id}`,{method:'DELETE'});
  showViewQC();
}

// ════════════════════════════════════════════════════════════
// ── FARMER ───────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════

async function showAllEquipments() {
  document.getElementById('pageTitle').textContent = 'All Equipments';
  const data = await get('/api/farmer/equipments');
  if (!data.length) { panel('<div class="card"><p class="empty">No equipment available right now. Check back later.</p></div>'); return; }
  const cards = data.map(e=>`<div class="eq-card">
    <div class="eq-card-img">${e.image?`<img src="${e.image}" alt="${e.name}"/>`:'🚜'}</div>
    <div class="eq-card-body">
      <h4>${e.name}</h4>
      <p>🏭 By: ${e.producer_name}</p>
      <p>📌 ${e.used_for}</p>
      <p>📦 Available: <strong>${e.quantity}</strong> &nbsp;|&nbsp; ⏱ Max: ${e.max_days} days</p>
      <p>🔒 Deposit: ₹${e.safety_deposit}</p>
      <div class="eq-card-price">₹${e.rent_per_day} / day</div>
      <div class="eq-card-actions">
        <button class="success-btn" onclick="openRentModal(${e.id})">🛒 RENT</button>
      </div>
    </div>
  </div>`).join('');
  // store equipment data in JS map for rent modal
  window._equipMap = {};
  data.forEach(e=>{ window._equipMap[e.id]=e; });
  panel(`<div class="eq-cards">${cards}</div>`);
}

function openRentModal(eqId) {
  const e   = window._equipMap[eqId];
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('rentFormContent').innerHTML = `
    <div class="info-row">
      <span><strong>Equipment:</strong> ${e.name}</span>
      <span><strong>Rent/Day:</strong> ₹${e.rent_per_day}</span>
      <span><strong>Max Days:</strong> ${e.max_days}</span>
      <span><strong>Deposit:</strong> ₹${e.safety_deposit}</span>
    </div>
    <hr class="divider"/>
    <div class="form-grid">
      <div class="form-group"><label>From Date</label><input value="${today}" readonly style="background:#eee"/></div>
      <div class="form-group"><label>To Date</label>
        <input id="r_to" type="date" min="${today}" onchange="calcRent(${e.id})"/></div>
      <div class="form-group"><label>Selected Days (max ${e.max_days})</label>
        <input id="r_days" type="number" min="1" max="${e.max_days}" placeholder="Enter days"
               oninput="calcRent(${e.id})"/></div>
      <div class="form-group"><label>Rent Total</label><input id="r_total" readonly style="background:#eee"/></div>
      <div class="form-group"><label>Total (incl. deposit)</label><input id="r_grand" readonly style="background:#eee;font-weight:700"/></div>
      <div class="form-group"><label>Payment Mode</label>
        <select id="r_pay" onchange="togglePayFields()">
          <option value="upi">📱 UPI</option>
          <option value="card">💳 Card</option>
        </select>
      </div>
      <div id="upi-field" class="form-group" style="grid-column:1/-1">
        <label>UPI ID</label><input id="r_upi" placeholder="yourname@upi"/></div>
      <div id="card-fields" style="display:none;grid-column:1/-1">
        <div class="form-grid">
          <div class="form-group"><label>Card Number</label><input id="r_card" placeholder="16-digit number" maxlength="16"/></div>
          <div class="form-group"><label>CVV</label><input id="r_cvv" placeholder="CVV" maxlength="3"/></div>
        </div>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer">
          <input type="checkbox" id="r_terms" style="width:auto"/>
          I accept the Terms &amp; Conditions
        </label>
      </div>
    </div>
    <button class="submit-btn" onclick="makePayment(${e.id})">💳 Make Payment</button>
    <div id="rent-msg" class="form-msg"></div>`;
  openModal('rentModal');
}

function calcRent(eqId) {
  const e    = window._equipMap[eqId];
  const days = parseInt(document.getElementById('r_days').value)||0;
  if (days > e.max_days) {
    document.getElementById('r_days').value='';
    alert(`❌ Cannot exceed maximum rental days (${e.max_days})!`);
    return;
  }
  if (days < 1) return;
  const rentTotal = e.rent_per_day * days;
  document.getElementById('r_total').value = '₹' + rentTotal.toFixed(2);
  document.getElementById('r_grand').value = '₹' + (rentTotal + e.safety_deposit).toFixed(2);
}

function togglePayFields() {
  const mode = document.getElementById('r_pay').value;
  document.getElementById('upi-field').style.display  = mode==='upi' ? '' : 'none';
  document.getElementById('card-fields').style.display = mode==='card'? '' : 'none';
}

async function makePayment(eqId) {
  const e           = window._equipMap[eqId];
  const to_date     = v('r_to');
  const sel_days    = parseInt(v('r_days'));
  const pay_mode    = v('r_pay');
  const terms       = document.getElementById('r_terms').checked;

  if (!to_date)         return msg('rent-msg','Please select a To Date',false);
  if (!sel_days||sel_days<1) return msg('rent-msg','Please enter number of days',false);
  if (sel_days > e.max_days) return msg('rent-msg',`Cannot exceed ${e.max_days} days!`,false);
  if (!terms)           return msg('rent-msg','Please accept Terms & Conditions',false);

  if (pay_mode==='upi' && !v('r_upi'))   return msg('rent-msg','Enter UPI ID',false);
  if (pay_mode==='card' && (!v('r_card')||!v('r_cvv'))) return msg('rent-msg','Enter card details',false);

  msg('rent-msg','⏳ Your transaction is in process, please wait… don\'t refresh the page',true);
  await new Promise(r=>setTimeout(r,1800));   // dummy payment delay

  const res = await post('/api/farmer/rent',{equipment_id:eqId, to_date, selected_days:sel_days, payment_mode:pay_mode});
  msg('rent-msg', res.message, res.success);
  if (res.success) { setTimeout(()=>{ closeModal('rentModal'); showMyRentals(); }, 1200); }
}

async function showMyRentals() {
  document.getElementById('pageTitle').textContent = 'My Rentals';
  const data = await get('/api/farmer/rentals');
  if (!data.length) { panel('<div class="card"><p class="empty">You have no rentals yet. Go to "All Equipments" to rent one!</p></div>'); return; }
  const rows = data.map(r=>`<tr>
    <td><strong>${r.equipment_name}</strong></td>
    <td>${r.from_date}</td><td>${r.to_date}</td>
    <td>${r.max_days}</td><td>${r.selected_days}</td>
    <td>₹${r.safety_deposit}</td><td>₹${r.rent_total}</td><td>₹${r.total_price}</td>
    <td>${statusBadge(r.status)}</td>
    <td>${actionCell(r)}</td>
  </tr>`).join('');
  panel(`<div class="card"><h3>My Rentals (${data.length})</h3><div class="table-wrap">
    <table><thead><tr><th>Equipment</th><th>From</th><th>To</th><th>Max Days</th><th>Days</th>
      <th>Deposit</th><th>Rent Total</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
    <tbody>${rows}</tbody></table>
  </div></div>`);
}

function actionCell(r) {
  if (r.status==='in_rent')
    return `<button class="warn-btn" onclick="returnEquipment(${r.id})">↩ Return</button>`;
  if (r.status==='in_qc')
    return `<span style="color:#856404;font-weight:600">⏳ Processing</span>`;
  if (r.status==='returned')
    return `<span style="color:#155724">✅ Returned<br><small>Refund: ₹${r.returning_amount}</small></span>`;
  if (r.status==='rejected')
    return `<span style="color:#721c24">❌ Rejected<br><small>Damage fine applied</small></span>`;
  return '-';
}

async function returnEquipment(id) {
  if (!confirm('Submit a return request for this equipment?')) return;
  const res = await post(`/api/farmer/rentals/${id}/return`,{});
  alert(res.message);
  showMyRentals();
}

async function checkAlerts() {
  const data = await get('/api/farmer/alerts');
  if (!data.length) { alert('🔔 No new alerts!'); return; }
  alert('⚠️ PRODUCER ALERT:\n\n' + data.map(a=>a.message).join('\n\n'));
}

// ════════════════════════════════════════════════════════════
// ── QC ───────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════

async function showQualityCheck() {
  document.getElementById('pageTitle').textContent = 'Quality Check';
  const data = await get('/api/qc/rentals');
  if (!data.length) {
    panel('<div class="card"><p class="empty">✅ No items in QC queue right now.</p></div>');
    return;
  }
  const rows = data.map(r=>`<tr>
    <td><strong>${r.equipment_name}</strong></td><td>${r.farmer_name}</td>
    <td>${r.from_date}</td><td>${r.to_date}</td>
    <td>${r.max_days}</td><td>${r.selected_days}</td>
    <td>₹${r.safety_deposit}</td><td>₹${r.rent_total}</td><td>₹${r.total_price}</td>
    <td>${statusBadge(r.status)}</td>
    <td><button class="success-btn" onclick="openQCModal(${r.id},'accept',${r.safety_deposit},'${r.to_date}')">✅ Quality OK</button></td>
    <td><button class="danger-btn"  onclick="openQCModal(${r.id},'reject',${r.safety_deposit},'${r.to_date}')">❌ Damaged &gt;80%</button></td>
  </tr>`).join('');
  panel(`<div class="card"><h3>Pending QC (${data.length})</h3><div class="table-wrap">
    <table><thead><tr><th>Equipment</th><th>Farmer</th><th>From</th><th>To Date</th>
      <th>Max Days</th><th>Days</th><th>Deposit</th><th>Rent Total</th><th>Total</th>
      <th>Status</th><th>Accept</th><th>Reject</th></tr></thead>
    <tbody>${rows}</tbody></table>
  </div></div>`);
}

function openQCModal(rid, action, safetyDep, toDate) {
  const today = new Date().toISOString().split('T')[0];
  // calculate delay preview
  const diff  = Math.max(0, Math.floor((new Date(today)-new Date(toDate))/(1000*60*60*24)));
  const delayFine = diff * 200;

  document.getElementById('qcFormContent').innerHTML = `
    <div class="info-row">
      <span><strong>To Date:</strong> ${toDate}</span>
      <span><strong>Current Date:</strong> ${today}</span>
      <span><strong>Delay Days:</strong> ${diff}</span>
      <span><strong>Delay Fine (₹200/day):</strong> <span style="color:var(--danger)">₹${delayFine}</span></span>
    </div>
    <hr class="divider"/>
    <div class="form-grid">
      <div class="form-group"><label>Damage Fine (₹) — Enter 0 if none</label>
        <input id="qc_dmg" type="number" value="0" min="0" oninput="previewReturn(${safetyDep},${delayFine})"/></div>
      <div class="form-group"><label>Returning Amount to Farmer</label>
        <input id="qc_ret" value="₹${Math.max(0,safetyDep-delayFine)}" readonly style="background:#eee;font-weight:700;color:var(--green)"/></div>
    </div>
    <p style="font-size:.85rem;color:var(--grey);margin:.5rem 0 1rem">
      Formula: Deposit (₹${safetyDep}) − Delay Fine (₹${delayFine}) − Damage Fine = Returning Amount
    </p>
    <button class="submit-btn${action==='reject'?' danger-btn':''}" onclick="submitQC(${rid},'${action}')">
      ${action==='accept'?'✅ Confirm Accept':'❌ Confirm Reject'}
    </button>
    <div id="qc-res-msg" class="form-msg"></div>`;
  openModal('qcModal');
}

function previewReturn(safetyDep, delayFine) {
  const dmg = parseFloat(v('qc_dmg'))||0;
  const ret = Math.max(0, safetyDep - delayFine - dmg);
  document.getElementById('qc_ret').value = '₹' + ret.toFixed(2);
}

async function submitQC(rid, action) {
  const damage_fine = parseFloat(v('qc_dmg'))||0;
  const res = await post(`/api/qc/rentals/${rid}/${action}`,{damage_fine});
  msg('qc-res-msg', res.message, res.success);
  if (res.success) {
    if (action==='accept')
      msg('qc-res-msg',`${res.message} | Refund to farmer: ₹${res.returning_amount}`,true);
    setTimeout(()=>{ closeModal('qcModal'); showQualityCheck(); }, 1800);
  }
}

// ════════════════════════════════════════════════════════════
// ── HELPERS ──────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════
function v(id)   { return (document.getElementById(id)||{}).value||''; }
function msg(id,text,ok) {
  const el=document.getElementById(id); if(!el)return;
  el.textContent=text; el.className='form-msg '+(ok?'success':'error');
}
async function get(url)        { return (await fetch(url)).json(); }
async function post(url,body)  { return (await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})).json(); }
async function put(url,body)   { return (await fetch(url,{method:'PUT', headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})).json(); }

document.addEventListener('keydown', e=>{
  if(e.key==='Escape')
    document.querySelectorAll('.modal-backdrop.open').forEach(m=>m.classList.remove('open'));
});
