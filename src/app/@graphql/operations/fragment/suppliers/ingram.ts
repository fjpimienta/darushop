import gql from 'graphql-tag';

export const SHIPMENTS_INGRAM_RATES_FRAGMENT = gql`
  fragment shippingBDIObject on ShippingBDI {
    currencyCode
    totalFreightAmount
    totalTaxAmount
    totalFees
    totalNetAmount
    grossAmount
    freightEstimate {
      branch
      branchName
      cost
      label
      totalWeight
      transitDays
      carrierList
    }
  }
`;

export const ORDERINGRAM_FRAGMENT = gql`
  fragment orderBDIObject on OrderBDI {
    statuscode
    orderNumberClient
    ingramNumberOrder
    message
  }
`;
