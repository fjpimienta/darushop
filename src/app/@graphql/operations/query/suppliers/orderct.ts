import gql from 'graphql-tag';
import { RESULT_INFO_FRAGMENT } from '../../fragment/result-info';
import { ORDERCT_FRAGMENT } from '@graphql/operations/fragment/suppliers/ct';

export const ORDERCTS_LIST_QUERY = gql`
  query orderCtsList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String = "") {
    orderCts(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      orderCts {
        ...OrderCtObject
      }
    }
  }
  ${ORDERCT_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const ORDERCT_DATA_QUERY = gql`
   query orderCtData($include: Boolean!) {
      orderCt{
         status
         message
         orderCt {
            ...OrderCtObject
         }
      }
   }
   ${ORDERCT_FRAGMENT}
`;

export const ORDERCT_ID_QUERY = gql`
query {
   orderCtId{
      status
      message
      orderCtId
   }
}
`;
