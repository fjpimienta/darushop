import gql from 'graphql-tag';
import { PRODUCT_FRAGMENT } from 'src/app/@graphql/operations/fragment/product';

export const ADD_PRODUCT = gql`
   mutation addProduct($product: ProductInput!) {
      addProduct(product: $product) {
         status
         message
         product {
            ...ProductObject
         }
      }
   }
   ${PRODUCT_FRAGMENT}
`;

export const ADD_PRODUCT_LIST = gql`
   mutation addProducts($products: [ProductInput!]!) {
      addProducts(products: $products) {
         status
         message
         products {
            ...ProductObject
         }
      }
   }
   ${PRODUCT_FRAGMENT}
`;

export const UPDATE_PRODUCT = gql`
   mutation updateProduct($product: ProductInput!) {
      updateProduct(product: $product) {
         status
         message
         product {
            ...ProductObject
         }
      }
   }
   ${PRODUCT_FRAGMENT}
`;

export const BLOCK_PRODUCT = gql`
   mutation blockProduct($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockProduct(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
