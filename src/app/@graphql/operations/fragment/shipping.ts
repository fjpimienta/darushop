import gql from 'graphql-tag';

export const SHIPPING_FRAGMENT = gql`
  fragment ShippingObject on Shipping {
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
