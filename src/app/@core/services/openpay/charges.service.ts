import { Injectable } from '@angular/core';
import { CaptureChargeOpenpayInput, CardOpenpayInput, ChargeOpenpayInput, CustomerOpenpayInput } from '@core/models/openpay/_openpay.models';
import { ADD_CARD_OPENPAY, LIST_CARDS_OPENPAY, ONE_CARD_OPENPAY } from '@graphql/operations/query/openpay/cards';
import { ADD_CHARGE_OPENPAY, CAPTURE_CHARGE_OPENPAY, LIST_CHARGES_OPENPAY, ONE_CHARGE_OPENPAY } from '@graphql/operations/query/openpay/charges';
import { ADD_CUSTOMER_OPENPAY, LIST_CUSTOMERS_OPENPAY, ONE_CUSTOMER_OPENPAY, UPDATE_CUSTOMER_OPENPAY } from '@graphql/operations/query/openpay/customers';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ChargeOpenpayService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  //#region Cards
  async listCards(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(LIST_CARDS_OPENPAY, {}).subscribe(
        (result: any) => {
          resolve(result.listCardsOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async oneCard(idCardOpenpay: String): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ONE_CARD_OPENPAY, { idCardOpenpay }).subscribe(
        (result: any) => {
          resolve(result.cardOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async addCard(cardOpenpay: CardOpenpayInput): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ADD_CARD_OPENPAY, { cardOpenpay }).subscribe(
        (result: any) => {
          resolve(result.createCardOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
  //#endregion


  //#region Customers
  async listCustomers(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(LIST_CUSTOMERS_OPENPAY, {}).subscribe(
        (result: any) => {
          resolve(result.listCustomersOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async oneCustomer(idCustomerOpenpay: String): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ONE_CUSTOMER_OPENPAY, { idCustomerOpenpay }).subscribe(
        (result: any) => {
          resolve(result.customerOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async createCustomer(customerOpenpay: CustomerOpenpayInput): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ADD_CUSTOMER_OPENPAY, { customerOpenpay }).subscribe(
        (result: any) => {
          resolve(result.customerOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async updateCustomer(idCustomerOpenpay: String): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(UPDATE_CUSTOMER_OPENPAY, { idCustomerOpenpay }).subscribe(
        (result: any) => {
          resolve(result.customerOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
  //#endregion


  //#region Charges
  async listCharges(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(LIST_CHARGES_OPENPAY, {}).subscribe(
        (result: any) => {
          resolve(result.listChargesOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async oneCharge(idChargeOpenpay: String): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ONE_CHARGE_OPENPAY, { idChargeOpenpay }).subscribe(
        (result: any) => {
          resolve(result.chargeOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async createCharge(chargeOpenpay: ChargeOpenpayInput): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ADD_CHARGE_OPENPAY, { chargeOpenpay }).subscribe(
        (result: any) => {
          resolve(result.createChargeOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async captureCharge(idChargeOpenpay: String,
    captureTransactionOpenpay: CaptureChargeOpenpayInput): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      console.log(`idChargeOpenpay: ${idChargeOpenpay}, amount: ${captureTransactionOpenpay.amount}`);
      console.log('captureTransactionOpenpay: ', captureTransactionOpenpay);
      this.get(CAPTURE_CHARGE_OPENPAY, { idChargeOpenpay, captureTransactionOpenpay }).subscribe(
        (result: any) => {
          resolve(result.captureChargeOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
  //#endregion
}
