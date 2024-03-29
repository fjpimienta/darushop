import gql from 'graphql-tag';

export const ORDERCVA_FRAGMENT_X = gql`
   fragment OrdercvaObject on OrderCva {
    NumOC
    Paqueteria
    CodigoSucursal
    PedidoBO
    Observaciones
    productos{
      clave
      cantidad
    }
    TipoFlete
    Calle
    Numero
    NumeroInt
    CP
    Colonia
    Estado
    Ciudad
    Atencion
   }
`;
