import { Injectable } from '@angular/core';
import { IOrderCva } from '@core/interfaces/suppliers/ordercva.interface';
import { ADD_ORDERCVA } from '@graphql/operations/mutation/suppliers/ordercva';
import { ORDERCVAS_LIST_QUERY, ORDERCVA_DATA_QUERY } from '@graphql/operations/query/suppliers/ordercva';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderCvasService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(orderCva: IOrderCva) {
    return this.set(
      ADD_ORDERCVA,
      {
        orderCva
      }, {}).pipe(map((result: any) => {
        return result.addOrderCva;
      })
      );
  }

  getOrderCvas(page: number = 1, itemsPage: number = 10, filterName: string = '') {
    return this.get(ORDERCVAS_LIST_QUERY, {
      itemsPage, page, filterName
    }).pipe(map((result: any) => {
      return result.orderCvas;
    }));
  }

  getOrderCva(id: string) {
    return this.get(ORDERCVA_DATA_QUERY, {
      include: true, id
    }).pipe(map((result: any) => {
      return result;
    }));
  }

}
