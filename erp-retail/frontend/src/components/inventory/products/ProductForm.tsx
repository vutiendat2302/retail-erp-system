import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

// Import các UI component từ thư viện của ông
import { Label } from '../../ui/label';
import { Input } from '../../ui/input'; // Giả sử ông có component Input
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'; // Giả sử ông dùng Select của shadcn

// Import các types cần thiết
import type { ProductFormData, Product, CategoryName, BrandName } from '../../../types/InventoryServiceType';

// Mở rộng props để nhận thêm danh sách category và brand
interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: ProductFormData) => void;
  onClose: () => void;
  categories: CategoryName[]; // Bắt buộc phải truyền vào
  brands: BrandName[];       // Bắt buộc phải truyền vào
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onClose, categories, brands }) => {
  // State của form, chỉ chứa các trường người dùng có thể chỉnh sửa
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    name: '',
    seoTitle: '',
    description: '',
    status: 'active', // Mặc định là 'active' khi tạo mới
    tag: '',
    priceNormal: 0,
    image: '',
    listImage: '',
    priceSell: 0,
    promotionPrice: 0,
    weight: 0,
    vat: 0,
    warranty: '',
    metaKeyword: '',
    categoryId: '',
    brandId: '',
  });

  // useEffect để điền dữ liệu có sẵn vào form khi ở chế độ "sửa"
  useEffect(() => {
    if (initialData) {
      setFormData({
        sku: initialData.sku || '',
        name: initialData.name || '',
        seoTitle: initialData.seoTitle || '',
        description: initialData.description || '',
        status: initialData.status === 'active' ? 'active' : 'inactive',
        tag: initialData.tag || '',
        priceNormal: initialData.priceNormal || 0,
        priceSell: initialData.priceSell || 0,
        promotionPrice: initialData.promotionPrice || 0,
        weight: initialData.weight || 0,
        vat: initialData.vat || 0,
        warranty: initialData.warranty || '',
        metaKeyword: initialData.metaKeyword || '',
        categoryId: initialData.categoryId || '',
        brandId: initialData.brandId || '',
        // Thêm 2 dòng này vào
        image: initialData.image || '',
        listImage: initialData.listImage || '',
      });
    }
  }, [initialData]);

  // Handler chung cho việc thay đổi giá trị của các input và textarea
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Xử lý cho input type number
    const processedValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  // Handler riêng cho các component Select (của shadcn/ui)
  const handleSelectChange = (name: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Gửi toàn bộ dữ liệu form lên component cha để xử lý
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
      {/* Hàng 1: Tên sản phẩm & SKU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên sản phẩm <span className="text-red-500">*</span></Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="VD: iPhone 15 Pro Max" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">Mã SKU <span className="text-red-500">*</span></Label>
          {/* SKU chỉ cho phép nhập khi tạo mới */}
          <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} placeholder="VD: IP15PM_256_VN" required disabled={!!initialData} />
        </div>
      </div>

      {/* Hàng 2: Danh mục & Thương hiệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Danh mục <span className="text-red-500">*</span></Label>
          <Select name="categoryId" required value={formData.categoryId} onValueChange={(value) => handleSelectChange('categoryId', value)}>
            <SelectTrigger><SelectValue placeholder="-- Chọn danh mục --" /></SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brandId">Thương hiệu <span className="text-red-500">*</span></Label>
          <Select name="brandId" required value={formData.brandId} onValueChange={(value) => handleSelectChange('brandId', value)}>
            <SelectTrigger><SelectValue placeholder="-- Chọn thương hiệu --" /></SelectTrigger>
            <SelectContent>
              {brands.map(brand => (
                <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Hàng 3: Giá gốc & Giá bán */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priceNormal">Giá gốc (Giá nhập)</Label>
          <Input id="priceNormal" name="priceNormal" type="number" value={formData.priceNormal} onChange={handleChange} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceSell">Giá bán <span className="text-red-500">*</span></Label>
          <Input id="priceSell" name="priceSell" type="number" value={formData.priceSell} onChange={handleChange} placeholder="0" required />
        </div>
      </div>

      {/* Hàng 4: Trạng thái & Bảo hành */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái</Label>
          <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Đang bán (Active)</SelectItem>
              <SelectItem value="inactive">Ngừng bán (Inactive)</SelectItem>
            </SelectContent>
          </Select>
        </div>
         <div className="space-y-2">
            <Label htmlFor="warranty">Bảo hành (tháng)</Label>
            <Input id="warranty" name="warranty" value={formData.warranty} onChange={handleChange} placeholder="VD: 12" />
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="space-y-2">
        <Label htmlFor="description">Mô tả sản phẩm</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Nhập mô tả chi tiết cho sản phẩm..." />
      </div>

      {/* SEO Section - Có thể cho vào một Accordion để gọn hơn */}
      <div className="space-y-4 pt-4 border-t">
         <h3 className="font-medium">Tối ưu SEO</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input id="seoTitle" name="seoTitle" value={formData.seoTitle} onChange={handleChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="metaKeyword">Meta Keywords</Label>
                <Input id="metaKeyword" name="metaKeyword" value={formData.metaKeyword} onChange={handleChange} placeholder="VD: iphone, apple, điện thoại..." />
            </div>
         </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button type="submit">
          {initialData ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;