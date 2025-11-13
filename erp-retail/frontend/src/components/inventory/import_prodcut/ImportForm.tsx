import React, { useState, useEffect} from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import type { ImportLogFormData , ImportLogFormProps } from '../../../types/InventoryServiceType';
import { number } from 'framer-motion';

const ImportLogForm: React.FC<ImportLogFormProps> = ({
  initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<ImportLogFormData>({
    id: '',
    status: 'inactive',
    fromSupplierName: '',
    toWarehouseName: '',
    totalAmount: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        status: initialData.status || 'inactive',
        fromSupplierName: initialData.fromSupplierName || '',
        toWarehouseName: initialData.toWarehouseName || '',
        totalAmount: initialData.totalAmount || 0
      });

    } else {
      setFormData({
        id: '',
        status: 'inactive',
        fromSupplierName: '',
        toWarehouseName: '',
        totalAmount: 0
      })
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form data gửi đi:", formData);
    onSubmit(formData);
  };

  return (
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor="fromSupplierName">Nhà cung cấp</Label>
            <input
              type="text"
              id="fromSupplierName"
              name="fromSupplierName"
              value={formData.fromSupplierName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Kho nhập */}
          <div>
            <Label htmlFor="toWarehouseName">Kho nhập</Label>
            <input
              type="text"
              id="toWarehouseName"
              name="toWarehouseName"
              value={formData.toWarehouseName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Tổng tiền */}
          <div>
            <Label htmlFor="totalAmount">Tổng tiền</Label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <Label htmlFor="status">Trạng thái</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </div>

            {/*buttuon*/}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type='button'
                variant="outline"
                onClick={onClose}
                className='bg-white rounded hover:bg-gray-400 text-black'
              >
                Hủy
              </Button>

              <Button
                type='submit'
                variant="outline"
                onClick={onClose}
                className='px-4 py-2 button-color text-black rounded hover:button-color/40'
              >
                {initialData ? 'Cập nhật' : 'Thêm sản phẩm'}
              </Button>
            </div>

        </form>
  );
};

export default ImportLogForm;