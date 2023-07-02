/**
 * Clase de Productos Enviados.
 */
export class ProductShipmentCVA {
  clave: string;
  cantidad: number;
}

export class ProductShipmentCT {
  producto: string;
  cantidad: number;
  precio: number;
  moneda: string;
  almacen: string;
}

export class ProductShipment extends ProductShipmentCVA {
  producto: string;
  precio: number;
  priceSupplier: number;
  moneda: string;
  almacen: string;
  cp: string;
  name: string;
  total: number;
}
