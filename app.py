"""
app.py  –  Krishi Rental System (SQLite test build)
Run:  python app.py
Open: http://localhost:5000
"""
from flask import Flask, render_template
from backend.config.db import init_db
from backend.routes.auth     import auth_bp
from backend.routes.admin    import admin_bp
from backend.routes.producer import producer_bp
from backend.routes.farmer   import farmer_bp
from backend.routes.qc       import qc_bp

app = Flask(
    __name__,
    template_folder='frontend/templates',
    static_folder='frontend/static'
)
app.secret_key = 'krishi_dev_secret_2026'

app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(producer_bp)
app.register_blueprint(farmer_bp)
app.register_blueprint(qc_bp)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

if __name__ == '__main__':
    init_db()                        # create tables + seed admin
    app.run(debug=True, port=5000)
