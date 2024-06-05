import { IStore } from "./store.interface";

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
  createdAt: Date|string;
  updatedAt: Date|string;
  }

  export const enum Status {
    SUCCESS = "success",
    PENDING = "pending",
  }
  
  export interface IStoreAndBill {
    [x: string]: any;
    store: IStore;
    bill: IBill;
  
}