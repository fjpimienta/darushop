import { Injectable } from '@angular/core';
import { IOrderCt } from '@core/interfaces/suppliers/orderct.interface';
import { ADD_ORDERCT } from '@graphql/operations/mutation/suppliers/orderct';
import { ORDERCTS_LIST_QUERY, ORDERCT_DATA_QUERY } from '@graphql/operations/query/suppliers/orderct';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderCtsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(orderCt: IOrderCt) {
    return this.set(
      ADD_ORDERCT,
      {
        orderCt
      }, {}).pipe(map((result: any) => {
        return result.addOrderCt;
      })
      );
  }

  getOrderCts(page: number = 1, itemsPage: number = 10, filterName: string = '') {
    return this.get(ORDERCTS_LIST_QUERY, {
      itemsPage, page, filterName
    }).pipe(map((result: any) => {
      return result.orderCts;
    }));
  }

  getOrderCt(id: string) {
    return this.get(ORDERCT_DATA_QUERY, {
      include: true, id
    }).pipe(map((result: any) => {
      return result;
    }));
  }

}
