export class Warehouse {
  id?: string;
  homoclave?: string;
  active: boolean;
  almacen?: string;
  cp?: string;
  calle: string;
  colonia: string;
  ciudad: string;
  estado: string;
  telefono: string;
  numero: string;
  suppliersCat: SupplierCat;
}

export class SupplierCat {
  idProveedor: string;
  name: string;
  slug: string;
}
