import gql from 'graphql-tag';
import { ORDERCVA_FRAGMENT } from '@graphql/operations/fragment/suppliers/ordercva';
import { RESULT_INFO_FRAGMENT } from '@graphql/operations/fragment/result-info';

export const ORDERCVAS_LIST_QUERY = gql`
  query orderCvasList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String = "") {
    orderCvas(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      orderCvas {
        ...OrderCvaObject
      }
    }
  }
  ${ORDERCVA_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const ORDERCVA_DATA_QUERY = gql`
   query orderCvaData($include: Boolean!) {
      orderCva{
         status
         message
         orderCva {
            ...OrderCvaObject
         }
      }
   }
   ${ORDERCVA_FRAGMENT}
`;

export const ORDERCVA_ID_QUERY = gql`
query {
   orderCvaId{
      status
      message
      orderCvaId
   }
}
`;
