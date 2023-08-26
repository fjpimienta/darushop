import gql from 'graphql-tag';

export const WAREHOUSE_FRAGMENT = gql`
  fragment WarehouseObject on Warehouse {
    id
      deliveryId
      user {
        id
        name
        lastname
        email
        active
        phone
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
            outdoorNumber
            interiorNumber
        }
      }
      warehouses {
          id
          cp
          name
          estado
          ciudad
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
            qty
            sum
              id
              name
              slug
              price
              sale_price
              review
              ratings
              until
              stock
              top
              featured
              new
              short_desc
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
                  pivot
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
              unidadDeMedida
              active
              suppliersProd
              descuentos
              promociones
              registerDate
          }
          productShipments
          shipments
      }
      ordersCt {
          idPedido
          almacen
          tipoPago
          guiaConnect {
              generarGuia
  						paqueteria
          }
          envio {
            nombre
            direccion
            entreCalles
            noExterior
            noInterior
            colonia
            estado
            ciudad
            codigoPostal
            telefono
          }
          productoCt {
            cantidad
            clave
            precio
            moneda
          }
          cfdi
          respuestaCT {
            okCode
            okMessage
            okReference
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
        CP
        Colonia
        Estado
        Ciudad
        Atencion
      }
      orderCtResponse {
        pedidoWeb
        fecha
        tipoDeCambio
        estatus
        errores {
          errorCode
          errorMessage
          errorReference
        }
      }
      orderCtConfirmResponse {
        okCode
        okMessage
        okReference
      }
      orderCvaResponse {
        error
        estado
        pedido
        total
        agentemail
        almacenmail
      }
      statusError
      messageError
  }
`;
