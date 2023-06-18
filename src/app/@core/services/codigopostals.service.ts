import { Injectable } from '@angular/core';
import { CPS_LIST_QUERY } from '@graphql/operations/query/codigopostal';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CodigopostalsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  async getCps(page: number = 1, itemsPage: number = 10, filterName: string = ''): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(CPS_LIST_QUERY, {
        itemsPage, page, filterName
      }, {}).subscribe(
        (result: any) => {
          resolve(result.codigopostals);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
}
