import { useState, useEffect } from "react";
import { DialogContent, DialogDescription, DialogTitle, DialogTrigger, Dialog, DialogHeader } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { BrandTable } from "../../components/inventory/brands/BrandTable";
import type { SupplierFormData, Supplier as SupplierType } from "../../types/InventoryServiceType";
import { createSupplier, deleteSupplier, getSearchSupplier, getSuppliers, updateSupplier } from "../../services/inventery-api/Supplier";
import { SupplierTable} from "../../components/inventory/supplier/SupplierTable";

export function Supplier() {
  const [suppliers, setSuppliers] = useState<SupplierType[]>([])
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<SupplierType | null>(null);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const loadSuppliers = async (pageNumber : number) => {
    setLoading(true);
    try {
      const res = await getSearchSupplier({
        search: search || undefined,
        status: status || undefined,
        page: pageNumber, size, sort: 'name,asc'
      });

      setSuppliers(res.data.content);
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
      loadSuppliers(page);
    }
  }, [page, size, search, status]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xác nhận xóa nhà cung cấp này?')) return;
    await deleteSupplier(id);

    if (suppliers.length === 1 && page > 0) {
      setPage(page - 1);
    } else {
      loadSuppliers(page);
    }
  };

  const handleUpdate = (supplier : SupplierType) => {
    setCurrentSupplier(supplier);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setCurrentSupplier(null);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleFormSubmit = async (data: SupplierFormData) => {
    if (currentSupplier) {
      console.log('Cập nhật nhà cung cấp', data);
      await updateSupplier(currentSupplier.id, data);
      console.log('Update thành công');
      // Gọi loadProducts trực tiếp để làm mới dữ liệu
      loadSuppliers(page);
    } else {
      console.log('Tạo nhà cung cấp mới', data);
      await createSupplier(data);
      console.log('Create thành công');
      // Gọi loadProducts trực tiếp để làm mới dữ liệu trên trang hiện tại
      loadSuppliers(page);
    }
      setFormOpen(false);
    };

  const goToPage = (newPage: number) => {
    if (newPage >= 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  }

  return (
    <div className="px-6">
      <div className="md:px-10 -mt-10">
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='mb-2'>Nhà cung cấp</h3>
            <p className="text-muted-foreground">
              Đang phát triển
            </p>
          </div>
          <div>
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => {
                  setCurrentSupplier(null);
                  setFormOpen(true);
                }}
                  className="!rounded-lg bg-gray-950 text-white hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm nhà cung cấp
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader className="text-right">
                  <DialogTitle >
                    {currentSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
                  </DialogTitle>
                  <DialogDescription>
                    {currentSupplier ? 'Cập nhật thông tin nhà cung cấp' : 'Nhập thông tin nahf cung cấp mới'}
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
          <SupplierTable
            data = {suppliers}
            loading = {loading}
            onEdit={handleUpdate}
            onDelete={handleDelete}
            totalElements={totalElements}
            goToPage = {goToPage}
            totalPages = {totalPages}
            page = {page}
            setPage = {setPage}
          />
        </div>
      </div>
    </div>
  )
}