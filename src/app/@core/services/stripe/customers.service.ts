import { Injectable } from '@angular/core';
import { CREATE_CUSTOMER_STRIPE } from '@graphql/operations/mutation/stripe/customer';
import { CUSTOMER_QUERY } from '@graphql/operations/query/stripe/customer';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(name: string, email: string) {
    return this.set(
      CREATE_CUSTOMER_STRIPE,
      { name, email }
    ).pipe(map((result: any) => {
      return result.createCustomer;
    }));
  }

  getCustomerByEmail(email: string) {
    return this.get(CUSTOMER_QUERY, {
      email
    }).pipe(map((result: any) => {
      return result;
    }));
  }
}
