import gql from 'graphql-tag';
import { WELCOME_FRAGMENT } from '../fragment/welcome';

export const ADD_WELCOME = gql`
  mutation addWelcome($welcome: WelcomeInput!) {
    addWelcome(welcome: $welcome) {
       status
       message
        welcome {
          ...WelcomeObject
       }
    }
 }
 ${WELCOME_FRAGMENT}
`;

