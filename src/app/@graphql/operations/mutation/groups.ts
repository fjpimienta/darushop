import gql from 'graphql-tag';
import { GROUP_FRAGMENT } from 'src/app/@graphql/operations/fragment/group';

export const ADD_GROUP = gql`
   mutation addGroup($group: CatalogInput!) {
      addGroup(group: $group) {
         status
         message
         group {
            ...GroupObject
         }
      }
   }
   ${GROUP_FRAGMENT}
`;

export const ADD_GROUP_LIST = gql`
   mutation addGroups($groups: [CatalogInput!]!, $supplier: SupplierInput) {
      addGroups(groups: $groups, supplier: $supplier) {
         status
         message
         groups {
            ...GroupObject
         }
      }
   }
   ${GROUP_FRAGMENT}
`;

export const UPDATE_GROUP = gql`
   mutation updateGroup($group: CatalogInput!) {
      updateGroup(group: $group) {
         status
         message
         group {
            ...GroupObject
         }
      }
   }
   ${GROUP_FRAGMENT}
`;

export const BLOCK_GROUP = gql`
   mutation blockGroup($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockGroup(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
