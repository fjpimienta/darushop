import gql from 'graphql-tag';
import { ORDER_FRAGMENT } from 'src/app/@graphql/operations/fragment/order';

export const ADD_ORDER = gql`
   mutation addOrder($order: OrderInput!) {
      addOrder(order: $order) {
         status
         message
         order {
            ...OrderObject
         }
      }
   }
   ${ORDER_FRAGMENT}
`;

export const ADD_ORDER_LIST = gql`
   mutation addOrders($orders: [OrderInput!]!) {
      addOrders(orders: $orders) {
         status
         message
         orders {
            ...OrderObject
         }
      }
   }
   ${ORDER_FRAGMENT}
`;

export const UPDATE_ORDER = gql`
   mutation updateOrder($order: OrderInput!) {
      updateOrder(order: $order) {
         status
         message
         order {
            ...OrderObject
         }
      }
   }
   ${ORDER_FRAGMENT}
`;

export const BLOCK_ORDER = gql`
   mutation blockOrder($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockOrder(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
