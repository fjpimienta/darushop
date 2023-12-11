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

  async add(welcome: Object): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.set(ADD_WELCOME, welcome, {}).subscribe(
        (result: any) => {
          resolve(result.addWelcome);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
}
