import gql from 'graphql-tag';
import { CATEGORIE_FRAGMENT } from 'src/app/@graphql/operations/fragment/categorie';

export const ADD_CATEGORIE = gql`
  mutation addCategorie($categorie: CatalogInput!) {
    addCategorie(categorie: $categorie) {
      status
      message
      categorie {
        ...CategorieObject
      }
    }
  }
  ${CATEGORIE_FRAGMENT}
`;

export const ADD_CATEGORIE_LIST = gql`
   mutation addCategories($categories: [CatalogInput!]!, $supplier: SupplierInput) {
      addCategories(categories: $categories, supplier: $supplier) {
         status
         message
         categories {
            ...CategorieObject
         }
      }
   }
   ${CATEGORIE_FRAGMENT}
`;

export const UPDATE_CATEGORIE = gql`
   mutation updateCategorie($categorie: CatalogInput!) {
      updateCategorie(categorie: $categorie) {
         status
         message
         categorie {
            ...CategorieObject
         }
      }
   }
   ${CATEGORIE_FRAGMENT}
`;

export const BLOCK_CATEGORIE = gql`
   mutation blockCategorie($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockCategorie(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
