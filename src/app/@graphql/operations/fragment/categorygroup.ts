import gql from 'graphql-tag';

export const CATEGORYGROUP_FRAGMENT = gql`
  fragment CategoryGroupObject on CategoryGroup {
    _id {
      name
      slug
    }
    total
  }
`;
