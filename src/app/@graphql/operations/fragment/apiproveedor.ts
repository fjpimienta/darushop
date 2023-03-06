import gql from 'graphql-tag';

export const APIPROVEEDOR_FRAGMENT = gql`
  fragment ApiproveedortObject on Apiproveedor {
    id
    name
    slug
    uri_base
    token {
      verbo
      uri
      body {
        client_id
        client_secret
        grant_type
      }
      requiere_token
      tipo_token
    }
    catalogos {
      name
      uri
      headers {
        authorization
      }
    }
  }
`;
