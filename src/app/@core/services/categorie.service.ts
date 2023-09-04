import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ICatalog } from 'src/app/@core/interfaces/catalog.interface';
import { ADD_CATEGORIE, ADD_CATEGORIE_LIST, BLOCK_CATEGORIE, UPDATE_CATEGORIE } from 'src/app/@graphql/operations/mutation/categorie';
import { CATEGORIES_LIST_QUERY, CATEGORIE_ID_QUERY } from 'src/app/@graphql/operations/query/categories';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';
import { ISupplier } from '@core/interfaces/supplier.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(categorie: ICatalog) {
    return this.set(
      ADD_CATEGORIE,
      {
        categorie
      }, {}).pipe(map((result: any) => {
        return result.addCategorie;
      })
      );
  }

  addList(categories: [ICatalog], supplier: ISupplier) {
    return this.set(
      ADD_CATEGORIE_LIST,
      {
        categories,
        supplier
      }, {}).pipe(map((result: any) => {
        return result.addCategories;
      })
      );
  }

  update(categorie: ICatalog) {
    return this.set(
      UPDATE_CATEGORIE,
      {
        categorie
      }, {}).pipe(map((result: any) => {
        return result.updateCategorie;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_CATEGORIE,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockCategorie;
      })
      );
  }

  getCategories(page: number = 1, itemsPage: number = 10, filterName: String = "") {
    return this.get(CATEGORIES_LIST_QUERY, {
      page, itemsPage, filterName
    }).pipe(map((result: any) => {
      return result.categories;
    }));
  }

  next() {
    return this.get(
      CATEGORIE_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.categorieId.categorieId;
    }));
  }
}
