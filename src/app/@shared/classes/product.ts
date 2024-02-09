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
  subCategory: Array<{
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
    cantidad: number;
    sale_price: number;
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
  generalInfo: {
    IcecatId: number
    ReleaseDate: string;
    EndOfLifeDate: string;
    Title: string;
    TitleInfo: {
      GeneratedIntTitle: string;
      GeneratedLocalTitle: {
        Value: string;
        Language: string;
      }
      BrandLocalTitle: {
        Value: string;
        Language: string;
      }
    }
    Brand: string;
    BrandID: string;
    BrandLogo: string;
    BrandInfo: {
      BrandName: string;
      BrandLocalName: string;
      BrandLogo: string;
    }
    ProductName: string;
    ProductNameInfo: {
      ProductIntName: string;
      ProductLocalName: {
        Value: string;
        Language: string;
      }
    }
    BrandPartCode: string;
    GTIN: [string];
    Category: {
      CategoryID: string;
      Name: {
        Value: string;
        Language: string;
      }
    }
    ProductFamily: {
      empty: string;
    }
    ProductSeries: {
      SeriesID: string;
    }
    Description: {
      empty: string;
    }
    SummaryDescription: {
      ShortSummaryDescription: string;
      LongSummaryDescription: string;
    }
    BulletPoints: {
      BulletPointsId: string;
      Language: string;
      Values: [string];
    }
    GeneratedBulletPoints: {
      Language: string;
      Values: [string];
    }
  }
}
