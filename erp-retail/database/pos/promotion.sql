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
    `create_by` bigint,
  `update_by` bigint,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Các chương trình khuyến mãi';

