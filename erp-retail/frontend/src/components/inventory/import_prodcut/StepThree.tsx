// file: src/components/inventory/import_prodcut/wizard/Step3_ConfirmAndPay.tsx
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow, TableFooter } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/components/ui/Convert';

interface Step3Props {
    initialData: any;
    onConfirm: () => void;
    onClose: () => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export const Step3_ConfirmAndPay: React.FC<Step3Props> = ({ initialData, onConfirm, onClose, onBack, isSubmitting }) => {

    const totalAmount = useMemo(() => {
        return initialData.products?.reduce((total: number, product: any) => {
            return total + (product.quantity * product.price);
        }, 0) || 0;
    }, [initialData.products]);

    return (
        <div className="space-y-6 py-4">
            <Card>
                <CardHeader>
                    <CardTitle>Xác nhận thông tin phiếu nhập</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 border rounded-md bg-gray-50 grid grid-cols-2 gap-4">
                        <div><span className="font-semibold">Từ nhà cung cấp:</span> {initialData.supplierName}</div>
                        <div><span className="font-semibold">Nhập về kho:</span> {initialData.warehouseName}</div>
                    </div>
                    
                    <h4 className="font-semibold pt-4">Chi tiết sản phẩm</h4>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sản phẩm</TableHead>
                                    <TableHead>Lô hàng</TableHead>
                                    <TableHead className="text-right">Số lượng</TableHead>
                                    <TableHead className="text-right">Đơn giá</TableHead>
                                    <TableHead className="text-right">Thành tiền</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialData.products?.map((p: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{p.productName}</TableCell>
                                        <TableCell>{p.batchName}</TableCell>
                                        <TableCell className="text-right">{p.quantity}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(p.price)}</TableCell>
                                        <TableCell className="text-right font-semibold">{formatCurrency(p.quantity * p.price)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4} className="text-right font-bold text-lg">Tổng cộng</TableCell>
                                    <TableCell className="text-right font-bold text-lg">{formatCurrency(totalAmount)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between pt-8">
                <Button variant="outline" onClick={onBack} disabled={isSubmitting}>Quay lại</Button>
                <div className="space-x-2">
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Lưu nháp & Đóng</Button>
                    <Button onClick={onConfirm} disabled={isSubmitting}>
                        {isSubmitting ? "Đang xử lý..." : "Xác nhận & Hoàn tất"}
                    </Button>
                </div>
            </div>
        </div>
    );
};