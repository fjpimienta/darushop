import gql from 'graphql-tag';

export const WAREHOUSE_FRAGMENT = gql`
  fragment WarehouseObject on Warehouse {
    id
    cp
    name
    estado
    latitud
    longitud
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
    products {
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
      # category {
      #   name
      #   slug
      #   pivot
      # }
      brand
      #brands
      model
      peso
      # pictures {
      #   width
      #   height
      #   url
      #   pivot {
      #     related_id
      #     upload_file_id
      #   }
      # }
      # sm_pictures {
      #   width
      #   height
      #   url
      #   pivot {
      #     related_id
      #     upload_file_id
      #   }
      # }
      # variants {
      #   id
      #   color
      #   color_name
      #   price
      #   pivot
      #   size {
      #     id
      #     name
      #     slug
      #     pivot {
      #       components_variants_variant_id
      #       component_id
      #     }
      #   }
      # }
      unidadDeMedida {
        id
        name
        slug
      }
      active
      # suppliersProd
      # descuentos
      # promociones
    }
    productShipments {
      producto
      cantidad
      precio
      moneda
      almacen
      cp
      name
      total
    }
    shipments {
      empresa
      metodoShipping
      costo
    }
  }
`;
