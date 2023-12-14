import gql from 'graphql-tag';
import { WELCOME_FRAGMENT } from '../fragment/welcome';

export const WELCOME_QUERY = gql`
  query welcomeByField($email: String!) {
    welcomeByField(email: $email) {
      status
      message
      welcome {
        ...WelcomeObject
      }
    }
  }
  ${WELCOME_FRAGMENT}
`;
