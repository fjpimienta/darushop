import gql from 'graphql-tag';
import { CPS_FRAGMENT } from '../fragment/codigopostal';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const CPS_LIST_QUERY = gql`
query codigopostalsList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String = "") {
  codigopostals(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
    info {
      ...ResultInfoObject
    }
    status
    message
    codigopostals {
      ...CodigopostalObject
    }
  }
}
${CPS_FRAGMENT}
${RESULT_INFO_FRAGMENT}
`;
