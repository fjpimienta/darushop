import gql from 'graphql-tag';

export const CHARGE_OPENPAY_FRAGMENT_OBJECT = gql`
  fragment ChargeOpenpayObject on ChargeOpenpay {
    id
    authorization
    transaction_type
    operation_type
    method
    creation_date
    order_id
    status
    amount
    description
    error_message
    customer_id
    currency
    card {
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
  }
`;
