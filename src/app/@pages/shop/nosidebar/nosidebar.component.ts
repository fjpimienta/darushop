import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { UtilsService } from '@core/services/utils.service';
import { ApiService } from '@graphql/services/api.service';
import { Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'shop-nosidebar-page',
  templateUrl: './nosidebar.component.html',
  styleUrls: ['./nosidebar.component.scss']
})

export class NosidebarPageComponent implements OnInit {

  products = [];
  perPage = 48;
  type = 'boxed';
  totalCount = 0;
  orderBy: string = 'nameAsc';
  sortDirection: number = 1;
  searchTerm = '';
  containerClass = 'container';
  cols = "col-6 col-md-4 col-lg-4 col-xl-3";
  loaded = false;
  moreLoading = false;
  params = {};
  pageTitle: string = '';
  previousPageUrl: string = '';
  previousPageTitle: string = '';
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    public utilsService: UtilsService,
    public apiService: ApiService
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
          const url = navigation.previousNavigation.finalUrl.toString();
          const firstSlashIndex = url.indexOf('/');
          const secondSlashIndex = url.indexOf('/', firstSlashIndex + 1);
          if (firstSlashIndex !== -1 && secondSlashIndex !== -1) {
            const previousPageTitle = url.substring(firstSlashIndex + 1, secondSlashIndex);
            this.previousPageTitle = previousPageTitle;
          } else if (firstSlashIndex !== -1) {
            this.previousPageTitle = url.substring(firstSlashIndex + 1);
          } else {
            this.previousPageTitle = url;
          }
          this.previousPageUrl = navigation.previousNavigation.finalUrl.toString();
        }
      });
    this.activeRoute.params.subscribe(params => {
      this.type = params['type'];
      if (this.type == 'boxed') {
        this.pageTitle = 'Boxed No Sidebar';
        this.containerClass = 'container';
        this.cols = "col-6 col-md-4 col-lg-4 col-xl-3";
      } else {
        this.pageTitle = 'Fullwidth No Sidebar';
        this.containerClass = 'container-fluid'
        this.cols = "col-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2";
      }
    });

    this.activeRoute.queryParams.subscribe(params => {
      this.params = params;
      this.perPage = 48;
      this.loadProducts();
    })
  }

  ngOnInit(): void {
    this.activeRoute.data.subscribe((data: { title: string }) => {
      this.pageTitle = data.title || this.pageTitle;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadProducts() {
    this.loaded = false;

    if (this.params['searchTerm']) {
      this.searchTerm = this.params['searchTerm'];
    } else {
      this.searchTerm = '';
    }

    if (this.params['orderBy']) {
      this.orderBy = this.params['orderBy'];
    } else {
      this.orderBy = 'default';
    }

    // this.apiService.fetchShopData(this.params, this.perPage).subscribe(result => {
    //   this.products = result.products;
    //   this.totalCount = result.totalCount;
    //   this.loaded = true;

    //   this.utilsService.scrollToPageContent();
    // })
  }

  sortProducts(): void {
    switch (this.orderBy) {
      case 'nameAsc':
        this.products.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          return this.sortDirection * nameA.localeCompare(nameB);
        });
        break;
      case 'nameDesc':
        this.products.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          return this.sortDirection * nameB.localeCompare(nameA);
        });
        break;
      case 'priceAsc':
        this.products.sort((a, b) => {
          return this.sortDirection * (a.price - b.price);
        });
        break;
      case 'priceDesc':
        this.products.sort((a, b) => {
          return this.sortDirection * (b.price - a.price);
        });
        break;
      default:
        // Orden predeterminado por nombre ascendente
        this.products.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          return this.sortDirection * nameA.localeCompare(nameB);
        });
    }
  }

  changeOrderBy(event: any): void {
    const selectedValue = event.target.value;

    // Actualizar la dirección de ordenamiento
    if (this.orderBy === selectedValue) {
      this.sortDirection = -this.sortDirection; // Cambiar entre ascendente y descendente si la misma opción se selecciona de nuevo
    } else {
      this.sortDirection = 1; // Restablecer la dirección a ascendente si se selecciona una opción diferente
    }

    // Actualizar el valor de orderBy
    this.orderBy = selectedValue;

    // Llamar a la función de ordenamiento
    this.sortProducts();
  }

  toggleSidebar() {
    if (document.querySelector('body').classList.contains('sidebar-filter-active'))
      document.querySelector('body').classList.remove('sidebar-filter-active');
    else
      document.querySelector('body').classList.add('sidebar-filter-active');
  }

  hideSidebar() {
    document.querySelector('body').classList.remove('sidebar-filter-active');
  }

  loadMore(e: Event) {
    e.preventDefault();
    if (this.products.length < this.totalCount) {
      this.moreLoading = true;

      // setTimeout(() => {
      //   this.apiService.fetchShopData(this.params, 4, 'shop?from=' + this.perPage).subscribe(result => {
      //     this.products = [...this.products, ...result.products];
      //     this.totalCount = result.totalCount;
      //     this.moreLoading = false;
      //   })

      //   this.perPage += 4;
      // }, 500);
    }
  }
}
