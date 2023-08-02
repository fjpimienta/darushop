import { CUSTOMER_OPENPAY_FRAGMENT_OBJECT } from '@graphql/operations/fragment/openpay/customer';
import gql from "graphql-tag";

export const LIST_CUSTOMERS_OPENPAY = gql`
   query listCustomersOpenpay {
    listCustomersOpenpay {
      status
      message
      listCustomersOpenpay {
        ...CustomerOpenpayObject
      }
    }
  }
  ${CUSTOMER_OPENPAY_FRAGMENT_OBJECT}
`;

export const ONE_CUSTOMER_OPENPAY = gql`
   query customerOpenpay($idCustomerOpenpay: String) {
    customerOpenpay(idCustomerOpenpay: $idCustomerOpenpay) {
      status
      message
      customerOpenpay {
        ...CustomerOpenpayObject
      }
    }
  }
  ${CUSTOMER_OPENPAY_FRAGMENT_OBJECT}
`;

export const ADD_CUSTOMER_OPENPAY = gql`
  query($customerOpenpay: CustomerOpenpayInput) {
    customerOpenpay(customerOpenpay: $customerOpenpay) {
        status
        message
        customerOpenpay {
          ...CustomerOpenpayObject
        }
    }
    ${CUSTOMER_OPENPAY_FRAGMENT_OBJECT}
  }
`;

export const UPDATE_CUSTOMER_OPENPAY = gql`
  query($idCustomerOpenpay: String,
    $customerOpenpay: CustomerOpenpayInput) {
    customerOpenpay(idCustomerOpenpay: $idCustomerOpenpay,
      customerOpenpay: $customerOpenpay) {
        status
        message
        customerOpenpay {
          ...CustomerOpenpayObject
        }
    }
    ${CUSTOMER_OPENPAY_FRAGMENT_OBJECT}
  }
`;
