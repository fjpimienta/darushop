import gql from 'graphql-tag';
import { ORDER_RESPONSE_SYSCOM_FRAGMENT } from '@graphql/operations/fragment/suppliers/syscom';

export const ADD_ORDER_SYSCOM = gql`
   query saveOrderSyscom($orderSyscomInput: OrderSyscomInput!) {
      saveOrderSyscom(orderSyscomInput: $orderSyscomInput) {
         status
         message
         saveOrderSyscom {
            ...OrderResponseSyscomObject
         }
      }
   }
   ${ORDER_RESPONSE_SYSCOM_FRAGMENT}
`;

export const UPDATE_ORDER_SYSCOM = gql`
   query updateOrderSyscom($orderSyscomInput: OrderSyscomInput!) {
      saveOrderSyscom(orderSyscomInput: $orderSyscomInput) {
         status
         message
         saveOrderSyscom {
            ...OrderResponseSyscomObject
         }
      }
   }
   ${ORDER_RESPONSE_SYSCOM_FRAGMENT}
`;
