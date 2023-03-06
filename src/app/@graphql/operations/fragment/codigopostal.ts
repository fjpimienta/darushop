import gql from 'graphql-tag';

export const CPS_FRAGMENT = gql`
  fragment CodigopostalObject on Codigopostal {
    c_pais
    d_pais
    c_estado
    d_estado
    c_mnpio
    D_mnpio
    c_cve_ciudad
    d_ciudad
    d_asenta
    d_codigo
  }
`;
