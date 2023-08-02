import gql from 'graphql-tag';

export const CUSTOMER_OPENPAY_FRAGMENT_OBJECT = gql`
  fragment CustomerOpenpayObject on CustomerOpenpay {
    id
    creation_date
    name
    last_name
    email
    phone_number
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
`;
