import { Injectable } from '@angular/core';
import { APIPROVEEDOR_LIST_QUERY, APIPROVEEDOR_QUERY } from '@graphql/operations/query/apiproveedor';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiproveedoresService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  getApiproveedores(page: number = 1, itemsPage: number = 10) {
    return this.get(APIPROVEEDOR_LIST_QUERY, {
      itemsPage, page
    }).pipe(map((result: any) => {
      return result.products;
    }));
  }

  getApiproveedor(slug: string) {
    return this.get(APIPROVEEDOR_QUERY, {
      slug
    }).pipe(map((result: any) => {
      return result;
    }));
  }

}
