# list_tables.py
import sqlite3

conn = sqlite3.connect("instance/local.db")
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("Tabele u bazi:")
for table in tables:
    print("-", table[0])



table_name = input("Unesi ime tabele: ")

conn = sqlite3.connect("instance/local.db")
cursor = conn.cursor()

cursor.execute(f"PRAGMA table_info({table_name});")
columns = cursor.fetchall()

print(f"Kolone u tabeli '{table_name}':")
for col in columns:
    print(f"- {col[1]} ({col[2]})")  # col[1] = naziv kolone, col[2] = tip



table_name = input("Unesi ime tabele: ")

conn = sqlite3.connect("instance/local.db")
cursor = conn.cursor()

cursor.execute(f"SELECT * FROM {table_name}")
rows = cursor.fetchall()

# Uzimamo imena kolona
column_names = [description[0] for description in cursor.description]

print(" | ".join(column_names))
print("-" * 40)

for row in rows:
    print(" | ".join(str(cell) for cell in row))

conn.close()



