import gql from 'graphql-tag';
import { EXISTENCIAPRODUCTOS_FRAGMENT } from '@graphql/operations/fragment/suppliers/ct';

export const EXISTENCIAPRODUCTOSSYSCOM_LIST_QUERY = gql`
  query existenciaProductoSyscom($existenciaProducto: SupplierProdInput) {
    existenciaProductoSyscom(existenciaProducto: $existenciaProducto) {
      status
      message
      existenciaProductoSyscom {
        ...ExistenciaProductosObject
      }
    }
  }
  ${EXISTENCIAPRODUCTOS_FRAGMENT}
`;
