import mysql.connector
import random
from faker import Faker
from snowflake import SnowflakeGenerator, Snowflake
from datetime import datetime

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "123456",
    "database": "optima-project-retail-manager"
}
connect_mysql = mysql.connector.connect(**db_config)
cursor = connect_mysql.cursor()

fake = Faker('vi_VN')
sf = Snowflake.parse(856165981072306201, 1288834974657)
gen = SnowflakeGenerator.from_snowflake(sf)

user_id = [
    1450492617670998016
]

def get_id(table, cursor):
    sql = f"select id from {table}"
    cursor.execute(sql)
    rows = cursor.fetchall()
    return [row[0] for row in rows]

pro_id = get_id("product", cursor)
sto_id = 1971069766866481152;
batch_id = 1

for product_id in pro_id:
    id = next(gen)
    quantity = random.randint(100, 500)
    status = 1
    create_by = random.choice(user_id)
    update_by = random.choice(user_id)
    create_at = fake.date_time_between(start_date="-2y", end_date="now").strftime("%Y-%m-%d %H:%M:%S")
    update_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sales = 0
    max_quantity = 12000
    min_quantity = 50

    sql = """
    INSERT INTO store_product
    (id, store_id, product_id, quantity, create_by, create_at, update_by, update_at, batch_id, status, max_quantity, min_quantity, sales)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    cursor.execute(sql, (id, sto_id, product_id, quantity, create_by, create_at, update_by, update_at, batch_id, status, max_quantity, min_quantity, sales))
    print(f"Đang insert product_id={product_id}, quantity={quantity}")


connect_mysql.commit()
connect_mysql.commit()
print("✅ Commit done:", connect_mysql.is_connected())

cursor.close()
connect_mysql.close()

print("Da insert data vào table store_product")
