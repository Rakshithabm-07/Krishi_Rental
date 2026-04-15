"""
db.py  –  SQLite backend (for local testing without MySQL)
Switch to mysql_connector version for production.
"""
import sqlite3, os, hashlib

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'krishi_test.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row          # rows behave like dicts
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def execute_query(query, params=None, fetch=False):
    # translate MySQL-style %s → SQLite-style ?
    query = query.replace('%s', '?')
    # translate MySQL SHA2 → plain comparison (passwords stored as sha256 hex)
    conn = get_connection()
    cur  = conn.cursor()
    try:
        cur.execute(query, params or ())
        if fetch:
            rows = cur.fetchall()
            return [dict(r) for r in rows]
        conn.commit()
        return cur.lastrowid
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def init_db():
    """Create all tables + seed default admin (idempotent)."""
    conn = get_connection()
    c    = conn.cursor()

    c.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        name          TEXT    NOT NULL,
        email         TEXT    UNIQUE NOT NULL,
        password      TEXT    NOT NULL,
        phone         TEXT,
        role          TEXT    NOT NULL CHECK(role IN ('admin','farmer')),
        aadhar_number TEXT,
        aadhar_image  TEXT,
        address       TEXT,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS producers (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT NOT NULL,
        email      TEXT UNIQUE NOT NULL,
        password   TEXT NOT NULL,
        phone      TEXT NOT NULL,
        address    TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS qc_persons (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        producer_id INTEGER NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
        name        TEXT NOT NULL,
        email       TEXT UNIQUE NOT NULL,
        password    TEXT NOT NULL,
        phone       TEXT NOT NULL,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS equipments (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        producer_id    INTEGER NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
        name           TEXT    NOT NULL,
        used_for       TEXT,
        rent_per_day   REAL    NOT NULL,
        quantity       INTEGER NOT NULL DEFAULT 1,
        max_days       INTEGER NOT NULL,
        safety_deposit REAL    NOT NULL,
        description    TEXT,
        image          TEXT,
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rentals (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        farmer_id      INTEGER NOT NULL REFERENCES users(id)       ON DELETE CASCADE,
        equipment_id   INTEGER NOT NULL REFERENCES equipments(id)  ON DELETE CASCADE,
        from_date      TEXT    NOT NULL,
        to_date        TEXT    NOT NULL,
        max_days       INTEGER NOT NULL,
        selected_days  INTEGER NOT NULL,
        safety_deposit REAL    NOT NULL,
        rent_total     REAL    NOT NULL,
        total_price    REAL    NOT NULL,
        payment_mode   TEXT    NOT NULL,
        status         TEXT    NOT NULL DEFAULT 'in_rent'
                                CHECK(status IN ('in_rent','in_qc','returned','rejected')),
        delay_fine     REAL    DEFAULT 0,
        damage_fine    REAL    DEFAULT 0,
        returning_amount REAL  DEFAULT 0,
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS alerts (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        rental_id   INTEGER NOT NULL REFERENCES rentals(id)   ON DELETE CASCADE,
        farmer_id   INTEGER NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
        producer_id INTEGER NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
        message     TEXT,
        is_seen     INTEGER DEFAULT 0,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Seed default admin (password = admin123)
    admin_pw = hashlib.sha256(b'admin123').hexdigest()
    c.execute("""
        INSERT OR IGNORE INTO users (name,email,password,role,phone)
        VALUES ('Admin','admin@krishi.com',?,'admin','9999999999')
    """, (admin_pw,))
    conn.commit()
    conn.close()
    print("[DB] SQLite database initialised ✓")
