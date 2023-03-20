import gql from 'graphql-tag';

export const WAREHOUSE_FRAGMENT = gql`
  fragment WarehouseObject on Warehouse {
    id
    homoclave
    active
    almacen
    cp
    calle
    colonia
    ciudad
    estado
    telefono
    numero
  }
`;
