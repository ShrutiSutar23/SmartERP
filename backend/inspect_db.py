import sqlite3
import os

p = r'c:/Users/Shruti S/labminix project/SmartERP/backend/smart_erp.db'
print('exists', os.path.exists(p))
conn = sqlite3.connect(p)
cur = conn.cursor()
print('tables', cur.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall())
for table in ['company', 'customer', 'supplier', 'item']:
    try:
        cur.execute(f'PRAGMA table_info({table})')
        print(table, 'schema', cur.fetchall())
    except Exception as e:
        print(table, 'schema error', e)
    try:
        cur.execute(f'SELECT * FROM {table}')
        print(table, 'rows', cur.fetchall())
    except Exception as e:
        print(table, 'rows error', e)
conn.close()
