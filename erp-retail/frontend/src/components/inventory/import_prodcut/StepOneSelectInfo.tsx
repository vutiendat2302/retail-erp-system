// file: src/components/inventory/import_prodcut/wizard/Step1_SelectInfo.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { getSuppliers, getWarehouses } from '@/services/inventery-api/ImportLogService';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from "@/lib/utils"; // Make sure you have this utility function from shadcn/ui

// Define types for our data
interface SelectOption {
  value: string;
  label: string;
}

interface Step1Props {
  initialData: {
    supplierId?: string;
    warehouseId?: string;
  };
  onNext: (data: { supplierId: string; warehouseId: string; supplierName: string, warehouseName: string }) => void;
}

export const Step1_SelectInfo: React.FC<Step1Props> = ({ initialData, onNext }) => {
  // State for data lists
  const [suppliers, setSuppliers] = useState<SelectOption[]>([]);
  const [warehouses, setWarehouses] = useState<SelectOption[]>([]);

  // State for combobox open/close status
  const [openSupplier, setOpenSupplier] = useState(false);
  const [openWarehouse, setOpenWarehouse] = useState(false);

  // State for selected values
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(initialData.supplierId || null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(initialData.warehouseId || null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supplierRes, warehouseRes] = await Promise.all([getSuppliers(), getWarehouses()]);
        setSuppliers(supplierRes.data.map((s: any) => ({ value: s.id.toString(), label: s.name })));
        setWarehouses(warehouseRes.data.map((w: any) => ({ value: w.id.toString(), label: w.name })));
      } catch (error) {
        console.error("Failed to fetch suppliers or warehouses", error);
      }
    };
    fetchData();
  }, []);

  const handleNextClick = () => {
    if (selectedSupplier && selectedWarehouse) {
      const supplierName = suppliers.find(s => s.value === selectedSupplier)?.label || '';
      const warehouseName = warehouses.find(w => w.value === selectedWarehouse)?.label || '';
      onNext({ 
        supplierId: selectedSupplier, 
        warehouseId: selectedWarehouse,
        supplierName,
        warehouseName
      });
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-2 gap-8">
        {/* Supplier Combobox */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nhà cung cấp</label>
          <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={openSupplier} className="w-full justify-between">
                {selectedSupplier ? suppliers.find(s => s.value === selectedSupplier)?.label : "Chọn nhà cung cấp..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[535px] p-0">
              <Command>
                <CommandInput placeholder="Tìm nhà cung cấp..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy nhà cung cấp.</CommandEmpty>
                  <CommandGroup>
                    {suppliers.map((supplier) => (
                      <CommandItem
                        key={supplier.value}
                        value={supplier.label}
                        onSelect={() => {
                          setSelectedSupplier(supplier.value);
                          setOpenSupplier(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", selectedSupplier === supplier.value ? "opacity-100" : "opacity-0")} />
                        {supplier.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Warehouse Combobox */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kho nhập</label>
          <Popover open={openWarehouse} onOpenChange={setOpenWarehouse}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={openWarehouse} className="w-full justify-between">
                {selectedWarehouse ? warehouses.find(w => w.value === selectedWarehouse)?.label : "Chọn kho nhập..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[535px] p-0">
              <Command>
                <CommandInput placeholder="Tìm kho..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy kho.</CommandEmpty>
                  <CommandGroup>
                    {warehouses.map((warehouse) => (
                      <CommandItem
                        key={warehouse.value}
                        value={warehouse.label}
                        onSelect={() => {
                          setSelectedWarehouse(warehouse.value);
                          setOpenWarehouse(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", selectedWarehouse === warehouse.value ? "opacity-100" : "opacity-0")} />
                        {warehouse.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <Button
          onClick={handleNextClick}
          disabled={!selectedSupplier || !selectedWarehouse}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};