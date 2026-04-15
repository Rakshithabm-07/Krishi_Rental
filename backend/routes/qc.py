from flask import Blueprint, request, jsonify, session
from datetime import date, datetime
from backend.config.db import execute_query

qc_bp = Blueprint('qc', __name__)

def require_qc(f):
    from functools import wraps
    @wraps(f)
    def dec(*a, **kw):
        if session.get('role') != 'qc':
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403
        return f(*a, **kw)
    return dec

@qc_bp.route('/api/qc/rentals', methods=['GET'])
@require_qc
def qc_rentals():
    rows = execute_query(
        """SELECT r.*, e.name AS equipment_name, u.name AS farmer_name
           FROM rentals r
           JOIN equipments e ON r.equipment_id=e.id
           JOIN users u ON r.farmer_id=u.id
           WHERE e.producer_id=? AND r.status='in_qc'
           ORDER BY r.created_at DESC""",
        (session['producer_id'],), fetch=True
    )
    return jsonify(rows)

@qc_bp.route('/api/qc/rentals/<int:rid>/accept', methods=['POST'])
@require_qc
def accept_return(rid):
    data   = request.json
    dmg    = float(data.get('damage_fine', 0))
    rental = execute_query("SELECT * FROM rentals WHERE id=?", (rid,), fetch=True)
    if not rental:
        return jsonify({'success': False, 'message': 'Rental not found'}), 404
    r = rental[0]

    today   = date.today()
    to_date = r['to_date']
    if isinstance(to_date, str):
        to_date = datetime.strptime(to_date, '%Y-%m-%d').date()

    delay_days = max(0, (today - to_date).days)
    delay_fine = delay_days * 200
    ret_amount = max(0, float(r['safety_deposit']) - (delay_fine + dmg))

    execute_query(
        """UPDATE rentals SET status='returned', delay_fine=?, damage_fine=?, returning_amount=?
           WHERE id=?""",
        (delay_fine, dmg, ret_amount, rid)
    )
    execute_query("UPDATE equipments SET quantity=quantity+1 WHERE id=?", (r['equipment_id'],))
    return jsonify({
        'success': True, 'message': 'Return accepted! Equipment back in stock.',
        'delay_fine': delay_fine, 'damage_fine': dmg, 'returning_amount': ret_amount
    })

@qc_bp.route('/api/qc/rentals/<int:rid>/reject', methods=['POST'])
@require_qc
def reject_return(rid):
    data   = request.json
    dmg    = float(data.get('damage_fine', 0))
    rental = execute_query("SELECT * FROM rentals WHERE id=?", (rid,), fetch=True)
    if not rental:
        return jsonify({'success': False, 'message': 'Rental not found'}), 404
    r = rental[0]

    today   = date.today()
    to_date = r['to_date']
    if isinstance(to_date, str):
        to_date = datetime.strptime(to_date, '%Y-%m-%d').date()

    delay_days = max(0, (today - to_date).days)
    delay_fine = delay_days * 200

    execute_query(
        "UPDATE rentals SET status='rejected', delay_fine=?, damage_fine=? WHERE id=?",
        (delay_fine, dmg, rid)
    )
    # quantity NOT restored on rejection
    return jsonify({'success': True, 'message': 'Return rejected. Equipment marked as damaged.'})
