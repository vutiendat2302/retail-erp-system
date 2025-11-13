CREATE TABLE `order` (
  `id` bigint NOT NULL,
  `customer_id` bigint DEFAULT NULL COMMENT 'ID của khách hàng (tham chiếu đến bảng customers). NULL nếu là khách vãng lai.',
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày khách hàng đặt hàng.',
  `total_amount` bigint DEFAULT NULL COMMENT 'Tổng giá trị các sản phẩm trong đơn hàng (trước thuế, ship, giảm giá).',
  `tax_amount` bigint DEFAULT '0' COMMENT 'Số tiền thuế.',
  `ship_amount` bigint DEFAULT '0' COMMENT 'Phí vận chuyển.',
  `promotion_discount` bigint DEFAULT '0' COMMENT 'Tổng số tiền được giảm giá từ các khuyến mãi.',
  `sum_amount` bigint GENERATED ALWAYS AS ((((`total_amount` + `tax_amount`) + `ship_amount`) - `promotion_discount`)) STORED COMMENT 'Tổng tiền cuối cùng khách hàng phải trả. Tự động tính toán.',
  `status` bigint DEFAULT NULL COMMENT 'Trạng thái hiện tại của đơn hàng (tham chiếu đến bảng order_status).',
  `note` text COMMENT 'Ghi chú của khách hàng cho đơn hàng.',
  `customer_name` varchar(50) DEFAULT NULL COMMENT 'Tên khách hàng tại thời điểm đặt hàng, để tra cứu nhanh.',
  `phone` varchar(50),
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `create_by` bigint,
  `update_by` bigint,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Bảng chính lưu thông tin các đơn hàng';
