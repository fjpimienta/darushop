import gql from 'graphql-tag';

export const ICOMMKT_CONTACT_FRAGMENT = gql`
  fragment icommktContactObject on IcommktContact {
    Email
    Status
    CustomFields {
      Key
      Value
    }
  }
`;
