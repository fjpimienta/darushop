import gql from 'graphql-tag';
import { APISUPPLIER_FRAGMENT } from '../../fragment/suppliers/apisupplier';
import { SUPPLIER_FRAGMENT } from '../../fragment/suppliers/supplier';

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

export const SUPPLIER_NAME_QUERY = gql`
  query supplierName($name: String!){
    supplierName (name: $name) {
      status
      message
      supplierName {
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

export const APISUPPLIER_QUERY = gql`
  query apiSupplier($name: String, $typeApi: String, $nameApi: String) {
    apiSupplier(name: $name, typeApi: $typeApi, nameApi: $nameApi) {
      status
      message
      apiSupplier{
        ...ApiSupplierObject
      }
    }
  }
  ${APISUPPLIER_FRAGMENT}
`;
