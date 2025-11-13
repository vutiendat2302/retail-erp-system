import React from 'react';
import { TableBody, TableCell, TableHead, TableRow, TableHeader, Table } from '../../ui/table';
import { Button } from '../../ui/button';
import { Tooltip, TooltipTrigger, TooltipContent} from '../../ui/tooltip';
import { Eye, Trash, Pencil, Tag, Calendar } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  gender: string;
  status: string;
  branchName: string;
  positionName: string;
}

interface EmployeeTableProps {
  data: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onAdd,
}) => {
  return (
    <div>
      <div className="mb-4 flex justify-end">
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Thêm nhân viên
          </button>
      </div>

      <div className='w-full mx-auto items-center '>
        <div className="rounded-md border relative">
          <div className='w-full'>
            <Table className='relative'>
              <TableHeader className=" sticky top-0 z-50 !border-b border-gray-900 bg-gray-100 dark:bg-gray-900">
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='text-center !border-r !border-gray-300'>
                    Tên
                  </TableHead>

                  <TableHead className='text-center !border-r !border-gray-300'>Email</TableHead>
                  <TableHead className='text-center !border-r !border-gray-300'>Giới tính</TableHead>
                  <TableHead className='text-center !border-r !border-gray-300'>Trạng thái</TableHead>
                  <TableHead className='text-center !border-r !border-gray-300'>Chi nhánh</TableHead>
                  <TableHead className='text-center !border-r !border-gray-300'>Chức danh</TableHead>
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
                  data.map((cat) => (
                    <TableRow key = {cat.id} className="!border-b">
                      <TableCell className='!border-r !border-gray-300'>
                          <div className='font-medium'>{cat.name}</div>
                      </TableCell>
                      <TableCell className='text-left !border-r !border-gray-300'>{cat.email}</TableCell>
                      <TableCell className='text-left !border-r !border-gray-300'>{cat.gender}</TableCell>
                      <TableCell className='text-center !border-r !border-gray-300 '>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cat.status === 'active' ? 'bg-green-100 text-green-700'
                          :'bg-red-100 text-red-700'
                        }`}
                        >
                          {cat.status}
                        </span>
                      </TableCell>
                      <TableCell className='text-center !border-r !border-gray-300'>
                        {cat.branchName}
                      </TableCell>
                      <TableCell className='text-center !border-r !border-gray-300'>
                        {cat.positionName}
                      </TableCell>
                      <TableCell className='text-center'>
                        <div className='flex gap-2 items-center justify-center'>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => console.log("hihi")}
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
                                onClick={() => onEdit(cat)}
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
                                onClick={() => onDelete(cat.id)}
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
                    <TableCell colSpan={6} className='px-4 py-6 text-center'>
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

