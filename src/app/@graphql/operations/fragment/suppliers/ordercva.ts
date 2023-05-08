import gql from 'graphql-tag';

export const ORDERCVA_FRAGMENT = gql`
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
    Colonia
    Estado
    Ciudad
    Atencion
   }
`;
