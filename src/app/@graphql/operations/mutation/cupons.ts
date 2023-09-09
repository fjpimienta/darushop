import gql from 'graphql-tag';
import { CUPON_FRAGMENT } from 'src/app/@graphql/operations/fragment/cupon';

export const ADD_CUPON = gql`
   mutation addCupon($cupon: CatalogInput!) {
      addCupon(cupon: $cupon) {
         status
         message
         cupon {
            ...CuponObject
         }
      }
   }
   ${CUPON_FRAGMENT}
`;

export const ADD_CUPON_LIST = gql`
   mutation addCupons($cupons: [CatalogInput!]!, $supplier: SupplierInput) {
      addCupons(cupons: $cupons, supplier: $supplier) {
         status
         message
         cupons {
            ...CuponObject
         }
      }
   }
   ${CUPON_FRAGMENT}
`;

export const UPDATE_CUPON = gql`
   mutation updateCupon($cupon: CatalogInput!) {
      updateCupon(cupon: $cupon) {
         status
         message
         cupon {
            ...CuponObject
         }
      }
   }
   ${CUPON_FRAGMENT}
`;

export const BLOCK_CUPON = gql`
   mutation blockCupon($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockCupon(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
