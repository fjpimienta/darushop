/**
 * Clase de Ordenes para CT
 */
export class OrderCt {
  idPedido: number;
  almacen: string;
  tipoPago: string;
  envio: EnvioCt[];
  producto: ProductoCt[];
  cfdi: string;
}

/**
 * Clase de Envios para CT
 */
export class EnvioCt {
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
 * Clase interna de Productos CT
 */
export class ProductoCt {
  cantidad: number;
  clave: string;
  precio: number;
  moneda: string;
}
