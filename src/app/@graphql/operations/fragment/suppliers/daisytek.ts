import gql from 'graphql-tag';

export const ORDERDAISYTEK_FRAGMENT = gql`
  fragment OrderDaisytekObject on ResponseDaisytekOrder {
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

