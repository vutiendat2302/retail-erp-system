import { useState, useEffect } from "react";
import type { BrandFormData, Brand as BrandType } from "../../types/InventoryServiceType";
import { createBrand, deleteBrand, getSearchBrand, updateBrand } from "../../services/inventery-api/BrandService";
import { DialogContent, DialogDescription, DialogTitle, DialogTrigger, Dialog, DialogHeader } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Plus, } from 'lucide-react';
import { BrandTable } from "../../components/inventory/brands/BrandTable";

export function Brand() {
  const [brands, setBrands] = useState<BrandType[]>([])
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<BrandType | null>(null);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [countProduct, setCountProduct] = useState<number>(0);

  const loadBrands = async (pageNumber : number) => {
    setLoading(true);
    try {
      const res = await getSearchBrand({
        search: search || undefined,
        status: status || undefined,
        page: pageNumber, size, sort: 'name,asc'
      });

      setBrands(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (size > 0) {
      loadBrands(page);
    }
  }, [page, size, search, status]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xác nhận xóa brand này?')) return;
    await deleteBrand(id);

    if (brands.length === 1 && page > 0) {
      setPage(page - 1);
    } else {
      loadBrands(page);
    }
  };

  const handleUpdate = (brand: BrandType) => {
    setCurrentBrand(brand);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setCurrentBrand(null);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleFormSubmit = async (data: BrandFormData) => {
    if (currentBrand) {
      console.log('Cập nhật thương hiệu', data);
      await updateBrand(currentBrand.id, data);
      console.log('Update thành công');
      // Gọi loadProducts trực tiếp để làm mới dữ liệu
      loadBrands(page);
    } else {
      console.log('Tạo thương hiệu mới', data);
      await createBrand(data);
      console.log('Create thành công');
      // Gọi loadProducts trực tiếp để làm mới dữ liệu trên trang hiện tại
      loadBrands(page);
    }
      setFormOpen(false);
    };

  const goToPage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  }

  return (
    <div className="px-6">
      <div className="md:px-10 -mt-10">
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='mb-2'>Quản lý thương hiệu</h3>
            <p className="text-muted-foreground">
              Đang phát triển
            </p>
          </div>
          <div>
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => {
                  setCurrentBrand(null);
                  setFormOpen(true);
                }}
                  className="!rounded-lg bg-gray-950 text-white hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm thương hiệu
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader className="text-right">
                  <DialogTitle >
                    {currentBrand ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}
                  </DialogTitle>
                  <DialogDescription>
                    {currentBrand ? 'Cập nhật thông tin thương hiệu' : 'Nhập thông tin thương hiệu mới'}
                  </DialogDescription>
                </DialogHeader>
                {/* <BrandForm
                  initialData={currentCategory}
                  onSubmit={handleFormSubmit}
                  onClose={handleFormClose}
                /> */}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div>
          <BrandTable
            data = {brands}
            loading = {loading}
            onEdit={handleUpdate}
            onDelete={handleDelete}
            totalElements={totalElements}
            goToPage={goToPage}
            page = {page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  )
}