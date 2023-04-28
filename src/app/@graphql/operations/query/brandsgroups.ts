import gql from 'graphql-tag';
import { BRANDGROUP_FRAGMENT } from '../fragment/brandgroup';

export const BRANDGROUPS_LIST_QUERY = gql`
  query brandsgroups {
    brandsgroups {
      status
      message
      brandsgroups {
        ...BrandGroupObject
      }
    }
  }
  ${BRANDGROUP_FRAGMENT}
`;
