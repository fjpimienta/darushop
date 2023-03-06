import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

import { LOGIN_QUERY, ME_DATA_QUERY } from '@graphql/operations/query/user';
import { IMeData, ISession } from '@core/interfaces/session.interface';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class AuthenticationService extends ApiService {

  accessVar = new Subject<IMeData>();
  accessVar$ = this.accessVar.asObservable();

  constructor(apollo: Apollo, private router: Router) {
    super(apollo);
  }

  start(): void {
    if (this.getSession() !== null) {
      this.getMe().subscribe((result: IMeData) => {
        if (!result.status) {
          this.resetSession();
          return;
        }
        this.updateSession(result);
      });
      this.updateSession({
        status: false
      });
      console.log('Sesión iniciada');
      return;
    }
    console.log('Sesión no iniciada');
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string): any {
    return this.get(LOGIN_QUERY, { email, password, include: false }).pipe(
      map((result: any) => {
        return result.login;
      })
    );
  }

  getMe(): any {
    return this.get(ME_DATA_QUERY, { include: false },
      {
        headers: new HttpHeaders({
          Authorization: (this.getSession() as ISession).token
        })
      }
    ).pipe(
      map((result: any) => {
        return result.me;
      })
    );
  }

  setSession(token: string, expiresTimeInHours = 1): void {
    const date = new Date();
    date.setHours(date.getHours() + expiresTimeInHours);

    const session: ISession = {
      expiresIn: new Date(date).toISOString(),
      token
    };
    localStorage.setItem('session', JSON.stringify(session));
  }

  getSession(): ISession {
    return JSON.parse(localStorage.getItem('session'));
  }

  updateSession(newValue: IMeData): void {
    this.accessVar.next(newValue);
  }

  resetSession(): void {
    localStorage.removeItem('session');
    this.updateSession({ status: false });
  }

}

