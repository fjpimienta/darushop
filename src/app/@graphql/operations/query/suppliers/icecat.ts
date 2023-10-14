import gql from 'graphql-tag';
import { ICECATPRODUCT_FRAGMENT } from '@graphql/operations/fragment/suppliers/icecat';

export const ICECATPRODUCT_QUERY = gql`
  query icecatProduct(
    $brandIcecat: String, $productIcecat: String
  ) {
    icecatProduct(
      brandIcecat: $brandIcecat, productIcecat: $productIcecat
    ) {
        status
        message
        icecatProduct {
          ...icecatProductObject
        }
    }
}
${ICECATPRODUCT_FRAGMENT}
`;
