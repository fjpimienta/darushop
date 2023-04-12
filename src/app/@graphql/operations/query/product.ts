import gql from 'graphql-tag';
import { PRODUCT_FRAGMENT } from '../fragment/product';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const PRODUCTS_LIST_QUERY = gql`
  query productsList(
    $page: Int,
    $itemsPage: Int,
    $active: ActiveFilterEnum,
    $filterName: String = "",
    $offer: Int = 0,
    $brands: [String] = null,
    $categories: [String] = null
  ) {
    products(
      page: $page,
      itemsPage: $itemsPage,
      active: $active,
      filterName: $filterName,
      offer: $offer,
      brands: $brands,
      categories: $categories
    ) {
      info {
        ...ResultInfoObject
      }
      status
      message
      products {
        ...ProductObject
      }
    }
  }
  ${PRODUCT_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const PRODUCT_QUERY = gql`
  query product($id: ID!){
    product (id: $id) {
      status
      message
      product {
        ...ProductObject
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;
export const PRODUCT_DATA_QUERY = gql`
   query productData($include: Boolean!) {
      product{
         status
         message
         product {
            ...ProductObject
         }
      }
   }
   ${PRODUCT_FRAGMENT}
`;

export const PRODUCT_ID_QUERY = gql`
query {
   productId{
      status
      message
      productId
   }
}
`;
