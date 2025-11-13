// file: src/components/inventory/import_prodcut/wizard/Step2_SelectProducts.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { getProducts, createProductBatch } from '@/services/inventery-api/ImportLogService';
import api from '@/services/inventery-api/api';
import { ChevronsUpDown, Check, Trash2, PlusCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { formatCurrency } from '@/components/ui/Convert';

// --- Types ---
interface Product {
    id: string; name: string; priceNormal: number; brandName?: string; categoryName?: string;
}
interface ProductBatch {
    id: string; name: string;
}
interface ImportProductLine {
    productId: string; productName: string; brandName?: string; categoryName?: string;
    batchId: string; batchName: string; quantity: number; price: number;
}
interface Step2Props {
    initialData: any;
    onNext: (data: { products: ImportProductLine[] }) => void;
    onBack: () => void;
}

// --- CreateBatchModal Component ---
const CreateBatchModal = ({ productId, onSuccess }: { productId: string, onSuccess: (newBatch: ProductBatch) => void }) => {
    // ... code cho CreateBatchModal giữ nguyên như cũ ...
    const [isOpen, setIsOpen] = useState(false);
    const [batchName, setBatchName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!batchName) { alert('Tên lô hàng không được để trống.'); return; }
        setIsSubmitting(true);
        try {
            const payload = {
                productId: productId,
                name: batchName,
                // Sửa lại expiryDate để thêm giờ phút giây
                expiryDate: expiryDate ? `${expiryDate}T00:00:00` : null,
                importDate: new Date().toISOString(),
                createBy: "1450492617670998016", 
                updateBy: "1450492617670998016", 
                description: "",
                // Thêm dấu () vào sau toISOString
                createAt: new Date().toISOString(),
                updateAt: new Date().toISOString()
            };
            const response = await createProductBatch(payload);
            onSuccess(response.data);
            setIsOpen(false);
            setBatchName('');
            setExpiryDate('');
            
        } catch (error) {
            console.error("Lỗi khi tạo lô hàng:", error);
            alert("Đã có lỗi xảy ra khi tạo lô hàng.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2 text-sm"><PlusCircle className="mr-2 h-4 w-4" /> Tạo lô mới</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Tạo lô hàng mới</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div><Label htmlFor="batchName">Tên lô hàng</Label><Input id="batchName" value={batchName} onChange={(e) => setBatchName(e.target.value)} required /></div>
                    <div><Label htmlFor="expiryDate">Ngày hết hạn (tùy chọn)</Label><Input id="expiryDate" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} /></div>
                    <div className="flex justify-end space-x-2"><Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Hủy</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : 'Lưu'}</Button></div>
                </form>
            </DialogContent>
        </Dialog>
    );
};


export const Step2_SelectProducts: React.FC<Step2Props> = ({ initialData, onNext, onBack }) => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [addedProducts, setAddedProducts] = useState<ImportProductLine[]>(initialData.products || []);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [availableBatches, setAvailableBatches] = useState<ProductBatch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<ProductBatch | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [price, setPrice] = useState<number>(0);
    const [openProduct, setOpenProduct] = useState(false);
    const [openBatch, setOpenBatch] = useState(false);

    useEffect(() => { getProducts().then(res => setAllProducts(res.data)).catch(err => console.error("Failed to fetch products", err)); }, []);

    useEffect(() => {
        if (selectedProduct) {
            api.get(`/api/product-batch/product/${selectedProduct.id}`)
                .then(res => setAvailableBatches(res.data))
                .catch(err => console.error(`Failed to fetch batches`, err));
            setPrice(selectedProduct.priceNormal || 0);
            setSelectedBatch(null);
        } else {
            setAvailableBatches([]);
        }
    }, [selectedProduct]);

    const handleAddProduct = () => {
        if (!selectedProduct || !selectedBatch || quantity <= 0 || price < 0) {
            alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
            return;
        }
        const newProductLine: ImportProductLine = {
            productId: selectedProduct.id, productName: selectedProduct.name, brandName: selectedProduct.brandName,
            categoryName: selectedProduct.categoryName, batchId: selectedBatch.id, batchName: selectedBatch.name,
            quantity: Number(quantity), price: Number(price),
        };
        setAddedProducts(prev => [...prev, newProductLine]);
        setSelectedProduct(null); setSelectedBatch(null); setQuantity(1); setPrice(0); setAvailableBatches([]);
    };
    
    const handleRemoveProduct = (index: number) => {
        setAddedProducts(prev => prev.filter((_, i) => i !== index));
    };

    const handleBatchCreated = (newBatch: ProductBatch) => {
        setAvailableBatches(prev => [...prev, newBatch]);
        setSelectedBatch(newBatch);
    };
    
    return (
        <div className="space-y-6 py-4">
            {/* 1. General Info */}
            <div className="p-4 border rounded-md bg-gray-50 grid grid-cols-2 gap-4">
                <div><span className="font-semibold">Nhà cung cấp:</span> {initialData.supplierName}</div>
                <div><span className="font-semibold">Kho nhập:</span> {initialData.warehouseName}</div>
            </div>

            {/* ================================================================== */}
            {/* === PHẦN CODE ĐẦY ĐỦ CHO FORM THÊM SẢN PHẨM === */}
            {/* ================================================================== */}
            <div className="p-4 border rounded-md grid grid-cols-12 gap-4 items-end">
                {/* Product Select */}
                <div className="col-span-4">
                    <label className="text-sm font-medium">Sản phẩm</label>
                    <Popover open={openProduct} onOpenChange={setOpenProduct}>
                        <PopoverTrigger asChild><Button variant="outline" className="w-full justify-between mt-1">{selectedProduct?.name || "Chọn sản phẩm..."}<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button></PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0"><Command><CommandInput placeholder="Tìm sản phẩm..." />
                            <CommandList><CommandEmpty>Không tìm thấy.</CommandEmpty>
                            <CommandGroup>{allProducts.map(p => (
                                <CommandItem key={p.id} value={p.name} onSelect={() => { setSelectedProduct(p); setOpenProduct(false); }}>
                                    <Check className={cn("mr-2 h-4 w-4", selectedProduct?.id === p.id ? "opacity-100" : "opacity-0")} />{p.name}
                                </CommandItem>
                            ))}</CommandGroup></CommandList>
                        </Command></PopoverContent>
                    </Popover>
                </div>
                {/* Batch Select */}
                <div className="col-span-2">
                    <label className="text-sm font-medium">Lô hàng</label>
                    <Popover open={openBatch} onOpenChange={setOpenBatch}>
                        <PopoverTrigger asChild><Button variant="outline" disabled={!selectedProduct} className="w-full justify-between mt-1">{selectedBatch?.name || "Chọn lô..."}<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button></PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0"><Command><CommandInput placeholder="Tìm lô..." />
                            <CommandList><CommandEmpty>Không có lô nào.</CommandEmpty>
                            <CommandGroup>{availableBatches.map(b => (
                                <CommandItem key={b.id} value={b.name} onSelect={() => { setSelectedBatch(b); setOpenBatch(false); }}>
                                    <Check className={cn("mr-2 h-4 w-4", selectedBatch?.id === b.id ? "opacity-100" : "opacity-0")} />{b.name}
                                </CommandItem>
                            ))}</CommandGroup>
                            {selectedProduct && <CreateBatchModal productId={selectedProduct.id} onSuccess={handleBatchCreated} />}
                            </CommandList>
                        </Command></PopoverContent>
                    </Popover>
                </div>
                {/* Quantity */}
                <div className="col-span-2"><label className="text-sm font-medium">Số lượng</label><Input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min={1} className="mt-1" /></div>
                {/* Price */}
                <div className="col-span-2"><label className="text-sm font-medium">Giá nhập</label><Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} min={0} className="mt-1" /></div>
                {/* Add Button */}
                <div className="col-span-2"><Button onClick={handleAddProduct} className="w-full">Thêm vào phiếu</Button></div>
            </div>

            {/* ================================================================== */}
            {/* === PHẦN CODE ĐẦY ĐỦ CHO BẢNG SẢN PHẨM === */}
            {/* ================================================================== */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader><TableRow><TableHead>Sản phẩm</TableHead><TableHead>Brand/Category</TableHead><TableHead>Lô hàng</TableHead><TableHead className="text-right">Số lượng</TableHead><TableHead className="text-right">Đơn giá</TableHead><TableHead className="text-right">Thành tiền</TableHead><TableHead></TableHead></TableRow></TableHeader>
                    <TableBody>
                        {addedProducts.length > 0 ? addedProducts.map((p, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{p.productName}</TableCell>
                                <TableCell>{p.brandName || 'N/A'} / {p.categoryName || 'N/A'}</TableCell>
                                <TableCell>{p.batchName}</TableCell>
                                <TableCell className="text-right">{p.quantity}</TableCell>
                                <TableCell className="text-right">{formatCurrency(p.price)}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(p.quantity * p.price)}</TableCell>
                                <TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={7} className="h-24 text-center">Chưa có sản phẩm nào được thêm.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </div>
            
            {/* ================================================================== */}
            {/* === PHẦN CODE ĐẦY ĐỦ CHO CÁC NÚT ĐIỀU HƯỚNG === */}
            {/* ================================================================== */}
            <div className="flex justify-between pt-8">
                <Button variant="outline" onClick={onBack}>Quay lại</Button>
                <Button onClick={() => onNext({ products: addedProducts })} disabled={addedProducts.length === 0}>Tiếp tục</Button>
            </div>
        </div>
    );
};