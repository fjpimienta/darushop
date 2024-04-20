import { OrderSyscom } from './suppliers/ordersyscom.models';

/**
 * Clase de Paqueterias.
 */
export class Shipment {
  empresa: string;
  metodoShipping: string;
  costo: number;
  lugarEnvio: string;
  lugarRecepcion: string;
  orderSyscom: OrderSyscom[] = [];
}
