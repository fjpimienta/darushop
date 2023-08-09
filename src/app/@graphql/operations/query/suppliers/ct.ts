import gql from 'graphql-tag';
import { CONFIRM_ORDERCT_FRAGMENT, ORDERCT_FRAGMENT, PRODUCTOSCT_FRAGMENT, SHIPMENTS_CT_RATES_FRAGMENT, TOKENCT_FRAGMENT } from '@graphql/operations/fragment/suppliers/ct';

export const SHIPMENTS_CT_RATES_QUERY = gql`
  query shippingCtRates(
    $destinoCt: String,
    $productosCt: [ProductShipmentCtInput]
  ) {
    shippingCtRates(
      destinoCt: $destinoCt,
      productosCt: $productosCt
    ) {
      status
      message
      shippingCtRates {
        ...ShippingCtRatesObject
      }
    }
  }
  ${SHIPMENTS_CT_RATES_FRAGMENT}
`;

export const PRODUCTOSCT_LIST_QUERY = gql`
  query stockProductsCt {
    stockProductsCt {
      status
      message
      stockProductsCt {
        ...ProductosCtObject
      }
    }
  }
  ${PRODUCTOSCT_FRAGMENT}
`;

export const ADD_ORDER_CT = gql`
  query orderCt(
    $idPedido: Int
    $almacen: String
    $tipoPago: String
    $guiaConnect: GuiaConnectInput
    $envio: [EnvioInput]
    $productoCt: [ProductoCtInput]
    $cfdi: String
    ) {
      orderCt(
      idPedido: $idPedido
      almacen: $almacen
      tipoPago: $tipoPago
      guiaConnect: $guiaConnect
      envio: $envio
      productoCt: $productoCt
      cfdi: $cfdi
    ) {
      status
      message
      orderCt {
        ...OrderCtObject
      }
    }
  }
  ${ORDERCT_FRAGMENT}
`;

export const CONFIRM_ORDER_CT = gql`
  query confirmOrderCt(
    $folio: String
  ) {
    confirmOrderCt(folio: $folio) {
      status
      message
      confirmOrderCt {
        ...ConfirmOrderCtObject
      }
    }
  }
  ${CONFIRM_ORDERCT_FRAGMENT}
`;
