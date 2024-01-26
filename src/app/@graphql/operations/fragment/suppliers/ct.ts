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
  fragment OrderCtObject on ResponseCtOrder {
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
`;

export const CONFIRM_ORDERCT_FRAGMENT = gql`
  fragment ConfirmOrderCtObject on ResponseCtsConfirOrder {
    okCode
    okMessage
    okReference
  }
`;

export const STATUS_ORDERCT_FRAGMENT = gql`
fragment StatusOrderCtObject on ResponseCtsStatus {
  status
  folio
  guias {
    guia
    paqueteria
    direccion
    archivo
  }
}
`;
