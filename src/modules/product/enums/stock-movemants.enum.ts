export enum StockMovemantsType {
  STOCK_IN = 'Stock In',
  STOCK_OUT = 'Stock Out',
  ADJUSTMENT = 'Adjustment',
  TRANSFER = 'Transfer',
}

export enum StockMovementsReason {
  PURCHASE = 'Purchase',
  TRANSFER = 'Transfer',
  RETURN = 'Return',
  SALE = 'Sale',
  DISCARDED = 'Discarded',
}

export enum StockMovemants {
  SUPPLIER = 'Supplier',
  OTHER_FILIAL = 'Other Filial',
  RETURN_FROM_CUSTOMER = 'Return from Customer',
  CLIENT = 'Client',
  DISCARDED = 'Discarded',
}
