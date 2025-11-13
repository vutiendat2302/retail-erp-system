
export interface BaseEntity {
  id: string;
  name: string;
  description: string;
  status: string;
  updateBy: string;
  updateAt: string;
  createBy: string;
  createAt: string;
}

export interface BaseName {
  id: string;
  name: string;
}

export interface FormProps<T , V> {
  initialData?: T | null;
  onSubmit: (data: V) => void | Promise<void>;
  onClose: () => void;
}

export interface TableProp<T> {
  data: T[];
  loading: boolean;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  totalElements: number;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  goToPage: (newPage: number) => void;
}

export interface Warehouse extends BaseEntity{
  address: string;
}

export interface Inventory extends BaseEntity {
  productName: string;
  quantityAvailable: number;
  warehouseName: string;
  minimumQuantity: number;
  maximumQuantity: number;
  productBatchName: string;
  expiryDate: string;
  importDate: string;
  priceNormal: number;
}

export interface FormProps<T, V> {
  initialData?: T | null;
  onSubmit: (data: V) => void | Promise<void>;
  onClose: () => void;
  // Thêm các props khác nếu cần, ví dụ:
  categories?: CategoryName[];
  brands?: BrandName[];
}

// === PRODUCT TYPES ===

// 1. Dữ liệu sản phẩm NHẬN VỀ từ API (dùng để hiển thị)
// Khớp với ProductView hoặc ProductResponseDto từ Backend
export interface Product {
  id: string;
  sku: string;
  name: string;
  seoTitle: string;
  description: string;
  status: 'active' | 'inactive' | string; // Cho phép string để linh hoạt
  tag: string;
  image: string;
  listImage: string;
  priceNormal: number;
  priceSell: number;
  promotionPrice: number;
  vat: number;
  weight: number;
  warranty: string;
  hot: string; // ISO Date String
  viewCount: number;
  sellable: boolean;
  metaKeyword: string;
  createBy: string;
  createAt: string; // ISO Date String
  updateBy: string;
  updateAt: string; // ISO Date String
  // Dữ liệu từ bảng quan hệ
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
}

// 2. Dữ liệu GỬI ĐI để TẠO MỚI sản phẩm
export interface CreateProductRequest {
  sku: string;
  name: string;
  priceSell: number;
  categoryId: string;
  brandId: string;
  // Các trường tùy chọn khác
  seoTitle?: string;
  description?: string;
  status?: 'active' | 'inactive';
  tag?: string;
  image?: string;
  listImage?: string;
  priceNormal?: number;
  promotionPrice?: number;
  vat?: number;
  weight?: number;
  warranty?: string;
  hot?: string;
  sellable?: boolean;
  metaKeyword?: string;
}

// 3. Dữ liệu GỬI ĐI để CẬP NHẬT sản phẩm (Tất cả đều là tùy chọn)
export interface UpdateProductRequest {
  name?: string;
  seoTitle?: string;
  description?: string;
  status?: 'active' | 'inactive';
  tag?: string;
  image?: string;
  listImage?: string;
  priceNormal?: number;
  priceSell?: number;
  promotionPrice?: number;
  vat?: number;
  weight?: number;
  warranty?: string;
  hot?: string;
  sellable?: boolean;
  metaKeyword?: string;
  categoryId?: string;
  brandId?: string;
}

// 4. Dữ liệu mà FORM quản lý (trạng thái nội bộ của form)
export interface ProductFormData {
  sku: string;
  name: string;
  seoTitle: string;
  description: string;
  status: 'active' | 'inactive';
  tag: string;
  image: string;
  listImage: string;
  priceNormal: number | ''; // Cho phép rỗng khi người dùng xóa số
  priceSell: number | '';
  promotionPrice: number | '';
  vat: number | '';
  weight: number | '';
  warranty: string;
  metaKeyword: string;
  categoryId: string;
  brandId: string;
}

export interface ProductStaticData {
  totalElements: number;
  countProducActive: number;
  countCategoryActive: number;
  countBrandActive: number;
}

export type ProductBatch = BaseName;
export type CategoryName = BaseName;
export type BrandName = BaseName;
export type ManufacturingLocationName = BaseName;

export type ProductFormProps = FormProps<Product, ProductFormData>;

// Category
export interface Category extends BaseEntity {
  metaKeyword: string;
  seoTitle: string;
  smallImage: string;
  parentId: string;
}
export interface CategoryFormData {
  id: string;
  name: string;
  description: string;
  status: string;
  metaKeyword: string;
  seoTitle: string;
  updateBy: string;
}

export type CategoryFormProps = FormProps<Category, CategoryFormData>;

export type CategoryTableProp = TableProp<Category>;

// Brand
export interface Brand extends BaseEntity {
  country: string;
}

export interface BrandFormData extends Omit<BaseEntity, "createAt" | "updateAt"> {
  country: string;
}

export type BrandFormProps = FormProps<Brand, BrandFormData>;

// Supplier
export interface Supplier extends BaseEntity {
  email: string;
  address: string;
  phone: string;
}

export interface SupplierFormData extends Omit<BaseEntity, "createAt" | "updateAt"> {
  email: string;
  address: string;
  phone: string;
}

export type SupplierTableProp = TableProp<Supplier>
export type SupplierFormProp = FormProps<Supplier, SupplierFormData>;

export interface InventoryTable extends Omit<TableProp<Inventory>, "onDelete" | "onEdit"> {
}

export interface ImportLog {
	id: string;
	name: string;
	fromSupplierName: string;
	toWarehouseName: string;
	totalAmount: number;
	status: string;
	startTime: string;
	endTime: string;
	createBy: string;
	createAt: string;
}

export interface ImportLogFormData {
	id: string;
	fromSupplierName: string;
	toWarehouseName: string;
	totalAmount: number;
	status: string;
}

export type ImportLogTableProps = TableProp<ImportLog>;
export type ImportLogFormProps = FormProps<ImportLog, ImportLogFormData>;