import gql from 'graphql-tag';

export const DELIVERY_FRAGMENT = gql`
  fragment DeliveryObject on Delivery {
    id
    deliveryId
    user {
      id
      name
      lastname
      email
      # password
      # registerdate
      # role
      phone
      # stripeCustomer
      addresses {
        c_pais
        d_pais
        c_estado
        d_estado
        c_mnpio
        d_mnpio
        c_ciudad
        d_ciudad
        d_asenta
        directions
        phone
        references
        d_codigo
        dir_invoice
        dir_delivery
        dir_delivery_main
      }
      policy
    }
    warehouses {
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
      }
      shipments {
        empresa
        metodoShipping
        costo
      }
    }
    ordersCt {
      idPedido
      almacen
      tipoPago
      envio {
        nombre
        direccion
        entreCalles
        noExterior
        colonia
        estado
        ciudad
        codigoPostal
        telefono
      }
      producto {
        cantidad
        clave
        precio
        moneda
      }
    }
    ordersCva {
      NumOC
      Paqueteria
      CodigoSucursal
      PedidoBO
      Observaciones
      productos {
        clave
        cantidad
      }
      TipoFlete
      Calle
      Numero
      NumeroInt
      Colonia
      Estado
      Ciudad
      Atencion
    }
    orderCtResponse {
      pedidoWeb
      tipoDeCambio
      estatus
      errores {
        errorCode
        errorMessage
        errorReference
      }
    }
    orderCvaResponse {
      error
      estado
      pedido
      total
      agentemail
      almacenmail
    }
  }
`;
