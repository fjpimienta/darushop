import gql from 'graphql-tag';
import { ORDERCT_FRAGMENT, PRODUCTOSCT_FRAGMENT, SHIPMENTS_CT_RATES_FRAGMENT, TOKENCT_FRAGMENT } from '@graphql/operations/fragment/suppliers/ct';

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

export const 
ADD_ORDER_CT = gql`
  query orderCt {
    orderCt {
      status
      message
      orderCt {
        ...OrderCtObject
      }
    }
  }
  ${ORDERCT_FRAGMENT}
`;
