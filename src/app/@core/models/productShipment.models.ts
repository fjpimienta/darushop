/**
 * Clase de Productos Enviados.
 */
export class ProductShipmentCVA {
  clave: string;
  cantidad: number;
}

export class ProductShipment extends ProductShipmentCVA {
  producto: string;
  precio: number;
  moneda: string;
  almacen: string;
  cp: string;
  name: string;
  total: number;
}
