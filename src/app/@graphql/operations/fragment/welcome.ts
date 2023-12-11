import gql from 'graphql-tag';

export const WELCOME_FRAGMENT = gql`
  fragment WelcomeObject on Welcome {
    id
    email
    name
    cupon
  }
`;
