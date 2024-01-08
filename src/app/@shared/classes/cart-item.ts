import { Product } from './product';

export interface CartItem extends Product {
  qty: number;
  sum: number;
  assignedBranchId: boolean;
  fecha: string;
}
