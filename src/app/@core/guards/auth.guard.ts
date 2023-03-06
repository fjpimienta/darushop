import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@core/services/auth.service';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Primero comprobar que existe sesion
    if (this.authService.getSession() !== null) {
      const dataDecode = this.decodeToken();
      // Comprobar que no esta caducado el token
      if (dataDecode.exp < new Date().getTime() / 1000) {
        console.log('Sesion caducada');
        return this.redirect();
      }
      // El role del usuario es ADMIN
      if (dataDecode.user.role === 'ADMIN' || dataDecode.user.role === 'SELLER') {
        return true;
      }
      return this.redirect();
    }
    console.log('Sesion no iniciada');
    return this.redirect();
  }

  redirect(): boolean {
    this.router.navigate(['/login']);
    return false;
  }

  decodeToken(): any {
    return jwtDecode(this.authService.getSession().token);
  }
}
