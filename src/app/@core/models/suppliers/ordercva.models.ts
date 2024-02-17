import { OrderCvaResponse } from './ordercvaresponse.models';

/**
 * Clase para pedidos CVA
 */
export class OrderCva {
  NumOC: string;
  Paqueteria: string;
  CodigoSucursal: string;
  PedidoBO: string;
  Observaciones: string;
  productos: ProductoCva[];
  TipoFlete: string;
  Calle: string;
  Numero: string;
  NumeroInt: string;
  CP: string;
  Colonia: string;
  Estado: string;
  Ciudad: string;
  Atencion: string;
  orderCvaResponse?: OrderCvaResponse;
}

/**
 * Clase de Envios para CVA
 */
export class EnvioCVA {
  nombre: string;
  direccion: string;
  entreCalles: string;
  noExterior: string;
  noInterior: string;
  colonia: string;
  estado: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
}

/**
 * Clase interna de Productos CVA
 */
export class ProductoCva {
  clave: string;
  cantidad: number;
}

export class CompraCVA {
  usuario: string;
  pwd: string;
  orden: string;
}
