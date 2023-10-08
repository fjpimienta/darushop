import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UtilsService } from '@core/services/utils.service';
import { ApiService } from '@graphql/services/api.service';

import { cats, brandsJson, bannerSlider, brandSlider } from './data';

@Component({
  selector: 'shop-market-page',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})

export class MarketPageComponent implements OnInit {

  brandsJson = brandsJson;
  cats = cats;
  introSlider = bannerSlider;
  brandSlider = brandSlider;
  products = [];
  perPage = 48;
  type: 'list';
  totalCount = 0;
  orderBy: string = 'nameAsc';
  sortDirection: number = 1;
  pageTitle = 'List';
  toggle = false;
  searchTerm = '';
  loaded = false;
  firstLoad = false;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public apiService: ApiService,
    public utilsService: UtilsService
  ) {
    this.activeRoute.queryParams.subscribe(params => {
      this.loaded = false;
      if (params['searchTerm']) {
        this.searchTerm = params['searchTerm'];
      } else {
        this.searchTerm = '';
      }

      if (params['orderBy']) {
        this.orderBy = params['orderBy'];
      } else {
        this.orderBy = 'default';
      }

      // this.apiService.fetchShopData(params, this.perPage).subscribe(result => {
      //   this.products = result.products;
      //   this.totalCount = result.totalCount;
      //   this.loaded = true;
      //   this.perPage = 12;
      //   if (this.perPage >= this.totalCount) {
      //     this.perPage = this.totalCount;
      //   }

      //   if (!this.firstLoad) {
      //     this.firstLoad = true;
      //   }

      //   this.utilsService.scrollToPageContent('.products');
      // })
    })
  }

  ngOnInit(): void {
    if (window.innerWidth > 991) this.toggle = false;
    else this.toggle = true;
  }

  @HostListener('window: resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 991) this.toggle = false;
    else this.toggle = true;
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
}
