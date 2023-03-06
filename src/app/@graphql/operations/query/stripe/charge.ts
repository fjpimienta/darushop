import { CHARGE_FRAGMENT_OBJECT } from '../../fragment/stripe/charge'
import gql from "graphql-tag";

export const CHARGES_CUSTOMERS_LIST = gql`
   query obtenerPagosDeCliente(
      $customer: ID!,
      $limit: Int,
      $startingAfter: ID,
      $endingBefore: ID
   ) {
      chargesByCustomer(customer: $customer,
         limit: $limit,
         startingAfter: $startingAfter,
         endingBefore: $endingBefore
      ) {
         status
         message
         hasMore
         charges {
            ...ChargeObject
         }
      }
   }
   ${CHARGE_FRAGMENT_OBJECT}
`;
