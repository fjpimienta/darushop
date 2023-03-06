export interface ICatalog {
  id: string;
  description: string;
  slug: string;
  active: boolean;
  // suppliersCat: ISupplierCat[];
}

export interface ISupplierCat {
  id?: string;
  name?: string;
  slug?: string;
}
