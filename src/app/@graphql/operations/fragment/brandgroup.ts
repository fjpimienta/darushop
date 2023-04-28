import gql from 'graphql-tag';

export const BRANDGROUP_FRAGMENT = gql`
  fragment BrandGroupObject on BrandGroup {
    _id {
      name
      slug
    }
    total
  }
`;
