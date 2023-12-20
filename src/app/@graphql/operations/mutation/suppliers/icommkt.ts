import gql from 'graphql-tag';
import { ICOMMKT_CONTACT_FRAGMENT } from '@graphql/operations/fragment/suppliers/icommkt';

export const ADD_ICOMMKT = gql`
  mutation addContact($icommkContactInput: IcommkContactInput!) {
    addContact(icommkContactInput: $icommkContactInput) {
      status
      message
      addContact {
        ...icommktContactObject
      }
    }
  }
  ${ICOMMKT_CONTACT_FRAGMENT}
`;
