import { Injectable } from '@angular/core';
import { IOrderSyscom } from '@core/models/suppliers/syscom.models';
import { ADD_ORDER_SYSCOM, UPDATE_ORDER_SYSCOM } from '@graphql/operations/mutation/suppliers/syscom';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class OrderSyscomService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  async add(orderSyscomInput: IOrderSyscom): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ADD_ORDER_SYSCOM, {
        orderSyscomInput
      }, {}).subscribe(
        (result: any) => {
          resolve(result.saveOrderSyscom);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async update(orderSyscomInput: IOrderSyscom): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(UPDATE_ORDER_SYSCOM, {
        orderSyscomInput
      }, {}).subscribe(
        (result: any) => {
          resolve(result.updateOrderSyscom);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

}
