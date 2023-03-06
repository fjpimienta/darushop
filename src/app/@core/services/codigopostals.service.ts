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

  getCps(page: number = 1, itemsPage: number = 10, filterName: string = '') {
    return this.get(CPS_LIST_QUERY, {
      itemsPage, page, filterName
    }).pipe(map((result: any) => {
      return result.codigopostals;
    }));
  }
}
