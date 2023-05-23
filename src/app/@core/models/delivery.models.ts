import { Product } from './product.models';
import { UserInput } from './user.models';
import { Warehouse } from './warehouse.models';

/**
 * Clase de Envios
 */
export class Delivery {
  id: string;
  registerDate?: string;
  user: UserInput;
  warehouses: Warehouse[];
}
