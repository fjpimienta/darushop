import gql from 'graphql-tag';

export const DELIVERY_FRAGMENT = gql`
  fragment DeliveryObject on Delivery {
    id
    deliveryId
    registerDate
    user {
      id
      name
      lastname
      email
      registerdate
      role
      phone
      stripeCustomer
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
      homoclave
      active
      almacen
      cp
      calle
      colonia
      ciudad
      estado
      telefono
      numero
      suppliersCat {
        idProveedor
        name
        slug
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
