from flask import Blueprint, request, jsonify, session
from datetime import date
from backend.config.db import execute_query

farmer_bp = Blueprint('farmer', __name__)

def require_farmer(f):
    from functools import wraps
    @wraps(f)
    def dec(*a, **kw):
        if session.get('role') != 'farmer':
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403
        return f(*a, **kw)
    return dec

@farmer_bp.route('/api/farmer/equipments', methods=['GET'])
@require_farmer
def all_equipments():
    rows = execute_query(
        """SELECT e.*, p.name AS producer_name
           FROM equipments e JOIN producers p ON e.producer_id=p.id
           WHERE e.quantity > 0""",
        fetch=True
    )
    return jsonify(rows)

@farmer_bp.route('/api/farmer/rent', methods=['POST'])
@require_farmer
def rent_equipment():
    d            = request.json
    farmer_id    = session['user_id']
    equipment_id = d.get('equipment_id')
    to_date      = d.get('to_date')
    sel_days     = int(d.get('selected_days', 0))
    pay_mode     = d.get('payment_mode', 'upi')

    eq = execute_query("SELECT * FROM equipments WHERE id=?", (equipment_id,), fetch=True)
    if not eq:
        return jsonify({'success': False, 'message': 'Equipment not found'}), 404
    eq = eq[0]

    if sel_days > eq['max_days']:
        return jsonify({'success': False, 'message': 'Cannot exceed maximum rental days!'}), 400
    if eq['quantity'] < 1:
        return jsonify({'success': False, 'message': 'Equipment not available'}), 400

    from_date      = date.today().isoformat()
    rent_total     = float(eq['rent_per_day']) * sel_days
    safety_deposit = float(eq['safety_deposit'])
    total_price    = rent_total + safety_deposit

    execute_query(
        """INSERT INTO rentals
           (farmer_id,equipment_id,from_date,to_date,max_days,selected_days,
            safety_deposit,rent_total,total_price,payment_mode)
           VALUES (?,?,?,?,?,?,?,?,?,?)""",
        (farmer_id, equipment_id, from_date, to_date, eq['max_days'],
         sel_days, safety_deposit, rent_total, total_price, pay_mode)
    )
    execute_query("UPDATE equipments SET quantity=quantity-1 WHERE id=?", (equipment_id,))
    return jsonify({'success': True, 'message': 'Rental confirmed! Payment received.'})

@farmer_bp.route('/api/farmer/rentals', methods=['GET'])
@require_farmer
def my_rentals():
    rows = execute_query(
        """SELECT r.*, e.name AS equipment_name, e.image
           FROM rentals r JOIN equipments e ON r.equipment_id=e.id
           WHERE r.farmer_id=? ORDER BY r.created_at DESC""",
        (session['user_id'],), fetch=True
    )
    return jsonify(rows)

@farmer_bp.route('/api/farmer/rentals/<int:rid>/return', methods=['POST'])
@require_farmer
def return_rental(rid):
    rental = execute_query(
        "SELECT * FROM rentals WHERE id=? AND farmer_id=?",
        (rid, session['user_id']), fetch=True
    )
    if not rental:
        return jsonify({'success': False, 'message': 'Rental not found'}), 404
    if rental[0]['status'] != 'in_rent':
        return jsonify({'success': False, 'message': 'Cannot return at this stage'}), 400
    execute_query("UPDATE rentals SET status='in_qc' WHERE id=?", (rid,))
    return jsonify({'success': True, 'message': 'Return request submitted. Awaiting QC.'})

@farmer_bp.route('/api/farmer/alerts', methods=['GET'])
@require_farmer
def farmer_alerts():
    rows = execute_query(
        "SELECT * FROM alerts WHERE farmer_id=? AND is_seen=0",
        (session['user_id'],), fetch=True
    )
    execute_query("UPDATE alerts SET is_seen=1 WHERE farmer_id=?", (session['user_id'],))
    return jsonify(rows)
