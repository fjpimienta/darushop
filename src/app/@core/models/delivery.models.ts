import { OrderCt } from './suppliers/orderct.models';
import { OrderCtConfirmResponse, OrderCtResponse } from './suppliers/orderctresponse.models';
import { OrderCva } from './suppliers/ordercva.models';
import { OrderCvaResponse } from './suppliers/ordercvaresponse.models';
import { UserInput } from './user.models';
import { Warehouse } from './warehouse.models';

/**
 * Clase de Envios
 */
export class Delivery {
  id: string;
  deliveryId: string;
  cliente: string;
  importe: number;
  registerDate?: string;
  user: UserInput;
  warehouses: Warehouse[];
  ordersCt?: OrderCt[];
  ordersCva?: OrderCva[];
  orderCtResponse?: OrderCtResponse;
  orderCtConfirmResponse?: OrderCtConfirmResponse;
  orderCvaResponse?: OrderCvaResponse;
  statusError: boolean;
  messageError: string;
}
