import gql from 'graphql-tag';
import { SHIPPING_FRAGMENT } from '../fragment/shipping';

export const SHIPPINGS_LIST_QUERY = gql`
query shippingsList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
  shippings(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
    info {
      page
      pages
      itemsPage
      total
    }
    status
    message
    shippings {
      ...ShippingObject
    }
  }
}
${SHIPPING_FRAGMENT}
`;

export const SHIPPING_QUERY = gql`
  query shipping($slug: String!){
    shipping (slug: $slug) {
      status
      message
      shipping {
        ...ShippingObject
      }
    }
  }
  ${SHIPPING_FRAGMENT}
`;

export const SHIPPING_ID_QUERY = gql`
query {
   shippingId{
      status
      message
      shippingId
   }
}
`;
