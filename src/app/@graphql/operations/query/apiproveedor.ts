import gql from 'graphql-tag';
import { APIPROVEEDOR_FRAGMENT } from '../fragment/apiproveedor';

export const APIPROVEEDOR_LIST_QUERY = gql`
query apiproveedoresList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
  apiproveedores(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
    info {
      page
      pages
      itemsPage
      total
    }
    status
    message
    apiproveedores {
      ...ApiproveedortObject
    }
  }
}
${APIPROVEEDOR_FRAGMENT}
`;

export const APIPROVEEDOR_QUERY = gql`
  query apiproveedor($slug: String!){
    apiproveedor (slug: $slug) {
      status
      message
      apiproveedor {
        ...ApiproveedortObject
      }
    }
  }
  ${APIPROVEEDOR_FRAGMENT}
`;
