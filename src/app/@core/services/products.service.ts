import { Injectable } from '@angular/core';
import { PRODUCTS_LIST_QUERY, PRODUCT_QUERY } from '@graphql/operations/query/product';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  getProducts(
    page: number = 1,
    itemsPage: number = 12,
    filterName: string = '',
    offer: boolean = false,
    brands: string[] = null,
    categories: string[] = null
  ) {
    return this.get(PRODUCTS_LIST_QUERY, {
      itemsPage, page, filterName, offer, brands, categories
    }).pipe(map((result: any) => {
      return result.products;
    }));
  }

  getProduct(id: string) {
    return this.get(PRODUCT_QUERY, {
      id
    }).pipe(map((result: any) => {
      return result;
    }));
  }

}
