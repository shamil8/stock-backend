export enum StockMovemantsTypeEnum {
  STOCK_IN = 'Stock In',
  STOCK_OUT = 'Stock Out',
  ADJUSTMENT = 'Adjustment',
}

export enum StockMovemantsReasonEnum {
  PURCHASE = 'Purchase',
  TRANSFER = 'Transfer',
  RETURN = 'Return',
}

export enum StockMovemantsFromEnum {
  SUPPLIER = 'Supplier',
  OTHER_FILIAL = 'Other Filial',
  RETURN_FROM_CUSTOMER = 'Return from Customer',
}
