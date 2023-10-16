import gql from 'graphql-tag';

export const PRODUCT_FRAGMENT = gql`
  fragment ProductObject on Product {
    id
    name
    slug
    short_desc
    price
    sale_price
    review
    ratings
    until
    stock
    top
    featured
    new
    author
    sold
    partnumber
    sku
    upc
    category {
      name
      slug
      pivot {
        product_id
        product_category_id
      }
    }
    subCategory {
      name
      slug
      pivot {
        product_id
        product_category_id
      }
    }
    brand
    brands {
      name
      slug
      pivot {
        product_id
        brand_id
      }
    }
    model
    peso
    pictures {
      width
      height
      url
      pivot {
        related_id
        upload_file_id
      }
    }
    sm_pictures {
      width
      height
      url
      pivot {
        related_id
        upload_file_id
      }
    }
    variants {
      id
      color
      color_name
      price
      pivot {
        product_id
        component_id
      }
      size {
        id
        name
        slug
        pivot {
          components_variants_variant_id
          component_id
        }
      }
    }
    unidadDeMedida {
      id
      name
      slug
    }
    active
    suppliersProd {
      idProveedor
      codigo
      price
      moneda
      branchOffices {
        id
        name
        estado
        cantidad
        cp
        latitud
        longitud
      }
    }
    descuentos {
      total_descuento
      moneda_descuento
      precio_descuento
    }
    promociones {
      clave_promocion
      descripcion_promocion
      vencimiento_promocion
      disponible_en_promocion
    }
    generalInfo {
      IcecatId
      ReleaseDate
      EndOfLifeDate
      Title
      TitleInfo {
        GeneratedIntTitle
        GeneratedLocalTitle {
          Value
          Language
        }
        BrandLocalTitle {
          Value
          Language
        }
      }
      Brand
      BrandID
      BrandLogo
      BrandInfo {
        BrandName
        BrandLocalName
        BrandLogo
      }
      ProductName
      ProductNameInfo {
        ProductIntName
        ProductLocalName {
          Value
          Language
        }
      }
      BrandPartCode
      GTIN
      Category {
        CategoryID
        Name {
          Value
          Language
        }
      }
      ProductFamily {
        empty
      }
      ProductSeries {
        SeriesID
      }
      Description {
        empty
      }
      SummaryDescription {
        ShortSummaryDescription
        LongSummaryDescription
      }
      BulletPoints {
        BulletPointsId
        Language
        Values
      }
      GeneratedBulletPoints {
        Language
        Values
      }
    }
  }
`;
