/**
 * Clase del Catalogo Maestro.
 */
export class Catalog {
  id: string;
  description: string;
  slug: string;
  active: boolean;
  total?: number;
  param: {
    category: string,
    description: string
  };
}

/**
 * Clase del envio de datos en el catalogo maestro.
 */
export class AddCatalog {
  tipo: string;
  item: Catalog;
  list: Catalog[];
  suppliersCat: SupplierCat;
}

/**
 * Clase de Proveedor del catalogo.
 */
export class SupplierCat {
  idProveedor: string;
  name: string;
  slug: string;
}
