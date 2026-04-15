from flask import Blueprint, request, jsonify, session
import hashlib
from backend.config.db import execute_query

admin_bp = Blueprint('admin', __name__)

def require_admin(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if session.get('role') != 'admin':
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403
        return f(*args, **kwargs)
    return decorated

def hp(p): return hashlib.sha256(p.encode()).hexdigest()

@admin_bp.route('/api/admin/producers', methods=['POST'])
@require_admin
def add_producer():
    d = request.json
    name, email, phone, address = d.get('name','').strip(), d.get('email','').strip(), d.get('phone','').strip(), d.get('address','').strip()
    password = hp(d.get('password',''))
    if not all([name, email, phone, address]):
        return jsonify({'success': False, 'message': 'All fields required'}), 400
    if len(phone) != 10 or not phone.isdigit():
        return jsonify({'success': False, 'message': 'Phone must be 10 digits'}), 400
    try:
        execute_query(
            "INSERT INTO producers (name,email,password,phone,address) VALUES (?,?,?,?,?)",
            (name, email, password, phone, address)
        )
        return jsonify({'success': True, 'message': 'Producer added successfully!'})
    except Exception:
        return jsonify({'success': False, 'message': 'Email already exists'}), 409

@admin_bp.route('/api/admin/producers', methods=['GET'])
@require_admin
def get_producers():
    rows = execute_query("SELECT id,name,phone,email,address,created_at FROM producers", fetch=True)
    return jsonify(rows)

@admin_bp.route('/api/admin/producers/<int:pid>', methods=['DELETE'])
@require_admin
def delete_producer(pid):
    execute_query("DELETE FROM producers WHERE id=?", (pid,))
    return jsonify({'success': True, 'message': 'Producer deleted'})

@admin_bp.route('/api/admin/farmers', methods=['GET'])
@require_admin
def get_farmers():
    rows = execute_query(
        "SELECT id,name,phone,aadhar_number,email FROM users WHERE role='farmer'", fetch=True
    )
    return jsonify(rows)
