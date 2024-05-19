import gql from 'graphql-tag';
import { EXISTENCIAPRODUCTOS_FRAGMENT } from '@graphql/operations/fragment/suppliers/ct';

export const EXISTENCIAPRODUCTOSDAISYTEK_LIST_QUERY = gql`
  query existenciaProductoDaisytek($existenciaProducto: SupplierProdInput) {
    existenciaProductoDaisytek(existenciaProducto: $existenciaProducto) {
      status
      message
      existenciaProductoDaisytek {
        ...ExistenciaProductosObject
      }
    }
  }
  ${EXISTENCIAPRODUCTOS_FRAGMENT}
`;
