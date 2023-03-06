import gql from 'graphql-tag';

export const SUPPLIER_FRAGMENT = gql`
  fragment SupplierObject on Supplier {
    id
    name
    slug
    description
    large_description
    addres
    contact
    phone
    web
    url_base_api
    token {
      type
      method
      url_base_token
      body_parameters {
        name
        value
        secuence
        onlyUrl
      }
      response_token {
        name
        es_token
      }
    }
    apis {
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
  }
`;
