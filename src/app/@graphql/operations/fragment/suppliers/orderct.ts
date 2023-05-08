import gql from 'graphql-tag';

export const ORDERCT_FRAGMENT = gql`
   fragment OrderctObject on OrderCt {
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
`;
