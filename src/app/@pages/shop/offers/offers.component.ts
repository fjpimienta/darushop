import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Catalog } from '@core/models/catalog.models';

import { BrandsService } from '@core/services/brand.service';
import { CategoriesService } from '@core/services/categorie.service';
import { ConfigsService } from '@core/services/config.service';
import { ProductsService } from '@core/services/products.service';
import { UtilsService } from '@core/services/utils.service';
import { Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  products = [];
  page = 1;
  perPage = 48;
  type: '4cols';
  totalCount = 0;
  orderBy = 'default';
  pageTitle: string = '';
  previousPageTitle: string = '';
  toggle = false;
  searchTerm = '';
  loaded = false;
  firstLoad = false;
  brands = [];
  categories = [];
  offer: boolean;
  brandsProd: Catalog[] = [];
  categoriesProd: Catalog[] = [];
  minPrice = 0;
  maxPrice = 0;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    public utilsService: UtilsService,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService,
    public productService: ProductsService,
    public configsService: ConfigsService
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
        console.log('this.pageTitle: ', this.pageTitle);
      });
    this.activeRoute.params.subscribe(params => {
      this.type = params.type || '4cols';
    });

    this.activeRoute.queryParams.subscribe(params => {
      this.loaded = false;
      this.offer = true;

      this.pageTitle = params.description;

      this.searchTerm = params.searchTerm || '';

      this.orderBy = params.orderBy || '';

      if (params.minPrice) {
        this.minPrice = params.minPrice;
      } else {
        this.minPrice = 0;
      }

      if (params.maxPrice) {
        this.maxPrice = params.maxPrice;
      } else {
        this.maxPrice = 0;
      }

      this.brands = null;
      if (params.brand) {
        this.brands = [];
        this.brands = params.brand.split(',');
      }
      this.categories = null;
      if (params.category) {
        this.categories = [];
        this.categories.push(params.category);
      }
      if (params.page) {
        this.page = parseInt(params.page, 10);
      } else {
        this.page = 1;
      }
      this.perPage = 48;
      this.productService.getProducts(
        this.page, this.perPage, this.searchTerm.toLowerCase(), this.offer, this.brands, this.categories
      ).subscribe(result => {
        this.products = result.products;
        const category = [[]];
        let brands: string[] = [];
        if (params.brand) {
          brands = params.brand.split(',');
          this.products = utilsService.braFilter(this.products, brands);
        }
        if (params.brands) {
          brands.push(params.brands);
          this.products = utilsService.braFilter(this.products, brands);
        }
        if (params.category) {
          category.push(params.category);
          this.products = utilsService.catFilter(this.products, category);
        }
        if (this.orderBy) {
          switch (this.orderBy) {
            case 'name':
              this.products.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                  return -1;
                } else if (nameA > nameB) {
                  return 1;
                } else {
                  return 0;
                }
              });
              break;
            case 'price':
              this.products.sort((a, b) => {
                return a.price - b.price;
              });
              break;
            default:
              this.products.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                  return -1;
                } else if (nameA > nameB) {
                  return 1;
                } else {
                  return 0;
                }
              });
          }
        }
        this.loaded = true;
        this.totalCount = result.info.total;
        if (this.perPage >= this.totalCount) {
          this.perPage = this.totalCount;
        }
        if (!this.firstLoad) {
          this.firstLoad = true;
        }
        this.utilsService.scrollToPageContent();
      });
    });
  }

  ngOnInit(): void {
    if (window.innerWidth > 991) { this.toggle = false; }
    else { this.toggle = true; }
    this.activeRoute.data.subscribe((data: { title: string }) => {
      this.pageTitle = data.title || this.pageTitle;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @HostListener('window: resize', ['$event'])
  onResize(event: Event): void {
    if (window.innerWidth > 991) { this.toggle = false; }
    else { this.toggle = true; }
  }

  changeOrderBy(event: any): void {
    this.router.navigate([], { queryParams: { orderBy: event.currentTarget.value, page: 1 }, queryParamsHandling: 'merge' });
  }

  toggleSidebar(): void {
    if (document.querySelector('body').classList.contains('sidebar-filter-active')) {
      document.querySelector('body').classList.remove('sidebar-filter-active');
    }
    else {
      document.querySelector('body').classList.add('sidebar-filter-active');
    }
  }

  hideSidebar(): void {
    document.querySelector('body').classList.remove('sidebar-filter-active');
  }
}
