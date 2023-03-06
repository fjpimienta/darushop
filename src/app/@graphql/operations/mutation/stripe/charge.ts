import { CHARGE_FRAGMENT_OBJECT } from '@graphql/operations/fragment/stripe/charge';
import gql from 'graphql-tag';

export const CREATE_PAY_ORDER = gql`
   mutation pagarPedido($payment: ChargeInput!, $order: OrderInput!) {
      chargeOrder(payment: $payment, order: $order) {
         status
         message
         charge {
            ...ChargeObject
         }
      }
   }
   ${CHARGE_FRAGMENT_OBJECT}
`;
