import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, combineLatest } from 'rxjs';

import { WishlistService } from '@core/services/wishlist.service';

import { environment } from 'src/environments/environment';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'shop-wishlist-page',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})

export class WishlistComponent implements OnInit, OnDestroy {

  wishItems = [];
  SERVER_URL = environment.SERVER_URL;

  type: '4cols';
  private subscr: Subscription;
  pageTitle: string = '';
  previousPageTitle: string = '';
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    public wishlistService: WishlistService
  ) {
    combineLatest([
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
      this.activeRoute.data
    ])
      .pipe(takeUntil(this.unsubscribe$)) // Unsubscribe cuando el componente se destruye
      .subscribe(([navigationEnd, data]: [NavigationEnd, { title: string }]) => {
        // Obtener el título de la página actual a través de activeRoute.data
        this.pageTitle = data.title || '';
        // Obtener el título de la página anterior del historial de navegación
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.previousNavigation) {
          this.previousPageTitle = navigation.previousNavigation.finalUrl.toString();
        } else {
          this.previousPageTitle = '';
        }
      });
    this.activeRoute.params.subscribe(params => {
      this.type = params.type || '4cols';
    });
  }

  ngOnInit(): void {
    this.activeRoute.data.subscribe((data: { title: string }) => {
      this.pageTitle = data.title || this.pageTitle;
    });
    this.subscr = this.wishlistService.wishlistStream.subscribe(items => {
      this.wishItems = items.reduce((acc, product) => {
        let max = 0;
        let min = 999999;
        product.variants.map(item => {
          if (min > item.price) min = item.price;
          if (max < item.price) max = item.price;
        }, []);

        if (product.variants.length == 0) {
          min = product.sale_price
            ? product.sale_price
            : product.price;
          max = product.price;
        }

        return [
          ...acc,
          {
            ...product,
            minPrice: min,
            maxPrice: max
          }
        ];
      }, []);
    });
  }

  ngOnDestroy(): void {
    this.subscr.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
