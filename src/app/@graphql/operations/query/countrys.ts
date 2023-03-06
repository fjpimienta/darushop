import gql from 'graphql-tag';
import { COUNTRY_FRAGMENT } from '../fragment/country';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const COUNTRYS_LIST_QUERY = gql`
  query countrysList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String = "") {
    countrys(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      countrys {
        ...CountryObject
      }
    }
  }
  ${COUNTRY_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const COUNTRY_QUERY = gql`
  query country($c_pais: String!) {
    country(c_pais: $c_pais) {
      status
      message
      country {
        ...CountryObject
      }
    }
  }
  ${COUNTRY_FRAGMENT}
`;
