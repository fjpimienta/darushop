import gql from 'graphql-tag';
import { DELIVERY_FRAGMENT } from '../fragment/delivery';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const DELIVERYS_LIST_QUERY = gql`
  query deliverysList(
    $page: Int,
    $itemsPage: Int,
    $active: ActiveFilterEnum,
    $filterName: String = ""
  ) {
    deliverys(
      page: $page,
      itemsPage: $itemsPage,
      active: $active,
      filterName: $filterName
    ) {
      info {
        ...ResultInfoObject
      }
      status
      message
      deliverys {
        ...DeliveryObject
      }
    }
  }
  ${DELIVERY_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const DELIVERY_QUERY = gql`
  query delivery($id: ID!){
    delivery (id: $id) {
      status
      message
      delivery {
        ...DeliveryObject
      }
    }
  }
  ${DELIVERY_FRAGMENT}
`;
export const DELIVERY_DATA_QUERY = gql`
   query deliveryDataId($deliveryId: String!) {
      delivery(deliveryId: $deliveryId){
         status
         message
         delivery {
            ...DeliveryObject
         }
      }
   }
   ${DELIVERY_FRAGMENT}
`;

export const DELIVERY_ID_QUERY = gql`
query {
   deliveryId{
      status
      message
      deliveryId
   }
}
`;
