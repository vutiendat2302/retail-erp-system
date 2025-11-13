import React, { useState, useEffect, useCallback } from 'react';

// Components
import ProductForm from '../../components/inventory/products/ProductForm';
import ProductStatic from '../../components/inventory/products/ProductStatic';
import { ProductSearch } from '../../components/inventory/products/ProductSearch';
import { ProductTableComponent } from '../../components/inventory/products/ProductTableComponent';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';

// API Service
import {
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCountProductActive,
  getCountBrandActive,
  getCountCategoryActive,
  getCategoryName,
  getBrandName,
} from '../../services/inventery-api/ProductService';

// Types
import type { Product as ProductType, ProductFormData, CategoryName, BrandName, CreateProductRequest, UpdateProductRequest } from '../../types/InventoryServiceType';

const Product: React.FC = () => {
  // === STATE MANAGEMENT ===
  const [products, setProducts] = useState<ProductType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);

  const [stats, setStats] = useState({ countProductActive: 0, countBrandActive: 0, countCategoryActive: 0 });
  const [options, setOptions] = useState<{ categories: CategoryName[], brands: BrandName[] }>({ categories: [], brands: [] });

const [filters, setFilters] = useState({ search: '', categoryId: '', brandId: '', status: '' });

// THÊM 2 DÒNG NÀY VÀO ĐỂ QUẢN LÝ POPOVER
const [openFindCategory, setOpenFindCategory] = useState<boolean>(false);
const [openFindBrand, setOpenFindBrand] = useState<boolean>(false);
  // === DATA FETCHING LOGIC ===
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size, sort: 'createAt,desc', ...filters };
      const res = await searchProducts(params);
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      // TODO: Hiển thị thông báo lỗi cho người dùng
    } finally {
      setLoading(false);
    }
  }, [page, size, filters]);

  const fetchInitialData = useCallback(async () => {
    try {
      const [activeCountRes, brandCountRes, categoryCountRes, categoriesRes, brandsRes] = await Promise.all([
        getCountProductActive(), getCountBrandActive(), getCountCategoryActive(), getCategoryName(), getBrandName()
      ]);
      setStats({
        countProductActive: activeCountRes.data.active_count,
        countBrandActive: brandCountRes.data,
        countCategoryActive: categoryCountRes.data,
      });
      setOptions({ categories: categoriesRes.data, brands: brandsRes.data });
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // === EVENT HANDLERS ===
  const handleSearch = (search: string | null, categoryId: string | null, brandId: string | null, status: string | null) => {
    setPage(0);
    setFilters({ search: search ?? '', categoryId: categoryId ?? '', brandId: brandId ?? '', status: status ?? '' });
  };

  const handleCreate = () => {
    setCurrentProduct(null);
    setFormOpen(true);
  };

  const handleUpdate = (product: ProductType) => {
    setCurrentProduct(product);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await deleteProduct(id);
      // Tải lại dữ liệu sau khi xóa thành công
      if (products.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleFormSubmit = async (formData: ProductFormData) => {
    try {
      if (currentProduct && currentProduct.id) {
        // Logic CẬP NHẬT
        const payload: UpdateProductRequest = {
            // Chỉ gửi những trường có thể thay đổi
            name: formData.name,
            seoTitle: formData.seoTitle,
            description: formData.description,
            status: formData.status,
            tag: formData.tag,
            priceNormal: Number(formData.priceNormal) || 0,
            priceSell: Number(formData.priceSell) || 0,
            promotionPrice: Number(formData.promotionPrice) || 0,
            categoryId: formData.categoryId,
            brandId: formData.brandId,
        };
        await updateProduct(currentProduct.id, payload);
      } else {
        // Logic TẠO MỚI
        const payload: CreateProductRequest = {
            sku: formData.sku,
            name: formData.name,
            priceSell: Number(formData.priceSell) || 0,
            categoryId: formData.categoryId,
            brandId: formData.brandId,
            // các trường tùy chọn khác
            description: formData.description,
            status: formData.status,
            priceNormal: Number(formData.priceNormal) || 0,
        };
        await createProduct(payload);
      }
      fetchProducts(); // Tải lại dữ liệu
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setFormOpen(false);
    }
  };

  return (
    <div className='px-6'>
      <div className='md:px-10 -mt-10 '>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='mb-2 title'>Quản lý sản phẩm</h3>
            <p className="content font-size-md opacity-80">Theo dõi và quản lý sản phẩm của bạn</p>
          </div>
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} className="!rounded-lg bg-gray-950 text-white hover:bg-gray-700">
                <Plus className="w-4 h-4 mr-2" /> Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{currentProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
                <DialogDescription>{currentProduct ? 'Cập nhật thông tin sản phẩm' : 'Nhập thông tin sản phẩm mới'}</DialogDescription>
              </DialogHeader>
              <ProductForm
                initialData={currentProduct}
                onSubmit={handleFormSubmit}
                onClose={() => setFormOpen(false)}
                categories={options.categories}
                brands={options.brands}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <ProductStatic
          totalElements={totalElements}
          countProducActive={stats.countProductActive}
          countCategoryActive={stats.countCategoryActive}
          countBrandActive={stats.countBrandActive}
        />

        {/* Search */}
        <ProductSearch
          onSearch={handleSearch}
          categories={options.categories}
          brands={options.brands}
          // TRUYỀN CÁC PROPS CÒN THIẾU VÀO ĐÂY
          openFindCategory={openFindCategory}
          setOpenFindCategory={setOpenFindCategory}
          openFindBrand={openFindBrand}
          setOpenFindBrand={setOpenFindBrand}
        />

        {/* Table */}
        <ProductTableComponent
          data={products}
          loading={loading}
          onEdit={handleUpdate}
          onDelete={handleDelete}
          totalElements={totalElements}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          goToPage={setPage}
        />
      </div>
    </div>
  );
};

export default Product;