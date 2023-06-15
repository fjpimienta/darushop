import gql from 'graphql-tag';
import { DELIVERY_FRAGMENT } from 'src/app/@graphql/operations/fragment/delivery';

export const ADD_DELIVERY = gql`
   mutation addDelivery($delivery: DeliveryInput!) {
      addDelivery(delivery: $delivery) {
         status
         message
         delivery {
            ...DeliveryObject
         }
      }
   }
   ${DELIVERY_FRAGMENT}
`;

export const UPDATE_DELIVERY = gql`
   mutation updateDelivery($delivery: DeliveryInput!) {
      updateDelivery(delivery: $delivery) {
         status
         message
         delivery {
            ...DeliveryObject
         }
      }
   }
   ${DELIVERY_FRAGMENT}
`;

export const BLOCK_DELIVERY = gql`
   mutation blockDelivery($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockDelivery(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
