import gql from 'graphql-tag';
import { CONFIG_FRAGMENT } from '../fragment/config';

export const CONFIG_QUERY = gql`
  query config($id: ID!) {
    config(id: $id) {
      status
      message
      config {
        ...ConfigObject
      }
    }
  }
  ${CONFIG_FRAGMENT}
`;
