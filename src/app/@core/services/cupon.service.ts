import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ICatalog } from '@core/interfaces/catalog.interface';
import { ADD_CUPON, ADD_CUPON_LIST, BLOCK_CUPON, UPDATE_CUPON } from '@graphql/operations/mutation/cupons';
import { CUPONS_LIST_QUERY, CUPON_ID_QUERY, CUPON_QUERY } from 'src/app/@graphql/operations/query/cupons';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';
import { ISupplier } from '@core/interfaces/supplier.interface';

@Injectable({
  providedIn: 'root'
})
export class CuponsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(cupon: ICatalog) {
    return this.set(
      ADD_CUPON,
      {
        cupon
      }, {}).pipe(map((result: any) => {
        return result.addCupon;
      })
      );
  }

  addList(cupons: [ICatalog], supplier: ISupplier) {
    return this.set(
      ADD_CUPON_LIST,
      {
        cupons,
        supplier
      }, {}).pipe(map((result: any) => {
        return result.addCupons;
      })
      );
  }

  update(cupon: ICatalog) {
    return this.set(
      UPDATE_CUPON,
      {
        cupon
      }, {}).pipe(map((result: any) => {
        return result.updateCupon;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_CUPON,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockCupon;
      })
      );
  }

  async getCupons(page: number = 1, itemsPage: number = 10): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(CUPONS_LIST_QUERY, { itemsPage, page }).subscribe(
        (result: any) => {
          resolve(result.cupons);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async getCupon(name: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(CUPON_QUERY, { name }).subscribe(
        (result: any) => {
          resolve(result.cupon);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  next() {
    return this.get(
      CUPON_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.cuponId.cuponId;
    }));
  }
}
