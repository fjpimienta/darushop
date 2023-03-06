import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { UtilsService } from '@core/services/utils.service';
import { ModalService } from '@core/services/modal.service';
import { AuthenticationService } from '@core/services/auth.service';

import jwtDecode from 'jwt-decode';
import { IMeData } from '@core/interfaces/session.interface';
import { ConfigsService } from '@core/services/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  @Input() containerClass = 'container';

  wishCount = 0;
  session: IMeData = {
    status: false
  };
  access = false;
  sistema = false;
  role: string;
  userName = '';
  moneda = 'MXN';
  exchangeRate: string;
  offer: number;

  constructor(
    public router: Router,
    public utilsService: UtilsService,
    public modalService: ModalService,
    public authService: AuthenticationService,
    public configsService: ConfigsService
  ) {
    this.authService.accessVar$.subscribe((result) => {
      this.session = result;
      this.access = this.session.status;
      this.role = this.session.user?.role;
      this.userName = `${this.session.user?.name} ${this.session.user?.lastname}`;
      // Si es usario DARU (administrador o vendedor) para acceso al sistema
      this.sistema = (this.role === 'ADMIN' || 'SELLER') ? true : false;
    });
    // this.sistema = false;  // Si es usario DARU para acceso al sistema
    // this.userName = 'Nombre del usuario';
    this.configsService.getConfig('1').subscribe((result) => {
      this.exchangeRate = result.exchange_rate;
      this.offer = result.offer;
    });
  }

  ngOnInit(): void {
    this.authService.start();
    if (this.authService.getSession() !== null) {
      if (this.verificarUsuario()) {
        this.userName = 'Usuario';
      }
    }
  }

  verificarUsuario(): boolean {
    // Primero comprobar que existe sesion
    if (this.authService.getSession() !== null) {
      const dataDecode = this.decodeToken();
      return true;
      // // Comprobar que no esta caducado el token
      // if (dataDecode.exp < new Date().getTime() / 1000) {
      //   console.log('Sesion caducada');
      //   this.closeNav();
      //   return this.redirect();
      // }
      // // Dependiendo del rol de usuario, va al checkout o al order
      // if (dataDecode.user.role === 'CLIENT') {
      //   this.router.navigate(['/checkout']);
      //   this.closeNav();
      //   return true;
      // }
      // if (dataDecode.user.role === 'SELLER') {
      //   this.router.navigate(['/order']);
      //   this.closeNav();
      //   return true;
      // }
    } else {
      this.closeNav();
      return this.redirect();
    }
  }

  showLoginModal(event: Event, tipo: number): void {
    event.preventDefault();
    this.modalService.showLoginModal(tipo);
  }

  logout(): void {
    this.authService.resetSession();
    this.router.navigate(['/']);
  }

  decodeToken() {
    return jwtDecode(this.authService.getSession().token);
  }

  redirect(): boolean {
    this.router.navigate(['/login']);
    return false;
  }

  closeNav(): void {
    // this.cartService.close();
  }

  showInfoUser(event: Event): void {
    console.log('Datos del usuario/Event: ', event);
  }

}
