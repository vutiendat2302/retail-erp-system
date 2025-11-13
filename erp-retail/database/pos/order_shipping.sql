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
  `create_by` bigint,
  `update_by` bigint,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Thông tin giao hàng của đơn hàng';