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
  Colonia: string;
  Estado: string;
  Ciudad: string;
  Atencion: string;
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
  codigoPostal: number;
  telefono: string;
}

/**
 * Clase interna de Productos CVA
 */
export class ProductoCva {
  clave: string;
  cantidad: number;
}
