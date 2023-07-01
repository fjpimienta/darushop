import gql from 'graphql-tag';
import { ORDERCT_FRAGMENT } from '@graphql/operations/fragment/suppliers/orderct';

export const ADD_ORDERCT = gql`
   mutation addOrderCt($orderct: OrderCtInput!) {
      addOrderCt(orderct: $orderct) {
         status
         message
         orderct {
            ...OrderCtObject
         }
      }
   }
   ${ORDERCT_FRAGMENT}
`;
