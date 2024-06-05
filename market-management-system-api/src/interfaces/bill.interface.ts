export interface IBill {
  id: number;
  status: Status;
  rentPrice: number;
  WaterPriceUnit: number;
  electricityPriceUnit: number;
  waterBill: number;
  electricityBill: number;
  waterUnit: number;
  waterUnitBefore: number;
  electricityUnit: number;
  electricityUnitBefore: number;
  InvoicePdfPath?: string;
  ReceiptPdfPath?: string;
  total: number;
  landId: number;
  storeId: number;
  createdAt: Date;
}

export const enum Status {
  SUCCESS = "success",
  PENDING = "pending",
}
