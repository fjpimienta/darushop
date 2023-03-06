import gql from 'graphql-tag';
import { GROUP_FRAGMENT } from '../fragment/group';
import { RESULT_INFO_FRAGMENT } from '../fragment/result-info';

export const GROUPS_LIST_QUERY = gql`
  query groupList($page: Int, $itemsPage: Int, $active: ActiveFilterEnum, $filterName: String) {
    groups(page: $page, itemsPage: $itemsPage, active: $active, filterName: $filterName) {
      info {
        ...ResultInfoObject
      }
      status
      message
      groups {
        ...GroupObject
      }
    }
  }
  ${GROUP_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const GROUP_DATA_QUERY = gql`
   query groupData($include: Boolean!) {
      group{
         status
         message
         group {
            ...GroupObject
         }
      }
   }
   ${GROUP_FRAGMENT}
`;

export const GROUP_ID_QUERY = gql`
query {
   groupId{
      status
      message
      groupId
   }
}
`;
