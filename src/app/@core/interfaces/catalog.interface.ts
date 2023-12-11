export interface ICatalog {
  id?: string;
  description?: string;
  slug?: string;
  active?: boolean;
  order?: number;
  // suppliersCat: ISupplierCat[];
  email?: string;
  name?: string;
  cupon?: string;
}

export interface ISupplierCat {
  id?: string;
  name?: string;
  slug?: string;
}
