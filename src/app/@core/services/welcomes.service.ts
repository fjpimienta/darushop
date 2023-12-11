import { Injectable } from '@angular/core';
import { ICatalog } from '@core/interfaces/catalog.interface';
import { ADD_WELCOME } from '@graphql/operations/mutation/wellcome';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WelcomesService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(welcome: ICatalog) {
    return this.set(
      ADD_WELCOME,
      {
        welcome
      }, {}).pipe(map((result: any) => {
        return result.welcome;
      })
      );
  }
}
