import gql from 'graphql-tag';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';
import { WAREHOUSE_FRAGMENT } from '../fragment/warehouse';

export const WAREHOUSES_LIST_QUERY = gql`
  query warehouseList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
    warehouses(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      warehouses {
        ...WarehouseObject
      }
    }
  }
  ${WAREHOUSE_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const WAREHOUSES_DATA_QUERY = gql`
   query warehouseData($include: Boolean!) {
      warehouses{
         status
         message
         warehouses {
            ...WarehouseObject
         }
      }
   }
   ${WAREHOUSE_FRAGMENT}
`;
