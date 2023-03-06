import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInput } from '@core/models/user.models';
import { ACTIVE_EMAIL_USER, ACTIVE_USER, BLOCK_USER, REGISTER_USER, UPDATE_USER } from '@graphql/operations/mutation/user';
import { USERS_LIST_QUERY } from '@graphql/operations/query/user';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  getUsers(page: number = 1, itemsPage: number = 10) {
    return this.get(USERS_LIST_QUERY, {
      include: true, itemsPage, page
    }).pipe(map((result: any) => {
      return result.users;
    }));
  }

  register(user: UserInput) {
    return this.set(REGISTER_USER, {
      user,
      include: false
    }).pipe(
      map((result: any) => {
        return result.register;
      })
    );
  }

  update(user: UserInput) {
    return this.set(
      UPDATE_USER,
      {
        user,
        include: false
      }, {}).pipe(map((result: any) => {
        return result.updateUser;
      })
      );
  }

  active(token: string, password: string) {
    const user = JSON.parse(atob(token.split('.')[1])).user;
    return this.set(ACTIVE_USER, {
      id: user.id,
      password
    }, {
      headers: new HttpHeaders({
        Authorization: token
      })
    }).pipe(map((result: any) => {
      return result.activeUserAction;
    }));
  }

  unblock(id: string, unblock: boolean = false, admin: boolean = false) {
    return this.set(
      BLOCK_USER,
      {
        id,
        unblock,
        admin
      }, {}).pipe(map((result: any) => {
        return result.blockUser;
      })
      );
  }

  sendEmailActive(id: string, email: string) {
    return this.set(
      ACTIVE_EMAIL_USER, {
      id,
      email
    }).pipe(map((result: any) => {
      return result.activeUserEmail;
    }));
  }
}
