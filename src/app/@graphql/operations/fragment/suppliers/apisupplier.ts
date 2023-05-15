import gql from 'graphql-tag';

export const APISUPPLIER_FRAGMENT = gql`
  fragment ApiSupplierObject on Apisupplier {
      type
      name
      method
      operation
      suboperation
      use
      return
      headers {
        authorization
      }
      parameters {
        name
        value
        secuence
      }
  }
`;
