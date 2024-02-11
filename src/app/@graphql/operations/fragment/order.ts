import gql from 'graphql-tag';

export const ORDER_FRAGMENT = gql`
  fragment OrderObject on Order {
    id
    name
    registerDate
    user {
      id
      name
      lastname
      email
      # registerdate
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
    charge {
      id
      amount
      status
      receipt_email
      receipt_url
      paid
      payment_method
      created
      description
      customer
      redirect_url
    }
    cartitems {
      id
      name
      slug
      short_desc
      price
      sale_price
      review
      ratings
      until
      stock
      top
      featured
      new
      author
      sold
      qty
      sum
      category {
        name
        slug
        pivot {
          product_id
          product_category_id
        }
      }
      brands {
        name
        slug
        pivot {
          product_id
          brand_id
        }
      }
      model
      peso
      pictures {
        width
        height
        url
        pivot {
          related_id
          upload_file_id
        }
      }
      sm_pictures {
        width
        height
        url
        pivot {
          related_id
          upload_file_id
        }
      }
      variants {
        id
        color
        color_name
        price
        pivot {
          product_id
          component_id
        }
        size {
          id
          name
          slug
          pivot {
            components_variants_variant_id
            component_id
          }
        }
      }
    }
  }
`;
