export enum ProductHistoryAction {
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  STOCK_IN = 'stock_in',
  STOCK_OUT = 'stock_out',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
}

export enum ProductHistoryType {
  PRODUCT = 'product',
  STOCK = 'stock',
}
