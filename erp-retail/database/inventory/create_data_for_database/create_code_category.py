import mysql.connector

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "123456",
    "database": "optima-project-retail-manager"
}

connect_mysql = mysql.connector.connect(**db_config)
cursor = connect_mysql.cursor()

def create_category_code(cursor):
    # Lấy id, parent_id, level
    cursor.execute("SELECT id, parent_id, level FROM category ORDER BY level ASC")
    rows = cursor.fetchall()
    
    categories = {row[0]: {"parent_id": row[1], "level": row[2]} for row in rows}
    codes = {}
    counter = {}

    # Duyệt theo thứ tự tăng dần của level
    for cat_id, info in categories.items():
        parent_id = info["parent_id"]
        level = info["level"]

        if level == 1 or parent_id is None:
            counter.setdefault(1, 0)
            counter[1] += 1
            code = f"{counter[1]:03d}"
        else:
            parent_code = codes.get(parent_id)
            if not parent_code:
                print(f"⚠️ Cảnh báo: Chưa có code cho parent_id = {parent_id}")
                continue
            counter.setdefault(parent_id, 0)
            counter[parent_id] += 1
            code = f"{parent_code}{counter[parent_id]:03d}"

        codes[cat_id] = code

    # Update vào DB
    for cat_id, code in codes.items():
        cursor.execute("UPDATE category SET code = %s WHERE id = %s", (code, cat_id))

    connect_mysql.commit()
    print("✅ Đã cập nhật code cho bảng category thành công!")

create_category_code(cursor)
cursor.close()
connect_mysql.close()

