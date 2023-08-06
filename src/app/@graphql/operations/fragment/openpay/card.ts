import gql from 'graphql-tag';

export const CARD_OPENPAY_FRAGMENT_OBJECT = gql`
  fragment CardOpenpayObject on CardOpenpay {
    id
    type
    card_number
    holder_name
    expiration_year
    expiration_month
    allows_charges
    allows_payouts
    creation_date
    bank_name
    customer_id
    bank_code
  }
`;
