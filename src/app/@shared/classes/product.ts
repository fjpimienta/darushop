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
  brand?: string;
  brands?: Array<{
    name?: string;
    slug?: string;
  }>;
  model: string;
  peso: number;
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
      id: string;
      name: string;
      estado: string;
      cantidad: number;
      cp: string;
      latitud: string;
      longitud: string;
    }>
  };
  promociones: {
    clave_promocion: string;
    descripcion_promocion: string;
    inicio_promocion: string;
    vencimiento_promocion: string;
    disponible_en_promocion: number;
  }
}
