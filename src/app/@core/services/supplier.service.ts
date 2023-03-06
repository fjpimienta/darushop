import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';
import { ADD_SUPPLIER, ADD_SUPPLIER_LIST, BLOCK_SUPPLIER, UPDATE_SUPPLIER } from '@graphql/operations/mutation/suppliers';
import { SUPPLIERS_LIST_QUERY, SUPPLIER_ID_QUERY } from '@graphql/operations/query/suppliers';
import { ISupplier } from '@core/interfaces/supplier.interface';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(supplieer: ISupplier) {
    return this.set(
      ADD_SUPPLIER,
      {
        supplieer
      }, {}).pipe(map((result: any) => {
        return result.addSupplier;
      })
      );
  }

  addList(suppliers: [ISupplier]) {
    return this.set(
      ADD_SUPPLIER_LIST,
      {
        suppliers
      }, {}).pipe(map((result: any) => {
        return result.addSuppliers;
      })
      );
  }

  update(supplieer: ISupplier) {
    return this.set(
      UPDATE_SUPPLIER,
      {
        supplieer
      }, {}).pipe(map((result: any) => {
        return result.updateSupplier;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_SUPPLIER,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockSupplier;
      })
      );
  }

  getSuppliers(page: number = 1, itemsPage: number = 10) {
    return this.get(SUPPLIERS_LIST_QUERY, {
      itemsPage, page
    }).pipe(map((result: any) => {
      return result.suppliers;
    }));
  }

  next() {
    return this.get(
      SUPPLIER_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.supplierId.supplierId;
    }));
  }
}
