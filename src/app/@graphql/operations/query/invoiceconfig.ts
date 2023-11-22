import gql from 'graphql-tag';
import { INVOICECONFIG_FRAGMENT } from '../fragment/invoiceconfig';

export const INVOICECONFIG_QUERY = gql`
  query invoiceconfig {
    invoiceconfig {
      status
      message
      invoiceconfig {
        ...InvoiceConfigObject
      }
    }
  }
  ${INVOICECONFIG_FRAGMENT}
`;
