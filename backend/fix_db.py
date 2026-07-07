import sqlite3

# Update this path if your .db file is named differently or in another folder
DB_PATH = r"C:\Users\Shruti S\labminix project\SmartERP\backend\smart_erp.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Add the missing 'date' column to the purchase table
try:
    cursor.execute("ALTER TABLE purchase ADD COLUMN date DATETIME")
    print("Added 'date' column to purchase table.")
except sqlite3.OperationalError as e:
    print("Purchase table:", e)

try:
    cursor.execute("ALTER TABLE sale ADD COLUMN date DATETIME")
    print("Added 'date' column to sale table.")
except sqlite3.OperationalError as e:
    print("Sale table:", e)

conn.commit()
conn.close()