import gql from 'graphql-tag';

export const INVOICECONFIG_FRAGMENT = gql`
  fragment InvoiceConfigObject on InvoiceConfig {
        formaPago {
          id
          descripcion
        }
        metodoPago {
          id
          descripcion
        }
        regimenFiscal {
          id
          descripcion
          fisica
          moral
        }
        usoCFDI {
          id
          descripcion
          aplicaParaTipoPersonaFisica
          aplicaParaTipoPersonaMoral
        }
  }
`;
