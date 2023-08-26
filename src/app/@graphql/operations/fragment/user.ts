import gql from 'graphql-tag';

export const USER_FRAGMENT = gql`
  fragment UserObject on User {
    id
    name
    lastname
    email
    registerdate @include (if: $include)
    role
    active
    phone
    stripeCustomer
    addresses {
      c_pais
      d_pais
      c_estado
      d_estado
      c_mnpio
      d_mnpio
      c_ciudad
      d_ciudad
      d_asenta
      directions
      outdoorNumber
      interiorNumber
      phone
      references
      d_codigo
      dir_invoice
      dir_delivery
      dir_delivery_main
    }
  }
`;
