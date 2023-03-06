import gql from 'graphql-tag';
import { CUSTOMER_FRAGMENT } from '@graphql/operations/fragment/stripe/customer';

export const CUSTOMER_QUERY = gql`
  query getCustomerByEmail($email: String!) {
    customerByEmail(email: $email) {
      status
      message
      customer {
        ...CustomerObject
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
`;
