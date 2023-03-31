import { Product } from './product.models';

export class CartItemInput extends Product {
  qty: number;
  sum: number;
}
