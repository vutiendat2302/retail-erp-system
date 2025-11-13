import api from "./api";
import type { CreateProductRequest, UpdateProductRequest } from '../../types/InventoryServiceType';

// Type cho các tham số tìm kiếm
type SearchParams = {
  search?: string | null;
  categoryId?: string | null;
  brandId?: string | null;
  status?: string | null;
  page?: number;
  size?: number;
  sort?: string;
}

// 1. HÀM TÌM KIẾM CHÍNH (thay thế tất cả các hàm get list/page/search cũ)
export const searchProducts = (params: SearchParams = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v != null && v !== '' && v !== 'all')
  );
  return api.get('/api/products', { params: cleanParams });
};

// 2. Lấy chi tiết một sản phẩm
export const getProductById = (id: string) => api.get(`/api/products/${id}`);

// 3. Tạo mới sản phẩm
export const createProduct = (data: CreateProductRequest) => api.post('/api/products', data);

// 4. Cập nhật sản phẩm
export const updateProduct = (id: string, data: UpdateProductRequest) => api.put(`/api/products/${id}`, data);

// 5. Xóa sản phẩm
export const deleteProduct = (id: string) => api.delete(`/api/products/${id}`);

// 6. Đếm số sản phẩm active
export const getCountProductActive = () => api.get(`/api/products/count/active`);

// Các hàm khác (giả sử endpoint không đổi)
export const getCategoryName = () => api.get(`/api/category/name`);
export const getBrandName = () => api.get(`/api/brand/name`);
export const getCountBrandActive = () => api.get(`/api/brand/getCountBrandActive`);
export const getCountCategoryActive = () => api.get(`/api/category/getCountCategoryActive`);
