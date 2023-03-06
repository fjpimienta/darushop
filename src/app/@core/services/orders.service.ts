import { Injectable } from '@angular/core';
import { ORDERS_LIST_QUERY, ORDER_DATA_QUERY } from '@graphql/operations/query/order';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  getOrders(page: number = 1, itemsPage: number = 10, filterName: string = '') {
    return this.get(ORDERS_LIST_QUERY, {
      itemsPage, page, filterName
    }).pipe(map((result: any) => {
      return result.orders;
    }));
  }

  getOrder(id: string) {
    return this.get(ORDER_DATA_QUERY, {
      include: true, id
    }).pipe(map((result: any) => {
      return result;
    }));
  }

}
