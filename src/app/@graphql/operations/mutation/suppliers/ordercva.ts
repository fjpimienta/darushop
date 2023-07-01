import gql from 'graphql-tag';
import { ORDERCVA_FRAGMENT } from '@graphql/operations/fragment/suppliers/ordercva';

export const ADD_ORDERCVA = gql`
   mutation addOrderCva($ordercva: OrderCtInput!) {
      addOrderCt(ordercva: $ordercva) {
         status
         message
         ordercva {
            ...OrderCvaObject
         }
      }
   }
   ${ORDERCVA_FRAGMENT}
`;
