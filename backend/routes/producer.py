from flask import Blueprint, request, jsonify, session
import os, hashlib
from werkzeug.utils import secure_filename
from backend.config.db import execute_query

producer_bp   = Blueprint('producer', __name__)
UPLOAD_FOLDER = os.path.join('frontend', 'static', 'images', 'equipments')
ALLOWED_EXT   = {'jpg', 'jpeg', 'png'}

def require_producer(f):
    from functools import wraps
    @wraps(f)
    def dec(*a, **kw):
        if session.get('role') != 'producer':
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403
        return f(*a, **kw)
    return dec

def allowed(fn): return '.' in fn and fn.rsplit('.',1)[1].lower() in ALLOWED_EXT
def hp(p):       return hashlib.sha256(p.encode()).hexdigest()

# ── EQUIPMENT ─────────────────────────────────────────────────
@producer_bp.route('/api/producer/equipments', methods=['POST'])
@require_producer
def add_equipment():
    pid  = session['producer_id']
    name = request.form.get('name','').strip()
    used = request.form.get('used_for','').strip()
    rpd  = request.form.get('rent_per_day')
    qty  = request.form.get('quantity')
    mx   = request.form.get('max_days')
    dep  = request.form.get('safety_deposit')
    desc = request.form.get('description','')

    if not all([name, used, rpd, qty, mx, dep]):
        return jsonify({'success': False, 'message': 'All fields required'}), 400

    img_path = None
    if 'image' in request.files:
        f = request.files['image']
        if f and f.filename and allowed(f.filename):
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            fn = secure_filename(f.filename)
            f.save(os.path.join(UPLOAD_FOLDER, fn))
            img_path = f'/static/images/equipments/{fn}'
        elif f and f.filename:
            return jsonify({'success': False, 'message': 'Only JPG/PNG allowed'}), 400

    execute_query(
        """INSERT INTO equipments
           (producer_id,name,used_for,rent_per_day,quantity,max_days,safety_deposit,description,image)
           VALUES (?,?,?,?,?,?,?,?,?)""",
        (pid, name, used, rpd, qty, mx, dep, desc, img_path)
    )
    return jsonify({'success': True, 'message': 'Equipment added!'})

@producer_bp.route('/api/producer/equipments', methods=['GET'])
@require_producer
def get_equipments():
    rows = execute_query("SELECT * FROM equipments WHERE producer_id=?", (session['producer_id'],), fetch=True)
    return jsonify(rows)

@producer_bp.route('/api/producer/equipments/<int:eid>', methods=['PUT'])
@require_producer
def update_equipment(eid):
    d = request.json
    execute_query(
        """UPDATE equipments SET name=?,used_for=?,rent_per_day=?,quantity=?,
           max_days=?,safety_deposit=?,description=? WHERE id=? AND producer_id=?""",
        (d['name'],d['used_for'],d['rent_per_day'],d['quantity'],
         d['max_days'],d['safety_deposit'],d['description'], eid, session['producer_id'])
    )
    return jsonify({'success': True, 'message': 'Equipment updated!'})

@producer_bp.route('/api/producer/equipments/<int:eid>', methods=['DELETE'])
@require_producer
def delete_equipment(eid):
    execute_query("DELETE FROM equipments WHERE id=? AND producer_id=?", (eid, session['producer_id']))
    return jsonify({'success': True, 'message': 'Equipment deleted'})

# ── QC PERSONS ────────────────────────────────────────────────
@producer_bp.route('/api/producer/qc', methods=['POST'])
@require_producer
def add_qc():
    d = request.json
    name  = d.get('name','').strip()
    email = d.get('email','').strip()
    phone = d.get('phone','').strip()
    pw    = hp(d.get('password',''))
    if not all([name, email, phone]):
        return jsonify({'success': False, 'message': 'All fields required'}), 400
    if len(phone) != 10 or not phone.isdigit():
        return jsonify({'success': False, 'message': 'Phone must be 10 digits'}), 400
    try:
        execute_query(
            "INSERT INTO qc_persons (producer_id,name,email,password,phone) VALUES (?,?,?,?,?)",
            (session['producer_id'], name, email, pw, phone)
        )
        return jsonify({'success': True, 'message': 'QC Person added!'})
    except Exception:
        return jsonify({'success': False, 'message': 'Email already exists'}), 409

@producer_bp.route('/api/producer/qc', methods=['GET'])
@require_producer
def get_qc():
    rows = execute_query(
        "SELECT id,name,phone,email FROM qc_persons WHERE producer_id=?",
        (session['producer_id'],), fetch=True
    )
    return jsonify(rows)

@producer_bp.route('/api/producer/qc/<int:qid>', methods=['DELETE'])
@require_producer
def delete_qc(qid):
    execute_query("DELETE FROM qc_persons WHERE id=? AND producer_id=?", (qid, session['producer_id']))
    return jsonify({'success': True, 'message': 'QC person deleted'})

# ── ALERTS ────────────────────────────────────────────────────
@producer_bp.route('/api/producer/alerts/excess', methods=['GET'])
@require_producer
def excess_time():
    rows = execute_query(
        """SELECT r.id, r.from_date, r.to_date, r.max_days, r.selected_days,
                  u.name AS farmer_name, u.email AS farmer_email, e.name AS equipment_name
           FROM rentals r
           JOIN users u ON r.farmer_id=u.id
           JOIN equipments e ON r.equipment_id=e.id
           WHERE e.producer_id=? AND r.status='in_rent' AND DATE('now') > r.to_date""",
        (session['producer_id'],), fetch=True
    )
    return jsonify(rows)

@producer_bp.route('/api/producer/alerts/<int:rental_id>', methods=['POST'])
@require_producer
def send_alert(rental_id):
    rental = execute_query("SELECT * FROM rentals WHERE id=?", (rental_id,), fetch=True)
    if not rental:
        return jsonify({'success': False, 'message': 'Rental not found'}), 404
    r = rental[0]
    execute_query(
        "INSERT INTO alerts (rental_id,farmer_id,producer_id,message) VALUES (?,?,?,?)",
        (rental_id, r['farmer_id'], session['producer_id'],
         'Please return the equipment. You have exceeded the rental period.')
    )
    return jsonify({'success': True, 'message': 'Alert sent to farmer!'})
