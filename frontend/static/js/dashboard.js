// ── DASHBOARD JS – All Roles ──────────────────────────────────
let currentRole = '';
let currentUser = '';
let _equipMap   = {};

// Menu keys map to i18n keys and handler function names
const MENU_DEFS = {
  admin:    [['menu_add_producer','showAddProducer'],['menu_producers','showProducers'],['menu_customers','showCustomers']],
  producer: [['menu_add_equipment','showAddEquipment'],['menu_equipments','showEquipments'],
             ['menu_alerts','showAlerts'],['menu_add_qc','showAddQC'],['menu_view_qc','showViewQC']],
  farmer:   [['menu_all_eq','showAllEquipments'],['menu_my_rentals','showMyRentals']],
  qc:       [['menu_qc_check','showQualityCheck']]
};

// ── INIT ─────────────────────────────────────────────────────
window.onload = async () => {
  const res  = await fetch('/api/session');
  const data = await res.json();
  if (!data.logged_in) { window.location.href = '/'; return; }

  currentRole = data.role;
  currentUser = data.name;

  // Apply saved language
  const dashSel = document.getElementById('dashLangSelect');
  if (dashSel) dashSel.value = currentLang;
  applyLanguage(currentLang);

  buildSidebar();

  if (currentRole === 'farmer')
    document.getElementById('alertBell').style.display = 'block';

  // Auto-load first panel
  const firstFn = MENU_DEFS[currentRole][0][1];
  window[firstFn]();
  document.querySelector('.sidebar-nav button').classList.add('active');
};

function buildSidebar() {
  const su = document.getElementById('sidebarUser');
  su.innerHTML = `<strong style="color:#fff">${currentUser}</strong><br>
    <span style="font-size:.78rem;opacity:.7">${currentRole.toUpperCase()}</span>`;

  const nav = document.getElementById('sidebarNav');
  nav.innerHTML = '';
  MENU_DEFS[currentRole].forEach(([i18nKey, fn]) => {
    const btn = document.createElement('button');
    btn.textContent = t(i18nKey);
    btn.dataset.i18nKey = i18nKey;
    btn.onclick = () => { window[fn](); setActive(btn); };
    nav.appendChild(btn);
  });
}

// Re-build sidebar labels + static data-i18n elements when language changes
const _origApply = applyLanguage;
applyLanguage = function(lang) {
  _origApply(lang);
  // update sidebar button labels
  document.querySelectorAll('.sidebar-nav button[data-i18n-key]').forEach(btn => {
    btn.textContent = t(btn.dataset.i18nKey);
  });
  // update lang selectors
  const ds = document.getElementById('dashLangSelect');
  if (ds) ds.value = lang;
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
  const map   = { in_rent:'badge-blue', in_qc:'badge-yellow', returned:'badge-green', rejected:'badge-red' };
  const label = { in_rent: t('status_in_rent'), in_qc: t('status_in_qc'),
                  returned: t('status_returned'), rejected: t('status_rejected') };
  return `<span class="badge ${map[s]||'badge-blue'}">${label[s]||s}</span>`;
}

// ════════════════════════════════════════════════════════════
// ── ADMIN ────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════

function showAddProducer() {
  document.getElementById('pageTitle').textContent = t('menu_add_producer');
  panel(`<div class="card">
    <h3>${t('admin_add_producer')}</h3>
    <div class="form-grid">
      <div class="form-group"><label>${t('col_name')}</label>
        <input id="p_name" placeholder="${t('admin_producer_name')}"/></div>
      <div class="form-group"><label>${t('col_email')}</label>
        <input id="p_email" type="email" placeholder="${t('admin_producer_email')}"/></div>
      <div class="form-group"><label>${t('f_password')}</label>
        <input id="p_pass" type="password" placeholder="${t('admin_producer_pass')}"/></div>
      <div class="form-group"><label>${t('col_phone')}</label>
        <input id="p_phone" maxlength="10" placeholder="${t('admin_producer_phone')}"/></div>
      <div class="form-group" style="grid-column:1/-1"><label>${t('col_address')}</label>
        <textarea id="p_addr" rows="2" placeholder="${t('admin_producer_addr')}"></textarea></div>
    </div>
    <button class="submit-btn" onclick="addProducer()">${t('admin_btn_add')}</button>
    <div id="prod-msg" class="form-msg"></div>
  </div>`);
}

async function addProducer() {
  const name=v('p_name'),email=v('p_email'),password=v('p_pass'),phone=v('p_phone'),address=v('p_addr');
  if (!name||!email||!password||!phone||!address) return msg('prod-msg',t('val_all_required'),false);
  if (phone.length!==10||isNaN(phone))            return msg('prod-msg',t('val_phone_digits'),false);
  const res = await post('/api/admin/producers',{name,email,password,phone,address});
  msg('prod-msg',res.message,res.success);
}

async function showProducers() {
  document.getElementById('pageTitle').textContent = t('menu_producers');
  const data = await get('/api/admin/producers');
  const rows = data.map(p=>`<tr>
    <td>${p.name}</td><td>${p.phone}</td><td>${p.email}</td><td>${p.address||'-'}</td>
    <td><button class="danger-btn" onclick="deleteProducer(${p.id})">${t('dash_delete')}</button></td>
  </tr>`).join('');
  panel(`<div class="card"><h3>${t('admin_producers_title')} (${data.length})</h3>
    <div class="table-wrap"><table>
      <thead><tr><th>${t('col_name')}</th><th>${t('col_phone')}</th><th>${t('col_email')}</th>
        <th>${t('col_address')}</th><th>${t('col_action')}</th></tr></thead>
      <tbody>${rows||`<tr><td colspan="5" class="empty">-</td></tr>`}</tbody>
    </table></div></div>`);
}

async function deleteProducer(id) {
  if (!confirm('Delete this producer?')) return;
  await fetch(`/api/admin/producers/${id}`,{method:'DELETE'});
  showProducers();
}

async function showCustomers() {
  document.getElementById('pageTitle').textContent = t('menu_customers');
  const data = await get('/api/admin/farmers');
  const rows = data.map(f=>`<tr>
    <td>${f.name}</td><td>${f.phone||'-'}</td><td>${f.aadhar_number||'-'}</td><td>${f.email}</td>
  </tr>`).join('');
  panel(`<div class="card"><h3>${t('admin_farmers_title')} (${data.length})</h3>
    <div class="table-wrap"><table>
      <thead><tr><th>${t('col_name')}</th><th>${t('col_phone')}</th>
        <th>${t('col_aadhar')}</th><th>${t('col_email')}</th></tr></thead>
      <tbody>${rows||`<tr><td colspan="4" class="empty">-</td></tr>`}</tbody>
    </table></div></div>`);
}

// ════════════════════════════════════════════════════════════
// ── PRODUCER ─────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════

function showAddEquipment() {
  document.getElementById('pageTitle').textContent = t('menu_add_equipment');
  panel(`<div class="card"><h3>${t('prod_add_eq_title')}</h3>
    <div class="form-grid">
      <div class="form-group"><label>${t('prod_eq_name')}</label>
        <input id="eq_name" placeholder="${t('prod_eq_name')}"/></div>
      <div class="form-group"><label>${t('prod_eq_used')}</label>
        <input id="eq_used" placeholder="${t('prod_eq_used')}"/></div>
      <div class="form-group"><label>${t('prod_eq_rent')}</label>
        <input id="eq_rent" type="number" min="1" placeholder="500"/></div>
      <div class="form-group"><label>${t('prod_eq_qty')}</label>
        <input id="eq_qty" type="number" min="1" placeholder="2"/></div>
      <div class="form-group"><label>${t('prod_eq_max')}</label>
        <input id="eq_max" type="number" min="1" placeholder="30"/></div>
      <div class="form-group"><label>${t('prod_eq_dep')}</label>
        <input id="eq_dep" type="number" min="0" placeholder="5000"/></div>
      <div class="form-group" style="grid-column:1/-1"><label>${t('prod_eq_desc')}</label>
        <textarea id="eq_desc" rows="2"></textarea></div>
      <div class="form-group" style="grid-column:1/-1"><label>${t('prod_eq_img')}</label>
        <input id="eq_img" type="file" accept=".jpg,.jpeg,.png"/></div>
    </div>
    <button class="submit-btn" onclick="addEquipment()">${t('prod_btn_add_eq')}</button>
    <div id="eq-msg" class="form-msg"></div>
  </div>`);
}

async function addEquipment() {
  const name=v('eq_name'),used=v('eq_used'),rent=v('eq_rent'),qty=v('eq_qty'),max=v('eq_max'),dep=v('eq_dep');
  if (!name||!used||!rent||!qty||!max||!dep) return msg('eq-msg',t('val_all_required'),false);
  const fd=new FormData();
  fd.append('name',name);fd.append('used_for',used);fd.append('rent_per_day',rent);
  fd.append('quantity',qty);fd.append('max_days',max);fd.append('safety_deposit',dep);
  fd.append('description',v('eq_desc'));
  const imgFile=document.getElementById('eq_img').files[0];
  if(imgFile) fd.append('image',imgFile);
  const res=await fetch('/api/producer/equipments',{method:'POST',body:fd});
  const data=await res.json();
  msg('eq-msg',data.message,data.success);
  if(data.success) showAddEquipment();
}

async function showEquipments() {
  document.getElementById('pageTitle').textContent = t('menu_equipments');
  const data = await get('/api/producer/equipments');
  if(!data.length){panel(`<div class="card"><p class="empty">${t('farm_no_eq')}</p></div>`);return;}
  const cards = data.map(e=>`<div class="eq-card">
    <div class="eq-card-img">${e.image?`<img src="${e.image}" alt="${e.name}"/>`:'🚜'}</div>
    <div class="eq-card-body">
      <h4>${e.name}</h4>
      <p>📌 ${e.used_for}</p>
      <p>📦 ${t('farm_available')} <strong>${e.quantity}</strong> &nbsp;|&nbsp; ⏱ ${t('farm_max')} ${e.max_days}</p>
      <p>🔒 ${t('farm_deposit')} ₹${e.safety_deposit}</p>
      <div class="eq-card-price">₹${e.rent_per_day} ${t('farm_per_day')}</div>
      <div class="eq-card-actions">
        <button class="info-btn" onclick='openUpdateModal(${e.id},"${esc(e.name)}","${esc(e.used_for)}",${e.rent_per_day},${e.quantity},${e.max_days},${e.safety_deposit},"${esc(e.description||"")}")'>${t('dash_update')}</button>
        <button class="danger-btn" onclick="deleteEquipment(${e.id})">${t('dash_delete')}</button>
      </div>
    </div>
  </div>`).join('');
  panel(`<div class="eq-cards">${cards}</div>`);
}

function esc(s){ return String(s).replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

async function deleteEquipment(id) {
  if(!confirm('Delete?')) return;
  await fetch(`/api/producer/equipments/${id}`,{method:'DELETE'});
  showEquipments();
}

function openUpdateModal(id,name,used,rent,qty,max,dep,desc) {
  document.getElementById('updateFormContent').innerHTML=`
    <div class="form-grid">
      <div class="form-group"><label>${t('prod_eq_name')}</label><input id="u_name" value="${name}"/></div>
      <div class="form-group"><label>${t('prod_eq_used')}</label><input id="u_used" value="${used}"/></div>
      <div class="form-group"><label>${t('prod_eq_rent')}</label><input id="u_rent" type="number" value="${rent}"/></div>
      <div class="form-group"><label>${t('prod_eq_qty')}</label><input id="u_qty" type="number" value="${qty}"/></div>
      <div class="form-group"><label>${t('prod_eq_max')}</label><input id="u_max" type="number" value="${max}"/></div>
      <div class="form-group"><label>${t('prod_eq_dep')}</label><input id="u_dep" type="number" value="${dep}"/></div>
      <div class="form-group" style="grid-column:1/-1"><label>${t('prod_eq_desc')}</label>
        <textarea id="u_desc" rows="2">${desc}</textarea></div>
    </div>
    <button class="submit-btn" onclick="updateEquipment(${id})">${t('dash_save')}</button>
    <div id="upd-msg" class="form-msg"></div>`;
  openModal('updateModal');
}

async function updateEquipment(id) {
  const body={name:v('u_name'),used_for:v('u_used'),rent_per_day:v('u_rent'),
              quantity:v('u_qty'),max_days:v('u_max'),safety_deposit:v('u_dep'),description:v('u_desc')};
  const res=await put(`/api/producer/equipments/${id}`,body);
  msg('upd-msg',res.message,res.success);
  if(res.success){setTimeout(()=>{closeModal('updateModal');showEquipments();},900);}
}

async function showAlerts() {
  document.getElementById('pageTitle').textContent = t('menu_alerts');
  const data = await get('/api/producer/alerts/excess');
  const rows = data.map(r=>`<tr>
    <td>${r.farmer_name}</td><td>${r.equipment_name}</td>
    <td>${r.from_date}</td><td>${r.to_date}</td><td>${r.max_days}</td><td>${r.selected_days}</td>
    <td><button class="warn-btn" onclick="sendAlert(${r.id},this)">${t('dash_alert_btn')}</button></td>
  </tr>`).join('');
  panel(`<div class="card"><h3>${t('prod_overdue_title')}</h3>
    ${!data.length?`<p style="color:var(--green);margin-bottom:1rem">${t('prod_no_overdue')}</p>`:''}
    <div class="table-wrap"><table>
      <thead><tr><th>${t('qc_farmer')}</th><th>${t('prod_eq_name')}</th>
        <th>${t('farm_from_col')}</th><th>${t('farm_to_col')}</th>
        <th>${t('farm_max_col')}</th><th>${t('farm_days_col')}</th><th>${t('col_action')}</th></tr></thead>
      <tbody>${rows||`<tr><td colspan="7" class="empty">-</td></tr>`}</tbody>
    </table></div></div>`);
}

async function sendAlert(id,btn) {
  btn.disabled=true; btn.textContent='✅ Sent';
  const res=await post(`/api/producer/alerts/${id}`,{});
  if(!res.success){btn.disabled=false;btn.textContent=t('dash_alert_btn');}
}

function showAddQC() {
  document.getElementById('pageTitle').textContent = t('menu_add_qc');
  panel(`<div class="card"><h3>${t('prod_add_qc_title')}</h3>
    <div class="form-grid">
      <div class="form-group"><label>${t('prod_qc_name')}</label>
        <input id="qc_name" placeholder="${t('prod_qc_name')}"/></div>
      <div class="form-group"><label>${t('prod_qc_phone')}</label>
        <input id="qc_phone" maxlength="10" placeholder="${t('prod_qc_phone')}"/></div>
      <div class="form-group"><label>${t('prod_qc_email')}</label>
        <input id="qc_email" type="email" placeholder="${t('prod_qc_email')}"/></div>
      <div class="form-group"><label>${t('prod_qc_pass')}</label>
        <input id="qc_pass" type="password" placeholder="${t('prod_qc_pass')}"/></div>
    </div>
    <button class="submit-btn" onclick="addQC()">${t('prod_btn_add_qc')}</button>
    <div id="qc-msg" class="form-msg"></div>
  </div>`);
}

async function addQC() {
  const name=v('qc_name'),phone=v('qc_phone'),email=v('qc_email'),password=v('qc_pass');
  if(!name||!phone||!email||!password) return msg('qc-msg',t('val_all_required'),false);
  if(phone.length!==10||isNaN(phone))  return msg('qc-msg',t('val_phone_digits'),false);
  const res=await post('/api/producer/qc',{name,phone,email,password});
  msg('qc-msg',res.message,res.success);
  if(res.success) showAddQC();
}

async function showViewQC() {
  document.getElementById('pageTitle').textContent = t('menu_view_qc');
  const data = await get('/api/producer/qc');
  const rows = data.map(q=>`<tr>
    <td>${q.name}</td><td>${q.phone}</td><td>${q.email}</td>
    <td><button class="danger-btn" onclick="deleteQC(${q.id})">${t('dash_delete')}</button></td>
  </tr>`).join('');
  panel(`<div class="card"><h3>${t('prod_qc_team')} (${data.length})</h3>
    <div class="table-wrap"><table>
      <thead><tr><th>${t('col_name')}</th><th>${t('col_phone')}</th>
        <th>${t('col_email')}</th><th>${t('col_action')}</th></tr></thead>
      <tbody>${rows||`<tr><td colspan="4" class="empty">-</td></tr>`}</tbody>
    </table></div></div>`);
}

async function deleteQC(id) {
  if(!confirm('Remove?')) return;
  await fetch(`/api/producer/qc/${id}`,{method:'DELETE'});
  showViewQC();
}

// ════════════════════════════════════════════════════════════
// ── FARMER ───────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════

async function showAllEquipments() {
  document.getElementById('pageTitle').textContent = t('menu_all_eq');
  const data = await get('/api/farmer/equipments');
  if(!data.length){panel(`<div class="card"><p class="empty">${t('farm_no_eq')}</p></div>`);return;}
  _equipMap={};
  data.forEach(e=>{_equipMap[e.id]=e;});
  const cards=data.map(e=>`<div class="eq-card">
    <div class="eq-card-img">${e.image?`<img src="${e.image}" alt="${e.name}"/>`:'🚜'}</div>
    <div class="eq-card-body">
      <h4>${e.name}</h4>
      <p>🏭 ${t('farm_by')} ${e.producer_name}</p>
      <p>📌 ${e.used_for}</p>
      <p>📦 ${t('farm_available')} <strong>${e.quantity}</strong> &nbsp;|&nbsp; ⏱ ${t('farm_max')} ${e.max_days}</p>
      <p>🔒 ${t('farm_deposit')} ₹${e.safety_deposit}</p>
      <div class="eq-card-price">₹${e.rent_per_day} ${t('farm_per_day')}</div>
      <div class="eq-card-actions">
        <button class="success-btn" onclick="openRentModal(${e.id})">${t('dash_rent')}</button>
      </div>
    </div>
  </div>`).join('');
  panel(`<div class="eq-cards">${cards}</div>`);
}

function openRentModal(eqId) {
  const e=_equipMap[eqId];
  const today=new Date().toISOString().split('T')[0];
  document.getElementById('rentFormContent').innerHTML=`
    <div class="info-row">
      <span><strong>${e.name}</strong></span>
      <span>₹${e.rent_per_day} ${t('farm_per_day')}</span>
      <span>${t('farm_max')} ${e.max_days}</span>
      <span>${t('farm_deposit')} ₹${e.safety_deposit}</span>
    </div><hr class="divider"/>
    <div class="form-grid">
      <div class="form-group"><label>${t('farm_from')}</label>
        <input value="${today}" readonly style="background:#eee"/></div>
      <div class="form-group"><label>${t('farm_to')}</label>
        <input id="r_to" type="date" min="${today}" onchange="calcRent(${eqId})"/></div>
      <div class="form-group"><label>${t('farm_sel_days')} ${e.max_days})</label>
        <input id="r_days" type="number" min="1" max="${e.max_days}" oninput="calcRent(${eqId})"/></div>
      <div class="form-group"><label>${t('farm_rent_total')}</label>
        <input id="r_total" readonly style="background:#eee"/></div>
      <div class="form-group"><label>${t('farm_total')}</label>
        <input id="r_grand" readonly style="background:#eee;font-weight:700"/></div>
      <div class="form-group"><label>${t('farm_pay_mode')}</label>
        <select id="r_pay" onchange="togglePayFields()">
          <option value="upi">${t('farm_upi')}</option>
          <option value="card">${t('farm_card')}</option>
        </select></div>
      <div id="upi-field" class="form-group" style="grid-column:1/-1">
        <label>${t('farm_upi_id')}</label><input id="r_upi" placeholder="yourname@upi"/></div>
      <div id="card-fields" style="display:none;grid-column:1/-1">
        <div class="form-grid">
          <div class="form-group"><label>${t('farm_card_no')}</label>
            <input id="r_card" maxlength="16"/></div>
          <div class="form-group"><label>${t('farm_cvv')}</label>
            <input id="r_cvv" maxlength="3"/></div>
        </div></div>
      <div class="form-group" style="grid-column:1/-1">
        <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer">
          <input type="checkbox" id="r_terms" style="width:auto"/>
          ${t('farm_terms')}
        </label></div>
    </div>
    <button class="submit-btn" onclick="makePayment(${eqId})">${t('dash_make_payment')}</button>
    <div id="rent-msg" class="form-msg"></div>`;
  openModal('rentModal');
}

function calcRent(eqId) {
  const e=_equipMap[eqId];
  const days=parseInt(document.getElementById('r_days').value)||0;
  if(days>e.max_days){document.getElementById('r_days').value='';
    alert(`❌ ${t('farm_sel_days')} ${e.max_days})!`);return;}
  if(days<1) return;
  const rt=e.rent_per_day*days;
  document.getElementById('r_total').value='₹'+rt.toFixed(2);
  document.getElementById('r_grand').value='₹'+(rt+e.safety_deposit).toFixed(2);
}

function togglePayFields() {
  const mode=document.getElementById('r_pay').value;
  document.getElementById('upi-field').style.display=mode==='upi'?'':'none';
  document.getElementById('card-fields').style.display=mode==='card'?'':'none';
}

async function makePayment(eqId) {
  const e=_equipMap[eqId];
  const to_date=v('r_to'), sel_days=parseInt(v('r_days')), pay_mode=v('r_pay');
  const terms=document.getElementById('r_terms').checked;
  if(!to_date)          return msg('rent-msg',t('val_all_required'),false);
  if(!sel_days||sel_days<1) return msg('rent-msg',t('val_all_required'),false);
  if(sel_days>e.max_days)   return msg('rent-msg',`${t('farm_sel_days')} ${e.max_days})!`,false);
  if(!terms)            return msg('rent-msg',t('farm_terms'),false);
  if(pay_mode==='upi'&&!v('r_upi'))    return msg('rent-msg',t('farm_upi_id'),false);
  if(pay_mode==='card'&&(!v('r_card')||!v('r_cvv'))) return msg('rent-msg',t('farm_card_no'),false);

  msg('rent-msg',t('farm_processing'),true);
  await new Promise(r=>setTimeout(r,1800));
  const res=await post('/api/farmer/rent',{equipment_id:eqId,to_date,selected_days:sel_days,payment_mode:pay_mode});
  msg('rent-msg',res.message,res.success);
  if(res.success){setTimeout(()=>{closeModal('rentModal');showMyRentals();},1200);}
}

async function showMyRentals() {
  document.getElementById('pageTitle').textContent = t('menu_my_rentals');
  const data=await get('/api/farmer/rentals');
  if(!data.length){panel(`<div class="card"><p class="empty">${t('farm_no_rentals')}</p></div>`);return;}
  const rows=data.map(r=>`<tr>
    <td><strong>${r.equipment_name}</strong></td>
    <td>${r.from_date}</td><td>${r.to_date}</td>
    <td>${r.max_days}</td><td>${r.selected_days}</td>
    <td>₹${r.safety_deposit}</td><td>₹${r.rent_total}</td><td>₹${r.total_price}</td>
    <td>${statusBadge(r.status)}</td>
    <td>${actionCell(r)}</td>
  </tr>`).join('');
  panel(`<div class="card"><h3>${t('menu_my_rentals')} (${data.length})</h3>
    <div class="table-wrap"><table>
      <thead><tr>
        <th>${t('prod_eq_name')}</th><th>${t('farm_from_col')}</th><th>${t('farm_to_col')}</th>
        <th>${t('farm_max_col')}</th><th>${t('farm_days_col')}</th>
        <th>${t('farm_dep_col')}</th><th>${t('farm_rent_col')}</th><th>${t('farm_total_col')}</th>
        <th>${t('farm_status_col')}</th><th>${t('farm_action_col')}</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div></div>`);
}

function actionCell(r) {
  if(r.status==='in_rent')  return `<button class="warn-btn" onclick="returnEquipment(${r.id})">${t('dash_return')}</button>`;
  if(r.status==='in_qc')    return `<span style="color:#856404;font-weight:600">${t('status_processing')}</span>`;
  if(r.status==='returned') return `<span style="color:#155724">✅ ${t('status_returned')}<br><small>₹${r.returning_amount}</small></span>`;
  if(r.status==='rejected') return `<span style="color:#721c24">❌ ${t('status_rejected')}</span>`;
  return '-';
}

async function returnEquipment(id) {
  if(!confirm('Submit return request?')) return;
  const res=await post(`/api/farmer/rentals/${id}/return`,{});
  alert(res.message); showMyRentals();
}

async function checkAlerts() {
  const data=await get('/api/farmer/alerts');
  if(!data.length){alert('🔔 No new alerts!');return;}
  alert('⚠️\n\n'+data.map(a=>a.message).join('\n\n'));
}

// ════════════════════════════════════════════════════════════
// ── QC ───────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════

async function showQualityCheck() {
  document.getElementById('pageTitle').textContent = t('qc_title');
  const data=await get('/api/qc/rentals');
  if(!data.length){panel(`<div class="card"><p class="empty">${t('qc_no_items')}</p></div>`);return;}
  const rows=data.map(r=>`<tr>
    <td><strong>${r.equipment_name}</strong></td><td>${r.farmer_name}</td>
    <td>${r.from_date}</td><td>${r.to_date}</td>
    <td>${r.max_days}</td><td>${r.selected_days}</td>
    <td>₹${r.safety_deposit}</td><td>₹${r.rent_total}</td><td>₹${r.total_price}</td>
    <td>${statusBadge(r.status)}</td>
    <td><button class="success-btn" onclick="openQCModal(${r.id},'accept',${r.safety_deposit},'${r.to_date}')">${t('dash_accept')}</button></td>
    <td><button class="danger-btn"  onclick="openQCModal(${r.id},'reject',${r.safety_deposit},'${r.to_date}')">${t('dash_reject')}</button></td>
  </tr>`).join('');
  panel(`<div class="card"><h3>${t('qc_pending')} (${data.length})</h3>
    <div class="table-wrap"><table>
      <thead><tr>
        <th>${t('prod_eq_name')}</th><th>${t('qc_farmer')}</th>
        <th>${t('farm_from_col')}</th><th>${t('qc_to_date')}</th>
        <th>${t('farm_max_col')}</th><th>${t('farm_days_col')}</th>
        <th>${t('farm_dep_col')}</th><th>${t('farm_rent_col')}</th><th>${t('farm_total_col')}</th>
        <th>${t('farm_status_col')}</th><th>${t('dash_accept')}</th><th>${t('dash_reject')}</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div></div>`);
}

function openQCModal(rid,action,safetyDep,toDate) {
  const today=new Date().toISOString().split('T')[0];
  const diff=Math.max(0,Math.floor((new Date(today)-new Date(toDate))/(1000*60*60*24)));
  const delayFine=diff*200;
  document.getElementById('qcFormContent').innerHTML=`
    <div class="info-row">
      <span><strong>${t('qc_to_date')}:</strong> ${toDate}</span>
      <span><strong>${t('qc_current')}:</strong> ${today}</span>
      <span><strong>${t('qc_delay_days')}:</strong> ${diff}</span>
      <span><strong>${t('qc_delay_fine')}:</strong> <span style="color:var(--danger)">₹${delayFine}</span></span>
    </div><hr class="divider"/>
    <div class="form-grid">
      <div class="form-group"><label>${t('qc_damage_fine')}</label>
        <input id="qc_dmg" type="number" value="0" min="0" oninput="previewReturn(${safetyDep},${delayFine})"/></div>
      <div class="form-group"><label>${t('qc_return_amt')}</label>
        <input id="qc_ret" value="₹${Math.max(0,safetyDep-delayFine)}" readonly style="background:#eee;font-weight:700;color:var(--green)"/></div>
    </div>
    <p style="font-size:.85rem;color:var(--grey);margin:.5rem 0 1rem">${t('qc_formula')}</p>
    <button class="submit-btn${action==='reject'?' danger-btn':''}" onclick="submitQC(${rid},'${action}')">
      ${action==='accept'?t('dash_confirm_accept'):t('dash_confirm_reject')}
    </button>
    <div id="qc-res-msg" class="form-msg"></div>`;
  openModal('qcModal');
}

function previewReturn(safetyDep,delayFine) {
  const dmg=parseFloat(v('qc_dmg'))||0;
  document.getElementById('qc_ret').value='₹'+Math.max(0,safetyDep-delayFine-dmg).toFixed(2);
}

async function submitQC(rid,action) {
  const damage_fine=parseFloat(v('qc_dmg'))||0;
  const res=await post(`/api/qc/rentals/${rid}/${action}`,{damage_fine});
  msg('qc-res-msg',res.message,res.success);
  if(res.success){
    if(action==='accept')
      msg('qc-res-msg',`${res.message} | ${t('qc_return_amt')}: ₹${res.returning_amount}`,true);
    setTimeout(()=>{closeModal('qcModal');showQualityCheck();},1800);
  }
}

// ════════════════════════════════════════════════════════════
// ── HELPERS ──────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════
function v(id)  { return (document.getElementById(id)||{}).value||''; }
function msg(id,text,ok) {
  const el=document.getElementById(id); if(!el)return;
  el.textContent=text; el.className='form-msg '+(ok?'success':'error');
}
async function get(url)       { return (await fetch(url)).json(); }
async function post(url,body) { return (await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})).json(); }
async function put(url,body)  { return (await fetch(url,{method:'PUT', headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})).json(); }

document.addEventListener('keydown',e=>{
  if(e.key==='Escape')
    document.querySelectorAll('.modal-backdrop.open').forEach(m=>m.classList.remove('open'));
});
