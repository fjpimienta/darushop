import { Injectable } from '@angular/core';
import { ICECATPRODUCT_QUERY } from '@graphql/operations/query/suppliers/icecat';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IcecatProductsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  getIcecatProduct(brandIcecat: String, productIcecat: String) {
    return this.get(ICECATPRODUCT_QUERY, {
      brandIcecat, productIcecat
    }).pipe(map((result: any) => {
      return result.icecatProduct;
    }));
  }

  async getIcecatProductA(brandIcecat: String, productIcecat: String) {
    return new Promise<any>((resolve, reject) => {
      this.get(ICECATPRODUCT_QUERY, {
        brandIcecat, productIcecat
      }).subscribe(
        (result: any) => {
          resolve(result.icecatProduct);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
}
