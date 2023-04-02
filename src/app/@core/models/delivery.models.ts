import { Product } from './product.models';
import { UserInput } from './user.models';
import { Warehouse } from './warehouse.models';

export class Delivery {
  id: string;
  registerDate?: string;
  user: UserInput;
  warehouses: Warehouse[];
}
