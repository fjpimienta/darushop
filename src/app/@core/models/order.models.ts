import { UserInput } from './user.models';
import { ChargeInput } from './charge.models';
import { CartItem } from '@shared/classes/cart-item';

export class OrderInput {
  id: string;
  name?: string;
  registerDate?: string;
  user: UserInput;
  charge?: ChargeInput;
  cartitems: CartItem[];
}
