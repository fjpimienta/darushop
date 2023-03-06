import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ICatalog } from 'src/app/@core/interfaces/catalog.interface';
import { ADD_GROUP, ADD_GROUP_LIST, BLOCK_GROUP, UPDATE_GROUP } from 'src/app/@graphql/operations/mutation/groups';
import { GROUPS_LIST_QUERY, GROUP_ID_QUERY } from 'src/app/@graphql/operations/query/groups';
import { ApiService } from 'src/app/@graphql/services/api.service';
import { map } from 'rxjs/operators';
import { ISupplier } from '@core/interfaces/supplier.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupsService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  add(group: ICatalog) {
    return this.set(
      ADD_GROUP,
      {
        group
      }, {}).pipe(map((result: any) => {
        return result.addGroup;
      })
      );
  }

  addList(groups: [ICatalog], supplier: ISupplier) {
    return this.set(
      ADD_GROUP_LIST,
      {
        groups,
        supplier
      }, {}).pipe(map((result: any) => {
        return result.addGroups;
      })
      );
  }

  update(group: ICatalog) {
    return this.set(
      UPDATE_GROUP,
      {
        group
      }, {}).pipe(map((result: any) => {
        return result.updateGroup;
      })
      );
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_GROUP,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockGroup;
      })
      );
  }

  getGroups(page: number = 1, itemsPage: number = 10) {
    return this.get(GROUPS_LIST_QUERY, {
      itemsPage, page
    }).pipe(map((result: any) => {
      return result.groups;
    }));
  }

  next() {
    return this.get(
      GROUP_ID_QUERY, {}, {}, false
    ).pipe(map((result: any) => {
      return result.groupId.groupId;
    }));
  }
}
