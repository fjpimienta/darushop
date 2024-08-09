import gql from 'graphql-tag';
import { EXISTENCIAPRODUCTOS_FRAGMENT } from '@graphql/operations/fragment/suppliers/ct';

export const EXISTENCIAPRODUCTOSINGRAM_LIST_QUERY = gql`
  query existenciaProductoBDI($existenciaProducto: SupplierProdInput) {
    existenciaProductoBDI(existenciaProducto: $existenciaProducto) {
      status
      message
      existenciaProductoBDI {
        ...ExistenciaProductosObject
      }
    }
  }
  ${EXISTENCIAPRODUCTOS_FRAGMENT}
`;
