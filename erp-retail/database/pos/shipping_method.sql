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
    `create_by` bigint,
  `update_by` bigint,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Các phương thức vận chuyển';

