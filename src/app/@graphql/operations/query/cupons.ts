import gql from 'graphql-tag';
import { CUPON_FRAGMENT } from '../fragment/cupon';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const CUPONS_LIST_QUERY = gql`
  query cuponList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
    cupons(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      cupons {
        ...CuponObject
      }
    }
  }
  ${CUPON_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const CUPON_QUERY = gql`
   query cuponData($cupon: String!) {
      cupon(cupon: $cupon){
         status
         message
         cupon {
            ...CuponObject
         }
      }
   }
   ${CUPON_FRAGMENT}
`;

export const CUPON_ID_QUERY = gql`
query {
   cuponId{
      status
      message
      cuponId
   }
}
`;
