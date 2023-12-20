import { ICOMMKT_CONTACT_FRAGMENT } from '@graphql/operations/fragment/suppliers/icommkt';
import gql from 'graphql-tag';

export const ICOMMKT_CONTACTS_QUERY = gql`
  query icommktContacts {
    icommktContacts {
        status
        message
        icommktContacts {
          ...icommktContactObject
        }
    }
}
${ICOMMKT_CONTACT_FRAGMENT}
`;

export const ICOMMKT_CONTACT_QUERY = gql`
  query icommktContact($email: String) {
    icommktContact(email: $email) {
        status
        message
        icommktContact {
          ...icommktContactObject
        }
    }
}
${ICOMMKT_CONTACT_FRAGMENT}
`;
