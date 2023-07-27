import gql from 'graphql-tag';
import { BRANDSCVA_FRAGMENT, GROUPSCVA_FRAGMENT, PAQUETERIASCVA_FRAGMENT, PRODUCTOSCVA_FRAGMENT, SHIPMENTS_CVA_RATES_FRAGMENT, SOLUCIONESCVA_FRAGMENT, SUCURSALESCVA_FRAGMENT } from '../../fragment/suppliers/cva';

export const BRANDSCVA_LIST_QUERY = gql`
  query listBrandsCva {
    listBrandsCva {
      status
      message
      listBrandsCva {
        ...BrandsCvaObject
      }
    }
  }
  ${BRANDSCVA_FRAGMENT}
`;

export const GROUPSCVA_LIST_QUERY = gql`
  query listGroupsCva {
    listGroupsCva {
      status
      message
      listGroupsCva {
        ...GroupsCvaObject
      }
    }
  }
  ${GROUPSCVA_FRAGMENT}
`;

export const SOLUCIONESCVA_LIST_QUERY = gql`
  query listSolucionesCva {
    listSolucionesCva {
      status
      message
      listSolucionesCva {
        ...SolucionesCvaObject
      }
    }
  }
  ${SOLUCIONESCVA_FRAGMENT}
`;

export const SUCURSALESCVA_LIST_QUERY = gql`
  query listSucursalesCva {
    listSucursalesCva {
      status
      message
      listSucursalesCva {
        ...SucursalCvaObject
      }
    }
  }
  ${SUCURSALESCVA_FRAGMENT}
`;

export const PAQUETERIASCVA_LIST_QUERY = gql`
  query listPaqueteriasCva {
    listPaqueteriasCva {
      status
      message
      listPaqueteriasCva {
        ...PaqueteriasCvaObject
      }
    }
  }
  ${PAQUETERIASCVA_FRAGMENT}
`;

export const SHIPMENTS_CVA_RATES_QUERY = gql`
  query shippingCvaRates(
  $paqueteria: Int
  $cp: Int
  $cp_sucursal: Int
  $productosCva: [ProductsShipmentCvaInput]
) {
    shippingCvaRates(
    paqueteria: $paqueteria
    cp: $cp
    cp_sucursal: $cp_sucursal
    productosCva: $productosCva
  ) {
      status
      message
      shippingCvaRates {
        ...ShippingCvaRatesObject
      }
    }
  }
  ${SHIPMENTS_CVA_RATES_FRAGMENT}
`;

export const PRODUCTOSCVA_LIST_QUERY = gql`
  query listProductsCva {
    listProductsCva {
      status
      message
      listProductsCva {
        ...ProductosCvaObject
      }
    }
  }
  ${PRODUCTOSCVA_FRAGMENT}
`;
