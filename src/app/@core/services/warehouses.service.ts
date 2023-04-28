import { Injectable } from '@angular/core';
import { WAREHOUSES_LIST_QUERY } from '@graphql/operations/query/warehouse';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WarehousesService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  getWarehouses(page: number = 1, itemsPage: number = 10) {
    return this.get(WAREHOUSES_LIST_QUERY, {
      itemsPage, page
    }).pipe(map((result: any) => {
      return result.warehouses;
    }));
  }

}
