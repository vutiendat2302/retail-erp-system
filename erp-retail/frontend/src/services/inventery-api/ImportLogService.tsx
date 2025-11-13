import api from "./api";

type ImportProductLogRequestDto = any;
type HistoryPayDto = any;
type ProductBatchDto = any;
type PageParams = {
  search?: string | null;
  status?: string | null;
  page?: number;
  size?: number;
  sort?: string;
}

export const createImportLog = (data: ImportProductLogRequestDto) => api.post('/api/importProductLog/createImportLog', data);

export const getImportLog = (id: string) => api.get(`/api/importProductLog/getImportLog/${id}`);

export const getImportProductList = (logId: string) => api.get(`/api/importProductLog/getImportProductList/${logId}`);

export const updateImportLogStatus = (importLogId: string, status: string) =>
api.put(`/api/importProductLog/updateImportLog/${importLogId}`, { status });

export const createHistoryPay = (logId: string, data: HistoryPayDto) =>
  api.post(`/api/importProductLog/createHistoryPay/${logId}`, data);

export const getHistoryPay = (logId: string) =>
  api.get(`/api/importProductLog/getHistoryPay/${logId}`);


export const createProductBatch = (data: ProductBatchDto) =>
  api.post('/api/productBatch/createProductBatch', data);

export const getSuppliers = () => api.get('/api/supplier/suppliers');

export const getWarehouses = () => api.get('/api/warehouse/warehouses');

export const getProducts = () => api.get('/api/product/products');


export const getSearchImport = ({
  search = null,
  status = null,
  page = 0,
  size = 5,
  sort = 'name,asc',
} : PageParams) => api.get(`/api/importProductLog/import-logs`, {
  params: {search, status, page, size, sort}
})


export const deleteImportLog = (id: string) => api.delete(`/api/importProductLog/deleteImport/${id}`);
