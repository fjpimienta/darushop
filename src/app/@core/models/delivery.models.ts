import { Cupon } from './cupon.models';
import { InvoiceConfigInput } from './invoiceConfig.models';
import { ChargeOpenpayInput } from './openpay/_openpay.models';
import { OrderCt } from './suppliers/orderct.models';
import { OrderCva } from './suppliers/ordercva.models';
import { UserInput } from './user.models';
import { Warehouse } from './warehouse.models';

/**
 * Clase de Envios
 */
export class Delivery {
  id?: string;
  deliveryId: string;
  cliente: string;
  cupon?: Cupon;
  discount: number;
  importe: number;
  registerDate?: string;
  user: UserInput;
  chargeOpenpay: ChargeOpenpayInput;
  warehouses: Warehouse[];
  ordersCt?: OrderCt[];
  ordersCva?: OrderCva[];
  invoiceConfig: InvoiceConfigInput;
  statusError: boolean;
  messageError: string;
  status?: string;
  lastUpdate?: string;
}
