import gql from 'graphql-tag';

export const RESPUESTACT_FRAGMENT = gql`
   fragment RespuestaCtObject on RespuestaCt {
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
