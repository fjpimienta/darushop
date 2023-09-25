import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductsService } from '@core/services/products.service';
import { UtilsService } from '@core/services/utils.service';
import { ApiService } from '@graphql/services/api.service';
import { Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products = [];
  perPage = 0;
  type = 'boxed';
  totalCount = 0;
  orderBy = 'default';
  pageTitle: string = '';
  previousPageTitle: string = '';
  searchTerm = '';
  containerClass = 'container';
  cols = 'col-6 col-md-4 col-lg-4 col-xl-3';
  loaded = false;
  moreLoading = false;
  params = {};
  toggle: boolean;
  page = 1;
  brands = [];
  categories = [];
  offer: boolean;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    public utilsService: UtilsService,
    public apiService: ApiService,
    public productService: ProductsService
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
    this.toggle = false;
    this.activeRoute.params.subscribe(params => {
      this.type = params.type;
      if (this.type === 'boxed') {
        this.pageTitle = 'Productos';
        this.containerClass = 'container';
        this.cols = 'col-6 col-md-4 col-lg-4 col-xl-3';
      } else {
        this.pageTitle = 'Productos';
        this.containerClass = 'container-fluid';
        this.cols = 'col-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2';
      }
    });

    this.activeRoute.queryParams.subscribe(params => {
      this.loaded = false;
      this.offer = false;

      if (params.description) {
        this.pageTitle = params.description;
      }

      if (params.searchTerm) {
        this.searchTerm = params.searchTerm;
      } else {
        this.searchTerm = '';
      }

      if (params.orderBy) {
        this.orderBy = params.orderBy;
      } else {
        this.orderBy = 'default';
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
      this.perPage = 8;
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
        this.utilsService.scrollToPageContent();
      });
    });
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

  loadMore(e: Event): void {
    e.preventDefault();
    if (this.products.length < this.totalCount) {
      this.moreLoading = true;

      setTimeout(() => {
        this.perPage += 4;
        this.productService.getProducts(
          this.page, this.perPage, this.searchTerm.toLowerCase(), this.offer, this.brands, this.categories
        ).subscribe(result => {
          this.products = result.products;
          this.totalCount = result.info.total;
          this.moreLoading = false;
        });
      }, 500);
    }
  }
}
