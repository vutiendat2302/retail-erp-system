CREATE TABLE `orders` (
  `id` bigint NOT NULL,
  `customer_id` bigint DEFAULT NULL COMMENT 'ID của khách hàng (tham chiếu đến bảng customers). NULL nếu là khách vãng lai.',
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày khách hàng đặt hàng.',
  `total_amount` bigint DEFAULT NULL COMMENT 'Tổng giá trị các sản phẩm trong đơn hàng (trước thuế, ship, giảm giá).',
  `tax_amount` bigint DEFAULT '0' COMMENT 'Số tiền thuế.',
  `ship_amount` bigint DEFAULT '0' COMMENT 'Phí vận chuyển.',
  `promotion_discount` bigint DEFAULT '0' COMMENT 'Tổng số tiền được giảm giá từ các khuyến mãi.',
  `sum_amount` bigint GENERATED ALWAYS AS ((((`total_amount` + `tax_amount`) + `ship_amount`) - `promotion_discount`)) STORED COMMENT 'Tổng tiền cuối cùng khách hàng phải trả. Tự động tính toán.',
  `order_status_id` bigint DEFAULT NULL COMMENT 'Trạng thái hiện tại của đơn hàng (tham chiếu đến bảng order_status).',
  `note` text COMMENT 'Ghi chú của khách hàng cho đơn hàng.',
  `customer_name` varchar(50) DEFAULT NULL COMMENT 'Tên khách hàng tại thời điểm đặt hàng, để tra cứu nhanh.',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `order_status_id` (`order_status_id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`order_status_id`) REFERENCES `order_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Bảng chính lưu thông tin các đơn hàng';


-- File: tables/order_shipping.sql
-- Mô tả: Lưu thông tin giao hàng cho một đơn hàng. Quan hệ 1-1 với bảng orders.

DROP TABLE IF EXISTS `order_shipping`;

CREATE TABLE `order_shipping` (
  `id` bigint NOT NULL,
  `order_id` bigint DEFAULT NULL COMMENT 'ID của đơn hàng cần giao.',
  `shipping_method_id` bigint DEFAULT NULL COMMENT 'Phương thức vận chuyển được chọn.',
  `address` text NOT NULL COMMENT 'Địa chỉ nhận hàng.',
  `name_customer` varchar(50) DEFAULT NULL COMMENT 'Tên người nhận.',
  `phone_customer` varchar(11) DEFAULT NULL COMMENT 'Số điện thoại người nhận.',
  `code_number` varchar(40) DEFAULT NULL COMMENT 'Mã vận đơn từ đơn vị vận chuyển.',
  `ship_fee` bigint DEFAULT NULL COMMENT 'Phí vận chuyển thực tế cho đơn hàng này.',
  `shipped_date` datetime DEFAULT NULL COMMENT 'Ngày bắt đầu giao hàng.',
  `delivered_date` datetime DEFAULT NULL COMMENT 'Ngày giao hàng thành công.',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`) COMMENT 'Mỗi đơn hàng chỉ có 1 thông tin giao hàng.',
  KEY `shipping_method_id` (`shipping_method_id`),
  CONSTRAINT `order_shipping_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_shipping_ibfk_2` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_method` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Thông tin giao hàng của đơn hàng';


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
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Chi tiết các sản phẩm trong đơn hàng';

-- File: tables/promotion.sql
-- Mô tả: Bảng định nghĩa các chương trình, mã khuyến mãi.

DROP TABLE IF EXISTS `promotion`;

CREATE TABLE `promotion` (
  `id` bigint NOT NULL,
  `code_promotion` varchar(20) NOT NULL COMMENT 'Mã khuyến mãi khách hàng sẽ nhập.',
  `name_promotion` varchar(50) NOT NULL COMMENT 'Tên chương trình khuyến mãi.',
  `description_promotion` text,
  `discount_type` enum('percent','fixed','gift') NOT NULL COMMENT 'Loại giảm giá: phần trăm, số tiền cố định, quà tặng...',
  `percent_discount_value` decimal(12,2) DEFAULT NULL COMMENT 'Giá trị giảm giá (nếu loại là percent).',
  `max_discount_value` bigint DEFAULT NULL COMMENT 'Số tiền giảm giá tối đa (cho loại percent).',
  `min_order_amount` bigint DEFAULT NULL COMMENT 'Giá trị đơn hàng tối thiểu để áp dụng.',
  `start_date` datetime NOT NULL COMMENT 'Ngày bắt đầu.',
  `end_date` datetime NOT NULL COMMENT 'Ngày kết thúc.',
  `max_uses` bigint DEFAULT NULL COMMENT 'Tổng số lần có thể sử dụng.',
  `current_uses` bigint DEFAULT '0' COMMENT 'Số lần đã được sử dụng.',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_promotion` (`code_promotion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Các chương trình khuyến mãi';


-- File: tables/shipping_method.sql
-- Mô tả: Bảng danh mục, định nghĩa các phương thức vận chuyển (Giao hàng nhanh, Hỏa tốc...).

DROP TABLE IF EXISTS `shipping_method`;

CREATE TABLE `shipping_method` (
  `id` bigint NOT NULL,
  `name` varchar(50) NOT NULL COMMENT 'Tên phương thức vận chuyển.',
  `description_shipping` varchar(255) DEFAULT NULL COMMENT 'Mô tả chi tiết.',
  `base_fee` bigint DEFAULT '0' COMMENT 'Phí vận chuyển cơ bản.',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Trạng thái hoạt động.',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Các phương thức vận chuyển';

