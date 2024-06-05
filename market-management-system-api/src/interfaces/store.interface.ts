
export interface IStore {
  id: number;
  imagePath?: string;
  name: string;
  area: Area;
  details?: string;
  rentPrice: number;
  landId: number;
  userId: number;
  createAt: Date;
}

export enum Area {
  A1 = "a1",
  A2 = "a2",
  A3 = "a3",
  A4 = "a4",
  A5 = "a5",

  B1 = "b1",
  B2 = "b2",
  B3 = "b3",
  B4 = "b4",
  B5 = "b5",
  B6 = "b6",
  B7 = "b7",
  B8 = "b8",

  C1 = "c1",
  C2 = "c2",
  C3 = "c3",
  C4 = "c4",
  C5 = "c5",
  C6 = "c6",
  C7 = "c7",
  C8 = "c8",

  D1 = "d1",
  D2 = "d2",
  D3 = "d3",
  D4 = "d4",
  D5 = "d5",
  D6 = "d6",
  D7 = "d7",
  D8 = "d8",

  E1 = "e1",
  E2 = "e2",
  E3 = "e3",
  E4 = "e4",
  E5 = "e5",
  E6 = "e6",
  E7 = "e7",
  E8 = "e8",

  F1 = "f1",
  F2 = "f2",
  F3 = "f3",
  F4 = "f4",
  F5 = "f5",
}
