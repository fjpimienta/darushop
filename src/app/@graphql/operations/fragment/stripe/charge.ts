import gql from 'graphql-tag';

export const CHARGE_FRAGMENT_OBJECT = gql`
   fragment ChargeObject on StripeCharge {
      id
      amount
      status
      receipt_email
      receipt_url
      paid
      created
      typeOrder
      description
      card
      customer
   }
`;
