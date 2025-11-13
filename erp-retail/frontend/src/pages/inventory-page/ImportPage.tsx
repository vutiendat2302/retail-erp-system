// file: pages/ImportPage.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { ImportLogTable } from '@/components/inventory/import_prodcut/ImportLogTable';
import { createImportLog, getSearchImport, updateImportLogStatus } from '@/services/inventery-api/ImportLogService';
import type { ImportLog } from '@/types/InventoryServiceType';
import { Step1_SelectInfo } from '@/components/inventory/import_prodcut/StepOneSelectInfo';
import { Step2_SelectProducts } from '@/components/inventory/import_prodcut/StepTwoSelectProduct';
import { Step3_ConfirmAndPay } from '@/components/inventory/import_prodcut/StepThree';

type WizardData = {
  supplierId?: string;
  warehouseId?: string;
  supplierName?: string;
  warehouseName?: string;
  products?: any[];
};

const ImportPage: React.FC = () => {
    // State cho bảng dữ liệu
    const [logs, setLogs] = useState<ImportLog[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // State cho Wizard
    const [isWizardOpen, setWizardOpen] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [wizardData, setWizardData] = useState<WizardData>({});
    const [newlyCreatedLogId, setNewlyCreatedLogId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Hàm tải dữ liệu cho bảng
    const loadLogs = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await getSearchImport({ page: pageNumber, size: 10 });
            setLogs(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi tải đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs(page);
    }, [page]);

    const handleOpenWizard = () => {
        setCurrentStep(1);
        setWizardData({});
        setNewlyCreatedLogId(null);
        setIsSubmitting(false);
        setWizardOpen(true);
    };

    const handleCloseWizard = () => {
        setWizardOpen(false);
        loadLogs(page);
    };

    const handleNextStep = (dataFromStep: any) => {
        setWizardData(prev => ({ ...prev, ...dataFromStep }));
        setCurrentStep(prev => prev + 1);
    };

		const goToPage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  }
    
    // Đã xóa hàm trùng lặp
    const handlePrevStep = () => setCurrentStep(prev => prev - 1);

    const handleNavigateToStep3 = async (dataFromStep2: any) => {
        const finalData = { ...wizardData, ...dataFromStep2 };
        setWizardData(finalData);
        setIsSubmitting(true);

        const payload = {
            importLogResponseDto: {
                fromSupplierId: finalData.supplierId,
                toWarehouseId: finalData.warehouseId,
                status: false,
            },
            importProductResponseDtoList: finalData.products.map((p: any) => ({
                productId: p.productId,
                quantity: p.quantity,
                price: p.price,
                batchId: p.batchId,
            })),
        };

        try {
            const response = await createImportLog(payload);
            setNewlyCreatedLogId(response.data.id);
            setCurrentStep(3);
        } catch (error) {
            console.error("Lỗi khi tạo phiếu nháp:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFinalizeImport = async () => {
        if (!newlyCreatedLogId) return;
        setIsSubmitting(true);
        try {
            await updateImportLogStatus(newlyCreatedLogId, 'active');
            alert("Tạo phiếu nhập thành công!");
            handleCloseWizard();
        } catch (error) {
            console.error("Lỗi khi xác nhận phiếu nhập:", error);
            alert("Đã xảy ra lỗi khi xác nhận phiếu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='px-6 mt-10'>
            <div className='md:px-10'>
                <div className='flex items-center justify-between'>
                    <div className='mb-2'>
                        <h3 className='mb-2 title'>Quản lý nhập hàng</h3>
                        <p className="content font-size-md opacity-80">
                            Theo dõi và quản lý các phiếu nhập hàng từ nhà cung cấp vào kho.
                        </p>
                    </div>
                    <div>
                        <Button 
                            variant="outline" 
                            onClick={handleOpenWizard}
                            className="!rounded-lg bg-gray-950 text-white hover:bg-gray-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm đơn nhập hàng
                        </Button>
                    </div>
                </div>
                
                <div className='mt-6'>
                    <ImportLogTable
                        data={logs}
                        loading={loading}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        goToPage={goToPage}
												setPage={setPage}
                        page={page}
                        totalPages={totalPages}
                        totalElements={0}
                    />
                </div>
            </div>

            <Dialog open={isWizardOpen} onOpenChange={setWizardOpen}>
                <DialogContent className="w-[1200px] bg-white" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Tạo đơn nhập hàng - Bước {currentStep}/3</DialogTitle>
                    </DialogHeader>
                    
                    {currentStep === 1 && (
                        <Step1_SelectInfo 
                            onNext={handleNextStep}
                            initialData={wizardData}
                        />
                    )}
                    {currentStep === 2 && (
                        
                        <Step2_SelectProducts
                            onNext={handleNavigateToStep3} // Sửa ở đây
                            onBack={handlePrevStep}
                            initialData={wizardData}
                        />
                    )}
                    {currentStep === 3 && (
                        <Step3_ConfirmAndPay 
                            initialData={wizardData} 
                            onConfirm={handleFinalizeImport} 
                            onClose={handleCloseWizard} 
                            onBack={handlePrevStep} 
                            isSubmitting={isSubmitting} 
                        />
                    )}

                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ImportPage;