
import { Injectable } from '@angular/core';
import { INVOICECONFIG_QUERY } from '@graphql/operations/query/invoiceconfig';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class InvoiceConfigsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  async getInvoiceConfig(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(INVOICECONFIG_QUERY, {}).subscribe(
        (result: any) => {
          resolve(result.invoiceconfig.invoiceconfig);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
}
