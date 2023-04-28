import gql from 'graphql-tag';
import { SUPPLIER_FRAGMENT } from '../fragment/supplier';

export const ADD_SUPPLIER = gql`
   mutation addSupplier($supplier: CatalogInput!) {
      addSupplier(supplier: $supplier) {
         status
         message
         supplier {
            ...SupplierObject
         }
      }
   }
   ${SUPPLIER_FRAGMENT}
`;

export const ADD_SUPPLIER_LIST = gql`
   mutation addSuppliers($suppliers: [CatalogInput!]!) {
      addSuppliers(suppliers: $suppliers) {
         status
         message
         suppliers {
            ...SupplierObject
         }
      }
   }
   ${SUPPLIER_FRAGMENT}
`;

export const UPDATE_SUPPLIER = gql`
   mutation updateSupplier($supplier: CatalogInput!) {
      updateSupplier(supplier: $supplier) {
         status
         message
         supplier {
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
