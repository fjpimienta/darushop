import gql from 'graphql-tag';

export const CHARGE_OPENPAY_FRAGMENT_OBJECT = gql`
  fragment ChargeOpenpayObject on ChargeOpenpay {
    id
    authorization
    transaction_type
    operation_type
    method
    creation_date
    operation_date
    order_id
    status
    amount
    description
    error_message
    customer_id
    currency
    redirect_url
    bank_account {
      clabe
      holder_name
      alias
      bank_name
    }
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
    payment_method {
      type
      url
      agreement
      bank
      clabe
      name
    }
    conciliated
    customer {
      id
      creation_date
      name
      last_name
      email
      phone_number
      bank_name
      external_id
      status
      balance
      address {
        line1
        line2
        line3
        postal_code
        state
        city
        country_code
      }
      store {
        reference
        barcode_url
      }
      clabe
    }
  }
`;
