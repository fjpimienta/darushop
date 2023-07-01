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
    url_base_api_order
    url_base_api_shipments
    token {
      type
      method
      url_base_token
      header_parameters {
        name
        value
        secuence
        onlyUrl
      }
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
