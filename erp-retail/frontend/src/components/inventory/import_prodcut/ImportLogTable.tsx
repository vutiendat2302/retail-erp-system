import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/components/ui/Convert';
import type { ImportLog, ImportLogTableProps } from '@/types/InventoryServiceType';
import { PageControl } from '@/types/PageControl';
import { Tooltip, TooltipTrigger} from '../../ui/tooltip';
import { Eye, Trash, Pencil, Tag, Calendar } from 'lucide-react';

export const ImportLogTable: React.FC<ImportLogTableProps> = ({ data, loading, onEdit, onDelete, goToPage, setPage, totalPages, page, totalElements }) => {
  if (loading) return <p className="text-center py-4">Đang tải danh sách...</p>;
  const [selectImportLog, setSelectImportLog] = useState<ImportLog | null>(null);
  const [openInformationImportLog, setOpenInformationImportLog] = useState<boolean>(false);
  const handleViewImportLog = (importLog: ImportLog) => {
    setSelectImportLog(importLog);
    setOpenInformationImportLog(true);
  }
  return (
    <div className='w-full mx-auto items-center '>
      <div className="rounded-md border relative">
        <div className='max-w-full'></div>
          <Table className='relative'>
            <TableHeader className=" sticky top-0 z-50 !border-b border-gray-900 bg-gray-100 dark:bg-gray-900">
              <TableRow className='hover:bg-transparent'>
                <TableHead className='text-center !border-r !border-gray-300'>Mã đơn</TableHead>
                <TableHead className='text-center !border-r !border-gray-300'>Nhà cung cấp</TableHead>
                <TableHead className='text-center !border-r !border-gray-300'>Kho nhập</TableHead>
                <TableHead className='text-center !border-r !border-gray-300'>Tổng tiền</TableHead>
                <TableHead className='text-center !border-r !border-gray-300'>Trạng thái</TableHead>
                <TableHead className='text-center !border-r !border-gray-300'>Ngày tạo</TableHead>
                <TableHead className='text-center !border-r !border-gray-300'>Chức năng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className='px-4 py-6 text-center'>
                    Đang tải dữ liệu
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map((log) => (
                  <TableRow key={log.id} className="!border-b">
                    <TableCell className='text-left !border-r !border-gray-300'>{log.id}</TableCell>
                    <TableCell className='text-left !border-r !border-gray-300'>{log.fromSupplierName}</TableCell>
                    <TableCell className='text-left !border-r !border-gray-300'>{log.toWarehouseName}</TableCell>
                    <TableCell className="text-right !border-r !border-gray-300">{formatCurrency(log.totalAmount)}</TableCell>
                    <TableCell className="text-center !border-r !border-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'active' ? 'bg-green-100 text-green-700'
                        :'bg-red-100 text-red-700'
                      }`}
                      >
                        {log.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right !border-r !border-gray-300">{formatDate(log.createAt)}</TableCell>
                    <TableCell className="text-center !border-r !border-gray-300">
                      <div className='flex gap-2 items-center justify-center'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {handleViewImportLog(log)}}
                              className='!rounded-md text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white transition-colors'
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onEdit(log)}
                              className='!rounded-md text-green-500 border-green-500 hover:bg-green-500 hover:text-white transition-colors'
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onDelete(log.id)}
                              className='!rounded-md text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-colors'
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Chưa có đơn nhập hàng nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </div>
      <div className='"justify-between center mt-6'>
        <PageControl
          goToPage={goToPage}
          currentPage={page}
          totalPage={totalPages}
        />
      </div>
    </div>
  );
};