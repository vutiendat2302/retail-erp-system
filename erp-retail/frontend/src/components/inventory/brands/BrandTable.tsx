import React, {useState} from "react";
import type {Brand, TableProp } from "@/types/InventoryServiceType";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { TableBody, TableCell, TableHead, TableRow, TableHeader, Table } from '../../ui/table';
import { Button } from '../../ui/button';
import { Tooltip, TooltipTrigger} from '../../ui/tooltip';
import { Eye, Trash, Pencil, Tag, Calendar } from 'lucide-react';
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle } from '../../ui/dialog';
import { formatCurrency, formatDate } from '../../ui/Convert';
import { PageControl } from "../../../types/PageControl";

type BrandTableProp = TableProp<Brand>

export const BrandTable: React.FC<BrandTableProp> = ({
  data,
  loading,
  onEdit,
  onDelete,
  totalElements,
  goToPage,
  page,
  setPage,
  totalPages
}) => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null> (null);
  const [openInformationBrand, setOpenInformationBrand] = useState(false);
  const handleViewBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setOpenInformationBrand(true);
  }

  return (
    <div className="w-full mx-auto items-center">
          <div className="rounded-md border relative">
            <div className='w-full'
            >
              <Table className='relative'>
                <TableHeader className=" sticky top-0 z-50 !border-b border-gray-900 bg-gray-100 dark:bg-gray-900">
                  <TableRow className='hover:bg-transparent'>
                    <TableHead className='text-center !border-r !border-gray-300'>
                      Tên thương hiệu
                    </TableHead>
                    <TableHead className='text-center !border-r !border-gray-300'>Quốc gia</TableHead>
                    <TableHead className='text-center !border-r !border-gray-300'>Mô tả</TableHead>
                    <TableHead className='text-center !border-r !border-gray-300'>Số sản phẩm</TableHead>
                    <TableHead className='text-center !border-r !border-gray-300'>Trạng thái</TableHead>
                    <TableHead className='text-center '>Chức năng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className='px-4 py-6 text-center'>
                        Đang tải dữ liệu
                      </TableCell>
                    </TableRow>
                  ): data.length>0 ? (
                    data.map((brand) => (
                      <TableRow key = {brand.id} className="!border-b">
                        <TableCell className='!border-r !border-gray-300'>
                          <div>
                            <div className='font-medium'>{brand.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className='text-center !border-r !border-gray-300'>{brand.country} </TableCell>
                        <TableCell className='text-left !border-r !border-gray-300'>{brand.description}</TableCell>
                        <TableCell className='text-left !border-r !border-gray-300'>Đang phát triển</TableCell>
                        <TableCell className='text-center !border-r !border-gray-300 '>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            brand.status === 'active' ? 'bg-green-100 text-green-700'
                            :'bg-red-100 text-red-700'
                          }`}
                          >
                            {brand.status}
                          </span>
                        </TableCell>
                        <TableCell className='text-center'>
                          <div className='flex gap-2 items-center justify-center'>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {handleViewBrand(brand)}}
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
                                  onClick={() => onEdit(brand)}
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
                                  onClick={() => onDelete(brand.id)}
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
                      <TableCell colSpan={5} className='px-4 py-6 text-center'>
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
          </div>
          </div>
          <div className="justify-between centre mt-6"> 
            <PageControl
              goToPage={goToPage}
              totalPage={totalPages}
              currentPage = {page}
            />
          </div>
          

  
      {selectedBrand && (
        <Dialog open = {openInformationBrand} onOpenChange={setOpenInformationBrand}>
          <DialogContent className='max-w-2x1'>
            <DialogHeader>
              <DialogTitle className='flex items-center space-x-2'>
                <span>{selectedBrand.name}</span>
              </DialogTitle>
              <DialogDescription>
                Chi tiết thông tin thương hiệu
              </DialogDescription>
            </DialogHeader>
  
            <div className='grid grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium mb-2'>Thông tin cơ bản</h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Quốc gia:</span>
                      <code className='bg-muted px-2 py-1 rounded text-xs'>
                        {selectedBrand.country}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">
                        {selectedBrand.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className='space-y-4'>
                <div>
                  <h4 className="font-medium mb-2">Mô tả</h4>
                  <p className="text-sm text-muted-foreground">
                        {selectedBrand.description}
                  </p>
                </div>
  
                <div>
                  <h4 className="font-medium mb-2">Thông tin khác</h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Ngày tạo:</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(selectedBrand.createAt)}
                      </span>
                    </div>
  
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Cập nhật:</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(selectedBrand.updateAt)}
                      </span>
                    </div>
  
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Tạo bởi:</span>
                      <span className="flex items-center">
                        {selectedBrand.createBy}
                      </span>
                    </div>
  
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Update bởi:</span>
                      <span className="flex items-center">
                        {selectedBrand.createBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className='flex justify-end space-x-2 pt-4 border-t'>
              <Button variant="outline" onClick={() => setOpenInformationBrand(false)}>
                Đóng
              </Button>
  
              <Button onClick={() => {
                setOpenInformationBrand(false);
                onEdit(selectedBrand);
              }}>
                Chỉnh sửa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
