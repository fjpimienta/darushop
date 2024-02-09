import gql from 'graphql-tag';

export const DELIVERY_FRAGMENT = gql`
    fragment DeliveryObject on Delivery {
      id
      deliveryId
      cliente
      cupon {
        id
        cupon
        description
        typeDiscount
        amountDiscount
        minimumPurchase
        active
      }
      discount
      importe
      registerDate
      lastUpdate
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
      chargeOpenpay {
        id
        authorization
        transaction_type
        operation_type
        method
        creation_date
        operation_date
        order_id
        status
        amount
        description
        error_message
        customer_id
        currency
        bank_account {
          clabe
          holder_name
          alias
          bank_name
        }
        card {
          id
          type
          card_number
          holder_name
          expiration_year
          expiration_month
          allows_charges
          allows_payouts
          creation_date
          bank_name
          customer_id
          bank_code
        }
        payment_method {
          type
          url
          agreement
          bank
          clabe
          name
        }
        conciliated
        customer {
          id
          creation_date
          name
          last_name
          email
          phone_number
          bank_name
          external_id
          status
          balance
          address {
            line1
            line2
            line3
            postal_code
            state
            city
            country_code
          }
          store {
            reference
            barcode_url
          }
          clabe
        }
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
          cantidad
          sale_price
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
            cantidad
            sale_price
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
            inicio_promocion
            vencimiento_promocion
            disponible_en_promocion
          }
        }
        productShipments {
          producto
          cantidad
          precio
          priceSupplier
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
          lugarEnvio
          lugarRecepcion
        }
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
        orderCvaResponse {
          error
          estado
          pedido
          total
          agentemail
          almacenmail
        }
      }
      invoiceConfig {
        factura
        nombres
        apellidos
        nombreEmpresa
        rfc
        codigoPostal
        formaPago {
          id
          descripcion
        }
        metodoPago {
          id
          descripcion
        }
        regimenFiscal {
          id
          descripcion
          fisica
          moral
        }
        usoCFDI {
          id
          descripcion
          aplicaParaTipoPersonaFisica
          aplicaParaTipoPersonaMoral
        }
      }
      statusError
      messageError
      status
      lastUpdate
    }
`;
