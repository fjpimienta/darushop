import gql from 'graphql-tag';
import { CATEGORYGROUP_FRAGMENT } from '../fragment/categorygroup';

export const CATEGORYGROUPS_LIST_QUERY = gql`
  query categorysgroups {
    categorysgroups {
      status
      message
      categorysgroups {
        ...CategoryGroupObject
      }
    }
  }
  ${CATEGORYGROUP_FRAGMENT}
`;
