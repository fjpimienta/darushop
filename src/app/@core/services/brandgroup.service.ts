import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';
import { BRANDGROUPS_LIST_QUERY } from '@graphql/operations/query/brandsgroups';

@Injectable({
  providedIn: 'root'
})
export class BrandsGroupsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  getBrandsGroup() {
    return this.get(BRANDGROUPS_LIST_QUERY, {}).pipe(map((result: any) => {
      return result.brandsgroups;
    }));
  }

}
