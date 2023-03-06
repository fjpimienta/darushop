import gql from 'graphql-tag';
import { ORDER_FRAGMENT } from '../fragment/order';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const ORDERS_LIST_QUERY = gql`
  query ordersList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String = "") {
    orders(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      orders {
        ...OrderObject
      }
    }
  }
  ${ORDER_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const ORDER_DATA_QUERY = gql`
   query orderData($include: Boolean!) {
      order{
         status
         message
         order {
            ...OrderObject
         }
      }
   }
   ${ORDER_FRAGMENT}
`;

export const ORDER_ID_QUERY = gql`
query {
   orderId{
      status
      message
      orderId
   }
}
`;
