import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';
import { ADD_SHIPPING, ADD_SHIPPING_LIST, BLOCK_SHIPPING, UPDATE_SHIPPING } from '@graphql/operations/mutation/shippings';
import { SHIPPINGS_LIST_QUERY, SHIPPING_ID_QUERY } from '@graphql/operations/query/shippings';
import { IShipping } from '@core/interfaces/shipping.interface';

@Injectable({
  providedIn: 'root'
})
export class ShippingsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(supplieer: IShipping) {
    return this.set(
      ADD_SHIPPING,
      {
        supplieer
      }, {}).pipe(map((result: any) => {
        return result.addShipping;
      })
      );
  }

  addList(shippings: [IShipping]) {
    return this.set(
      ADD_SHIPPING_LIST,
      {
        shippings
      }, {}).pipe(map((result: any) => {
        return result.addShippings;
      })
      );
  }

  update(supplieer: IShipping) {
    return this.set(
      UPDATE_SHIPPING,
      {
        supplieer
      }, {}).pipe(map((result: any) => {
        return result.updateShipping;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_SHIPPING,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockShipping;
      })
      );
  }

  async getShippings(page: number = 1, itemsPage: number = 10): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(SHIPPINGS_LIST_QUERY, {
        itemsPage, page
      }).subscribe(
        (result: any) => {
          resolve(result.shippings);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  next() {
    return this.get(
      SHIPPING_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.shippingId.shippingId;
    }));
  }
}
