import { Injectable } from '@angular/core';
import { IIcommktContact } from '@core/interfaces/suppliers/icommkt.interface';
import { ADD_ICOMMKT } from '@graphql/operations/mutation/suppliers/icommkt';
import { ICOMMKT_CONTACTS_QUERY, ICOMMKT_CONTACT_QUERY } from '@graphql/operations/query/suppliers/icommkt';
import { ORDERCTS_LIST_QUERY, ORDERCT_DATA_QUERY } from '@graphql/operations/query/suppliers/orderct';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IcommktsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  async add(icommkContactInput: IIcommktContact): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.set(ADD_ICOMMKT, {
        icommkContactInput
      }, {}).subscribe(
        (result: any) => {
          resolve(result.addContact);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async getIcommktContacts(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ICOMMKT_CONTACTS_QUERY, {}, {}).subscribe(
        (result: any) => {
          resolve(result.icecatProduct);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async getIcommktContact(email: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ICOMMKT_CONTACT_QUERY, {
        email
      }, {}).subscribe(
        (result: any) => {
          resolve(result.icecatProduct);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

}
