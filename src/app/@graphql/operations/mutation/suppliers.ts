import gql from 'graphql-tag';
import { SUPPLIER_FRAGMENT } from '../fragment/supplier';

export const ADD_SUPPLIER = gql`
   mutation addSupplier($suppiler: CatalogInput!) {
      addSupplier(suppiler: $suppiler) {
         status
         message
         suppiler {
            ...SupplierObject
         }
      }
   }
   ${SUPPLIER_FRAGMENT}
`;

export const ADD_SUPPLIER_LIST = gql`
   mutation addSuppliers($suppilers: [CatalogInput!]!) {
      addSuppliers(suppilers: $suppilers) {
         status
         message
         suppilers {
            ...SupplierObject
         }
      }
   }
   ${SUPPLIER_FRAGMENT}
`;

export const UPDATE_SUPPLIER = gql`
   mutation updateSupplier($suppiler: CatalogInput!) {
      updateSupplier(suppiler: $suppiler) {
         status
         message
         suppiler {
            ...SupplierObject
         }
      }
   }
   ${SUPPLIER_FRAGMENT}
`;

export const BLOCK_SUPPLIER = gql`
   mutation blockSupplier($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockSupplier(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
