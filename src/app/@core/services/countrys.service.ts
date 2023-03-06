import { Injectable } from '@angular/core';
import { Country } from '@core/models/country.models';
import { COUNTRYS_LIST_QUERY, COUNTRY_QUERY } from '@graphql/operations/query/countrys';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountrysService extends ApiService {

  countrys = new Subject<Country[]>();
  countrys$ = this.countrys.asObservable();

  constructor(apollo: Apollo) {
    super(apollo);
  }

  updateCountry(newValue: Country[]): void {
    this.countrys.next(newValue);
  }

  getCountrys(page: number = 1, itemsPage: number = 10, filterName: string = '') {
    return this.get(COUNTRYS_LIST_QUERY, {
      itemsPage, page, filterName
    }).pipe(map((result: any) => {
      this.updateCountry(result.countrys.countrys);
      return result.countrys;
    }));
  }

  getCountry(c_pais: string) {
    return this.get(COUNTRY_QUERY, { c_pais })
    .pipe(map((result: any) => {
      return result.country;
    }));
  }
}
