import gql from 'graphql-tag';

export const COUNTRY_FRAGMENT = gql`
  fragment CountryObject on Country {
    c_pais
    d_pais
    estados {
      c_estado
      d_estado
      municipios {
        c_mnpio
        D_mnpio
      }
    }
  }
`;
