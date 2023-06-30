import { Injectable } from '@angular/core';
import { Config } from '@core/models/config.models';
import { CONFIG_QUERY } from '@graphql/operations/query/config';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService extends ApiService {

  configs = new Subject<Config[]>();
  configs$ = this.configs.asObservable();

  constructor(apollo: Apollo) {
    super(apollo);
  }

  async getConfig(id: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(CONFIG_QUERY, { id }).subscribe(
        (result: any) => {
          resolve(result.config.config);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
}
