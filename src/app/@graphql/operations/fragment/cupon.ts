import gql from 'graphql-tag';

export const CUPON_FRAGMENT = gql`
  fragment CuponObject on Cupon {
    id
    description
    slug
    order
    active
  }
`;
