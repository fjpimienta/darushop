import gql from 'graphql-tag';

export const ORDERCT_FRAGMENT_X = gql`
   fragment OrderctObject on OrderCt {
      idPedido
      almacen
      tipoPago
      guiaConnect {
        generarGuia
        paqueteria
      }
      envio {
        nombre
        direccion
        entreCalles
        noExterior
        noInterior
        colonia
        estado
        ciudad
        codigoPostal
        telefono
      }
      productoCt {
        cantidad
        clave
        precio
        moneda
      }
      cfdi
   }
`;
