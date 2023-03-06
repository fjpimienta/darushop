export class Catalog {
  id: string;
  description: string;
  slug: string;
  active: boolean;
  param: {
    category: string,
    description: string
  };
}

export class AddCatalog {
  tipo: string;
  item: Catalog;
  list: Catalog[];
  suppliersCat: SupplierCat;
}

export class SupplierCat {
  idProveedor: string;
  name: string;
  slug: string;
}
