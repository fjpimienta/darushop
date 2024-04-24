import { IOrderSyscomResponse } from '@core/interfaces/suppliers/orderSyscom.interface';

export class Shipment {
  empresa: string;
  metodoShipping: string;
  costo: number;
  lugarEnvio: string;
  lugarRecepcion: string;
}

export class ShipmentSyscom {
  empresa: string;
  metodoShipping: string;
  costo: number;
  lugarEnvio: string;
  lugarRecepcion: string;
  orderSyscom: IOrderSyscomResponse;
}
