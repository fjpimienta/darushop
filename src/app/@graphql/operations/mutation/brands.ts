import gql from 'graphql-tag';
import { BRAND_FRAGMENT } from 'src/app/@graphql/operations/fragment/brand';

export const ADD_BRAND = gql`
   mutation addBrand($brand: CatalogInput!) {
      addBrand(brand: $brand) {
         status
         message
         brand {
            ...BrandObject
         }
      }
   }
   ${BRAND_FRAGMENT}
`;

export const ADD_BRAND_LIST = gql`
   mutation addBrands($brands: [CatalogInput!]!, $supplier: SupplierInput) {
      addBrands(brands: $brands, supplier: $supplier) {
         status
         message
         brands {
            ...BrandObject
         }
      }
   }
   ${BRAND_FRAGMENT}
`;

export const UPDATE_BRAND = gql`
   mutation updateBrand($brand: CatalogInput!) {
      updateBrand(brand: $brand) {
         status
         message
         brand {
            ...BrandObject
         }
      }
   }
   ${BRAND_FRAGMENT}
`;

export const BLOCK_BRAND = gql`
   mutation blockBrand($id: ID!, $unblock: Boolean, $admin: Boolean) {
      blockBrand(id: $id, unblock: $unblock, admin: $admin) {
         status
         message
      }
   }
`;
