import gql from 'graphql-tag';

export const CATEGORIE_FRAGMENT = gql`
  fragment CategorieObject on Categorie {
    id
    description
    slug
    active
  }
`;
