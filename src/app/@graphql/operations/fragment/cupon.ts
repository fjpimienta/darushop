import gql from 'graphql-tag';

export const CUPON_FRAGMENT = gql`
  fragment CuponObject on Cupon {
    id
    cupon
    description
    typeDiscount
    amountDiscount
    minimumPurchase
    active
  }
`;
