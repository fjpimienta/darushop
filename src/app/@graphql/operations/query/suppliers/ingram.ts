import gql from 'graphql-tag';
import { EXISTENCIAPRODUCTOS_FRAGMENT } from '@graphql/operations/fragment/suppliers/ct';
import { ORDERINGRAM_FRAGMENT, SHIPMENTS_INGRAM_RATES_FRAGMENT } from '@graphql/operations/fragment/suppliers/ingram';

export const EXISTENCIAPRODUCTOSINGRAM_LIST_QUERY = gql`
  query existenciaProductoBDI($existenciaProducto: SupplierProdInput) {
    existenciaProductoBDI(existenciaProducto: $existenciaProducto) {
      status
      message
      existenciaProductoBDI {
        ...ExistenciaProductosObject
      }
    }
  }
  ${EXISTENCIAPRODUCTOS_FRAGMENT}
`;

export const SHIPMENTS_INGRAM_RATES_QUERY = gql`
  query shippingIngramRates($shippingBdiInput: ShippingBDIInput) {
    shippingIngramRates(shippingBdiInput: $shippingBdiInput) {
      status
      message
      shippingIngramRates {
        ...shippingBDIObject
      }
    }
  }
  ${SHIPMENTS_INGRAM_RATES_FRAGMENT}
`;

export const ORDERINGRAM_DATA_QUERY = gql`
  query orderIngramBDI($orderIngramBdi: OrderIngramInput) {
    orderIngramBDI(orderIngramBdi: $orderIngramBdi) {
      status
      message
      orderIngramBDI {
        ...orderBDIObject
      }
    }
  }
  ${ORDERINGRAM_FRAGMENT}
`;
