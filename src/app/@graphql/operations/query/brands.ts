import gql from 'graphql-tag';
import { BRAND_FRAGMENT } from '../fragment/brand';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const BRANDS_LIST_QUERY = gql`
  query brandList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
    brands(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      brands {
        ...BrandObject
      }
    }
  }
  ${BRAND_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const BRAND_DATA_QUERY = gql`
   query brandData($include: Boolean!) {
      brands{
         status
         message
         brands {
            ...BrandObject
         }
      }
   }
   ${BRAND_FRAGMENT}
`;

export const BRAND_ID_QUERY = gql`
query {
   brandId{
      status
      message
      brandId
   }
}
`;
