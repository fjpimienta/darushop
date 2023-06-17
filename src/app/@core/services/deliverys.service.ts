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
    return new Promise<any>((resolve, reject) => {
      this.set(ADD_DELIVERY, {
        delivery
      }, {}).subscribe(
        (result: any) => {
          resolve(result.addDelivery);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async update(delivery: Delivery): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.set(UPDATE_DELIVERY, {
        delivery
      }, {}).subscribe(
        (result: any) => {
          resolve(result.updateDelivery);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async unblock(id: string, unblock: boolean = false, admin: boolean = false): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.set(BLOCK_DELIVERY, {
        id, unblock, admin
      }, {}).subscribe(
        (result: any) => {
          resolve(result.blockDelivery);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async getDeliverys(page: number = 1, itemsPage: number = 10, filterName: string = ''): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(DELIVERYS_LIST_QUERY, {
        itemsPage, page, filterName
      }, {}).subscribe(
        (result: any) => {
          resolve(result.deliverys);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async getDelivery(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(DELIVERY_DATA_QUERY, {
        include: true, id
      }, {}).subscribe(
        (result: any) => {
          resolve(result);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

}
