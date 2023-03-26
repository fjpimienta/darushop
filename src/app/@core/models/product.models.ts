export class Product {
  id?: number;
  name?: string;
  slug?: string;
  short_desc?: string;
  price: number;
  sale_price: number;
  review: number;
  ratings: number;
  until: string;
  stock: number;
  top: boolean;
  featured: boolean;
  new: boolean;
  // author: string;
  // sold: string;
  category: Categorys[];
  brands?: Brands[];
  pictures: Picture[];
  sm_pictures: Picture[];
  variants?: Variant[];
  // active: boolean;
  suppliersProd: SupplierProd;
}

export class Categorys {
  name: string;
  slug: string;
  pivot: PivotCategory;
}

export class PivotCategory {
  product_id: string;
  product_category_id: string;
}

export class Brands {
  name?: string;
  slug?: string;
  // pivot: PivotBrand;
}

export class PivotBrand {
  product_id: string;
  brand_id: string;
}

export class Picture {
  width: string;
  height: string;
  url: string;
  // pivot: PivotePicture;
}

export class PivotePicture {
  related_id: string;
  upload_file_id: string;
}

export class Variant {
  id: number;
  color: string;
  color_name: string;
  price: number;
  pivot: PivoteVariant;
  size: Size[];
}

export class PivoteVariant {
  product_id: string;
  component_id: string;
}

export class Size {
  id: number;
  name: string;
  slug: string;
  pivot: PivoteSize;
}

export class PivoteSize {
  components_variants_variant_id: string;
  component_id: string;
}


export class AddProduct {
  tipo: string;
  item: Product;
  list: Product[];
  suppliersProd?: SupplierProd;
  files?: File[];
}

export class SupplierProd {
  idProveedor: string;
  codigo: string;
  price: number;
  moneda: string;
  branchOffices: BranchOffices[];
}

export class BranchOffices {
  name: string;
  estado: string;
  cantidad: number;
  cp: string;
  latitud: string;
  longitud: string;
}
