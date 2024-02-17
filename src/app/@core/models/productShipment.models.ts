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

export class ISupplierProd {
  idProveedor: string;
  codigo: string;
  price: number;
  cantidad: number;
  sale_price: number;
  moneda: string;
  branchOffices: IBranchOffices[];
  // category: ICategorys
  // subCategory: ICategorys
}

export class IBranchOffices {
  id: string;
  name: string;
  estado: string;
  cantidad: number;
  cp: string;
  latitud: string;
  longitud: string;
}
