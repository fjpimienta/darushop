import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';
import { CATEGORYGROUPS_LIST_QUERY } from '@graphql/operations/query/categorysgroups';

@Injectable({
  providedIn: 'root'
})
export class CategorysGroupsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  getCategorysGroup() {
    return this.get(CATEGORYGROUPS_LIST_QUERY, {}).pipe(map((result: any) => {
      return result.categorysgroups;
    }));
  }

}
