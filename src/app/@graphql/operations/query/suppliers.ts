import gql from 'graphql-tag';
import { SUPPLIER_FRAGMENT } from '../fragment/supplier';

export const SUPPLIERS_LIST_QUERY = gql`
query suppliersList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
  suppliers(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
    info {
      page
      pages
      itemsPage
      total
    }
    status
    message
    suppliers {
      ...SupplierObject
    }
  }
}
${SUPPLIER_FRAGMENT}
`;

export const SUPPLIER_QUERY = gql`
  query supplier($slug: String!){
    supplier (slug: $slug) {
      status
      message
      supplier {
        ...SupplierObject
      }
    }
  }
  ${SUPPLIER_FRAGMENT}
`;

export const SUPPLIER_ID_QUERY = gql`
query {
   supplierId{
      status
      message
      supplierId
   }
}
`;
