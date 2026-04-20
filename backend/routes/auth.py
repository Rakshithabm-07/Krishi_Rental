from flask import Blueprint, request, jsonify, session
import hashlib
from backend.config.db import execute_query
from backend.utils.aadhaar_validator import validate_aadhaar_number, validate_aadhaar_image

auth_bp = Blueprint('auth', __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ── LOGIN ──────────────────────────────────────────────────────
@auth_bp.route('/api/login', methods=['POST'])
def login():
    data     = request.json
    role     = data.get('role')
    email    = data.get('email', '').strip()
    password = hash_password(data.get('password', ''))

    if role in ('admin', 'farmer'):
        rows = execute_query(
            "SELECT * FROM users WHERE email=? AND password=? AND role=?",
            (email, password, role), fetch=True
        )
    elif role == 'producer':
        rows = execute_query(
            "SELECT * FROM producers WHERE email=? AND password=?",
            (email, password), fetch=True
        )
    elif role == 'qc':
        rows = execute_query(
            "SELECT * FROM qc_persons WHERE email=? AND password=?",
            (email, password), fetch=True
        )
    else:
        return jsonify({'success': False, 'message': 'Invalid role'}), 400

    if rows:
        user = rows[0]
        session['user_id']   = user['id']
        session['role']      = role
        session['name']      = user['name']
        if role == 'qc':
            session['producer_id'] = user['producer_id']
        if role == 'producer':
            session['producer_id'] = user['id']
        return jsonify({'success': True, 'role': role, 'name': user['name']})

    return jsonify({'success': False, 'message': 'Invalid email or password'}), 401


# ── FARMER SIGNUP ──────────────────────────────────────────────
@auth_bp.route('/api/signup/farmer', methods=['POST'])
def signup_farmer():
    data     = request.form
    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip()
    password = hash_password(data.get('password', ''))
    phone    = data.get('phone', '').strip()
    aadhar   = data.get('aadhar_number', '').strip()

    # ── Basic field checks ────────────────────────────────────
    if not all([name, email, phone, aadhar]):
        return jsonify({'success': False, 'message': 'All fields are required'}), 400

    if len(phone) != 10 or not phone.isdigit():
        return jsonify({'success': False, 'message': 'Phone must be 10 digits'}), 400

    # ── Aadhaar NUMBER validation ─────────────────────────────
    num_valid, num_err = validate_aadhaar_number(aadhar)
    if not num_valid:
        return jsonify({'success': False, 'message': f'Invalid Aadhaar number: {num_err}'}), 400

    # ── Aadhaar IMAGE validation ──────────────────────────────
    if 'aadhar_image' not in request.files or request.files['aadhar_image'].filename == '':
        return jsonify({'success': False, 'message': 'Aadhaar card image is required'}), 400

    img_file = request.files['aadhar_image']
    img_valid, img_err = validate_aadhaar_image(img_file)
    if not img_valid:
        return jsonify({'success': False, 'message': img_err}), 400

    # ── Save image ────────────────────────────────────────────
    import os
    from werkzeug.utils import secure_filename
    upload_dir = os.path.join('frontend', 'static', 'images', 'aadhaar')
    os.makedirs(upload_dir, exist_ok=True)
    filename   = secure_filename(f"{phone}_{img_file.filename}")
    img_file.stream.seek(0)
    img_file.save(os.path.join(upload_dir, filename))
    img_path   = f'/static/images/aadhaar/{filename}'

    # ── Insert farmer ─────────────────────────────────────────
    try:
        execute_query(
            """INSERT INTO users (name,email,password,phone,aadhar_number,aadhar_image,role)
               VALUES (?,?,?,?,?,?,'farmer')""",
            (name, email, password, phone, aadhar, img_path)
        )
        return jsonify({'success': True, 'message': 'Farmer registered successfully!'})
    except Exception:
        return jsonify({'success': False, 'message': 'Email already registered'}), 409


# ── LOGOUT ─────────────────────────────────────────────────────
@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})


# ── SESSION CHECK ───────────────────────────────────────────────
@auth_bp.route('/api/session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'role': session['role'], 'name': session['name']})
    return jsonify({'logged_in': False})
