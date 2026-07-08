import sqlite3

DB_PATH = "smart_erp.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

for table in ["purchase", "sale"]:
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN payment_status VARCHAR(20) DEFAULT 'Unpaid'")
        print(f"Added payment_status to {table}.")
    except sqlite3.OperationalError as e:
        print(f"{table} payment_status:", e)

    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN payment_method VARCHAR(30)")
        print(f"Added payment_method to {table}.")
    except sqlite3.OperationalError as e:
        print(f"{table} payment_method:", e)

conn.commit()
conn.close()