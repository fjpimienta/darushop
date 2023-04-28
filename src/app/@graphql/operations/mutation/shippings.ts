import gql from 'graphql-tag';
import { SHIPPING_FRAGMENT } from '../fragment/shipping';

export const ADD_SHIPPING = gql`
   mutation addShipping($shipping: CatalogInput!) {
      addShipping(shipping: $shipping) {
         status
         message
         shipping {
            ...ShippingObject
         }
      }
   }
   ${SHIPPING_FRAGMENT}
`;

export const ADD_SHIPPING_LIST = gql`
   mutation addShippings($shippings: [CatalogInput!]!) {
      addShippings(shippings: $shippings) {
         status
         message
         shippings {
            ...ShippingObject
         }
      }
   }
   ${SHIPPING_FRAGMENT}
`;

export const UPDATE_SHIPPING = gql`
   mutation updateShipping($shipping: CatalogInput!) {
      updateShipping(shipping: $shipping) {
         status
         message
         shipping {
            ...ShippingObject
         }
      }
   }
   ${SHIPPING_FRAGMENT}
`;

export const BLOCK_SHIPPING = gql`
   mutation blockShipping($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockShipping(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
