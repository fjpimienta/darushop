import Cookie from 'js-cookie';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { routeAnimation } from '../data';

import { environment } from 'src/environments/environment';
import { ConfigsService } from '@core/services/config.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    routeAnimation
  ]
})

export class LayoutComponent implements OnInit, OnDestroy {

  containerClass = 'container';
  isBottomSticky = false;
  current = '/';
  showTopNotice = !Cookie.get('closeTopNotice-' + environment.demo);
  mensaje = 'Mensaje de Promocion';

  private subscr: Subscription;

  constructor(
    private router: Router,
    public configsService: ConfigsService
  ) {
    this.subscr = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.current = event.url;
        if (this.current.includes('fullwidth')) {
          this.containerClass = 'container-fluid';
        } else {
          this.containerClass = 'container';
        }

        if (this.current.includes('product/default') && (window.innerWidth > 991)) {
          this.isBottomSticky = true;
        } else {
          this.isBottomSticky = false;
        }
      } else if (event instanceof NavigationEnd) {
        this.current = event.url;
        if (this.current.includes('fullwidth')) {
          this.containerClass = 'container-fluid';
        } else {
          this.containerClass = 'container';
        }

        if (this.current.includes('product/default') && (window.innerWidth > 991)) {
          this.isBottomSticky = true;
        } else {
          this.isBottomSticky = false;
        }
      }
    });
    this.configsService.getConfig('1')
      .then((result) => {
        this.mensaje = result.message;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscr.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  handleKeyDown(event: Event): void {
    this.resizeHandle();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.isActivated && outlet.activatedRoute && outlet.activatedRoute.url;
  }

  resizeHandle(): void {
    if (this.current.includes('product/default') && window.innerWidth > 992) {
      this.isBottomSticky = true;
    }
    else {
      this.isBottomSticky = false;
    }
  }

  closeTopNotice(): void {
    this.showTopNotice = false;
    Cookie.set('closeTopNotice-' + environment.demo, true, { expires: 7 });
  }
}
