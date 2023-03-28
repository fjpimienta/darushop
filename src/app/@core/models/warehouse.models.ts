import { Product } from './product.models';

export class Warehouse {
  id?: string;
  cp: string;
  name: string;
  estado: string;
  latitud: string;
  longitud: string;
  suppliersCat: SupplierCat;
  products: Product[];
}

export class SupplierCat {
  idProveedor: string;
  name: string;
  slug: string;
}
