import gql from 'graphql-tag';
import { EXISTENCIAPRODUCTOS_FRAGMENT } from '@graphql/operations/fragment/suppliers/ct';

export const EXISTENCIAPRODUCTOSINGRAM_LIST_QUERY = gql`
  query existenciaProductoIngram($existenciaProducto: SupplierProdInput) {
    existenciaProductoIngram(existenciaProducto: $existenciaProducto) {
      status
      message
      existenciaProductoIngram {
        ...ExistenciaProductosObject
      }
    }
  }
  ${EXISTENCIAPRODUCTOS_FRAGMENT}
`;
