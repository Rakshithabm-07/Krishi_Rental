from flask import Blueprint, request, jsonify, session
import hashlib
from backend.config.db import execute_query

auth_bp = Blueprint('auth', __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

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
        if role in ('qc',):
            session['producer_id'] = user['producer_id']
        if role == 'producer':
            session['producer_id'] = user['id']
        return jsonify({'success': True, 'role': role, 'name': user['name']})

    return jsonify({'success': False, 'message': 'Invalid email or password'}), 401


@auth_bp.route('/api/signup/farmer', methods=['POST'])
def signup_farmer():
    data     = request.form
    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip()
    password = hash_password(data.get('password', ''))
    phone    = data.get('phone', '').strip()
    aadhar   = data.get('aadhar_number', '').strip()

    if not all([name, email, phone, aadhar]):
        return jsonify({'success': False, 'message': 'All fields are required'}), 400
    if len(phone) != 10 or not phone.isdigit():
        return jsonify({'success': False, 'message': 'Phone must be 10 digits'}), 400

    try:
        execute_query(
            "INSERT INTO users (name,email,password,phone,aadhar_number,role) VALUES (?,?,?,?,?,'farmer')",
            (name, email, password, phone, aadhar)
        )
        return jsonify({'success': True, 'message': 'Farmer registered successfully!'})
    except Exception:
        return jsonify({'success': False, 'message': 'Email already exists'}), 409



@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})


@auth_bp.route('/api/session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'role': session['role'], 'name': session['name']})
    return jsonify({'logged_in': False})
