import gql from 'graphql-tag';

export const GROUP_FRAGMENT = gql`
  fragment GroupObject on Group {
    id
    description
    slug
    active
  }
`;
