import { Product } from './product.models';

/**
 * Clase del Carrito de compras. Hereda de Productos.
 */
export class CartItemInput extends Product {
  qty: number;
  sum: number;
}
