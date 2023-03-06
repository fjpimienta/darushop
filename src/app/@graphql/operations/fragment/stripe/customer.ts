import gql from 'graphql-tag';

export const CUSTOMER_FRAGMENT = gql`
   fragment CustomerObject on StripeCustomer {
      id
      name
      email
      description
   }
`;
