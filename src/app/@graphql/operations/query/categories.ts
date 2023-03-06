import gql from 'graphql-tag';
import { CATEGORIE_FRAGMENT } from '../fragment/categorie';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const CATEGORIES_LIST_QUERY = gql`
  query categorieList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
    categories(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      categories {
        ...CategorieObject
      }
    }
  }
  ${CATEGORIE_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const CATEGORIE_DATA_QUERY = gql`
   query categorieData($include: Boolean!) {
      categorie{
         status
         message
         categorie {
            ...CategorieObject
         }
      }
   }
   ${CATEGORIE_FRAGMENT}
`;

export const CATEGORIE_ID_QUERY = gql`
query {
   categorieId{
      status
      message
      categorieId
   }
}
`;
