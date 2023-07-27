import gql from 'graphql-tag';
import { ORDERCVA_FRAGMENT } from '@graphql/operations/fragment/suppliers/ordercva';

export const ADD_ORDERCVA = gql`
   mutation addOrderCva($ordercva: OrderCvaInput!) {
      addOrderCva(ordercva: $ordercva) {
         status
         message
         orderCva {
            ...OrderCvaObject
         }
      }
   }
   ${ORDERCVA_FRAGMENT}
`;
