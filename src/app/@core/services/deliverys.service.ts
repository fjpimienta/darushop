import { Injectable } from '@angular/core';
import { Delivery } from '@core/models/delivery.models';
import { ADD_DELIVERY, BLOCK_DELIVERY, UPDATE_DELIVERY } from '@graphql/operations/mutation/delivery';
import { DELIVERYS_LIST_QUERY, DELIVERY_DATA_QUERY } from '@graphql/operations/query/delivery';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeliverysService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  async add(delivery: Delivery): Promise<any> {
    console.log('add/delivery: ', delivery);
    return new Promise<any>((resolve, reject) => {
      this.set(ADD_DELIVERY, {
        delivery
      }, {}).subscribe(
        (result: any) => {
          console.log('add/result.addDelivery', result.addDelivery);
          resolve(result.addDelivery);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  update(delivery: Delivery) {
    return this.set(
      UPDATE_DELIVERY,
      {
        delivery
      }, {}).pipe(map((result: any) => {
        return result.updateDelivery;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_DELIVERY,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockDelivery;
      })
      );
  }

  getDeliverys(page: number = 1, itemsPage: number = 10, filterName: string = '') {
    return this.get(DELIVERYS_LIST_QUERY, {
      itemsPage, page, filterName
    }).pipe(map((result: any) => {
      return result.deliverys;
    }));
  }

  getDelivery(id: string) {
    return this.get(DELIVERY_DATA_QUERY, {
      include: true, id
    }).pipe(map((result: any) => {
      return result;
    }));
  }

}
