export interface Product {
  id?: number;
  name?: string;
  slug?: string;
  price: number;
  sale_price: number;
  review: number;
  ratings: number;
  until: string;
  stock: number;
  top: boolean;
  featured: boolean;
  new: boolean;
  short_desc?: string;
  partnumber: string;
  sku: string;
  upc: string;
  category: Array<{
    name: string;
    slug: string;
    pivot: {
      product_id: string;
      product_category_id: string;
    };
  }>;
  brands?: Array<{
    name?: string;
    slug?: string;
  }>;
  pictures: Array<{
    width: string;
    height: string;
    url: string;
  }>;
  sm_pictures: Array<{
    width: string;
    height: string;
    url: string;
  }>;
  variants: Array<{
    id: number;
    color: string;
    color_name: string;
    price: number;
    pivot: {
      product_id: string;
      component_id: string;
    };
    size: Array<{
      id: number;
      name: string;
      slug: string;
      pivot: {
        components_variants_variant_id: string;
        component_id: string;
      };
    }>
  }>;
  suppliersProd: {
    idProveedor: string;
    codigo: string;
    price: number;
    moneda: string;
    branchOffices: Array<{
      name: string;
      estado: string;
      cantidad: number;
      cp: string;
      latitud: string;
      longitud: string;
    }>
  };
}
