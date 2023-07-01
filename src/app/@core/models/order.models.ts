import { UserInput } from './user.models';
import { ChargeInput } from './charge.models';
import { CartItem } from '@shared/classes/cart-item';
import { Warehouse } from './warehouse.models';

/**
 * Clase de la Entrada de datos de ordenes.
 */
export class OrderInput {
  id: string;
  name?: string;
  registerDate?: string;
  user: UserInput;
  charge?: ChargeInput;
  cartitems: CartItem[];
  warehouse?: Warehouse[];
}
