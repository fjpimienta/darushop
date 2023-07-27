import gql from 'graphql-tag';

export const TOKENCT_FRAGMENT = gql`
  fragment TokenCtObject on TokenCt {
    token
    time
  }
`;

export const SHIPMENTS_CT_RATES_FRAGMENT = gql`
  fragment ShippingCtRatesObject on ResponseCtsShipping {
    codigo
    mensaje
    referencia
    respuesta {
      cotizaciones {
        empresa
        total
        metodo
      }
      errores {
        errorCode
        errorMessage
        errorReference
      }
    }
  }
`;

export const PRODUCTOSCT_FRAGMENT = gql`
  fragment ProductosCtObject on ResponseCtsStockProducts {
    precio
    moneda
    almacenes {
      almacenPromocion {
        key
        value
        promocionString
      }
    }
    codigo
  }
`;

export const ORDERCT_FRAGMENT = gql`
  fragment OrderCtObject on ResponseCtsOrder {
    codigo
    mensaje
    referencia
    respuesta {
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
  }
`;
