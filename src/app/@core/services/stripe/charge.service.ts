import { Injectable } from '@angular/core';
import { IPayment } from '@core/interfaces/stripe/payment.interface';
import { OrderInput } from '@core/models/order.models';
import { CREATE_PAY_ORDER } from '@graphql/operations/mutation/stripe/charge';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { CHARGES_CUSTOMERS_LIST } from '@graphql/operations/query/stripe/charge';

@Injectable({
  providedIn: 'root'
})
export class ChargeService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  pay(payment: IPayment, order: OrderInput) {
    return this.set(
      CREATE_PAY_ORDER,
      {
        payment,
        order
      }
    ).pipe(map((result: any) => {
      return result.chargeOrder;
    }));
  }

  listByCustomer(
    customer: string,
    limit: number = 0,
    startingAfter: string = '',
    endingBefore: string = ''
  ) {
    return this.set(
      CHARGES_CUSTOMERS_LIST,
      {
        customer,
        limit,
        startingAfter,
        endingBefore
      }
    ).pipe(map((result: any) => {
      return result.chargesByCustomer;
    }));
  }
}
