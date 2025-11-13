-- File: tables/order_detail.sql
-- Mô tả: Bảng này chứa chi tiết các sản phẩm trong một đơn hàng. Mỗi dòng là một sản phẩm.

DROP TABLE IF EXISTS `order_detail`;

CREATE TABLE `order_detail` (
  `id` bigint NOT NULL,
  `order_id` bigint DEFAULT NULL COMMENT 'ID của đơn hàng mà sản phẩm này thuộc về.',
  `product_id` bigint DEFAULT NULL COMMENT 'ID của sản phẩm (tham chiếu đến bảng products).',
  `product_name` varchar(50) DEFAULT NULL COMMENT 'Tên sản phẩm tại thời điểm mua, tránh bị ảnh hưởng nếu tên gốc thay đổi.',
  `quantity` bigint NOT NULL COMMENT 'Số lượng sản phẩm được mua.',
  `price` bigint NOT NULL COMMENT 'Đơn giá của sản phẩm tại thời điểm mua.',
  `discount` bigint NOT NULL DEFAULT '0' COMMENT 'Số tiền giảm giá trên mỗi sản phẩm.',
  `subtotal` bigint GENERATED ALWAYS AS ((`quantity` * (`price` - `discount`))) STORED COMMENT 'Thành tiền của dòng này. Tự động tính toán.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Chi tiết các sản phẩm trong đơn hàng';