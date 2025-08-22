-- Membuat database jika belum ada
CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS product_db;
CREATE DATABASE IF NOT EXISTS order_db;
CREATE DATABASE IF NOT EXISTS category_db;


-- Memberikan semua izin kepada user 'user' untuk setiap database.
-- Karakter '%' berarti user bisa terhubung dari IP mana saja (dalam network Docker).
GRANT ALL PRIVILEGES ON user_db.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON product_db.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON order_db.* TO 'user'@'%';
GRANT ALL PRIVILEGES ON category_db.* TO 'user'@'%';

-- Menerapkan semua perubahan izin
FLUSH PRIVILEGES;