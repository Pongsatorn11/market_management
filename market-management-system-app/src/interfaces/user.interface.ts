export interface IUser {
  id: number;
  imagePath?: string;
  firstName: string;
  lastName: string;
  username: string;
  hashPassword?: string;
  email: string;
  address: string;
  phoneNumber: string;
  isOwner: boolean;
  landId: number | null;
  storeId: number | null;
  createAt: Date;
}