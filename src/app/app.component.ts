import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter, first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Store } from '@ngrx/store';

import { StoreService } from '@core/store/store.service';
import { UtilsService } from '@core/services/utils.service';

import { RefreshStoreAction } from '@core/actions/actions';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  constructor(
    public store: Store<any>,
    public router: Router,
    public viewPort: ViewportScroller,
    public storeService: StoreService,
    public utilsService: UtilsService,
    public modalService: NgbModal
  ) {
    const navigationEnd = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );

    navigationEnd.pipe(first()).subscribe(() => {
      document.querySelector('body')?.classList.add('loaded');
      const timer = setInterval(() => {
        if (window.getComputedStyle(document.querySelector('body')).visibility === 'visible') {
          clearInterval(timer);
          $('.owl-carousel').trigger('refresh.owl.carousel');
        }
      }, 300);
    });

    navigationEnd.subscribe((event: any) => {
      if (!event.url.includes('/sidebar') && !event.url.includes('/nosidebar')
        && !event.url.includes('/market') && !event.url.includes('/blog')) {
        this.viewPort.scrollToPosition([0, 0]);
      }

      if (event.url === '/') {
        document.querySelector('.sticky-wrapper').classList.remove('bg-black');
      } else {
        console.log('navigationEnd/event.url: ', event.url);
        if (event.url !== '/soon') {
          document.querySelector('.sticky-wrapper').classList.add('bg-black');
        }
      }

      this.modalService.dismissAll();
    });

    if (localStorage.getItem('app-angular-demo') !== environment.demo) {
      this.store.dispatch(new RefreshStoreAction());
    }

    localStorage.setItem('app-angular-demo', environment.demo);
  }

  @HostListener('window: scroll', ['$event'])
  onWindowScroll(e: Event): void {
    this.utilsService.setStickyHeader();
  }

  hideMobileMenu(): void {
    document.querySelector('body').classList.remove('mmenu-active');
    document.querySelector('html').style.overflowX = 'unset';
  }
}
