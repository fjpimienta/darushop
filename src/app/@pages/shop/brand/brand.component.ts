import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductsService } from '@core/services/products.service';
import { UtilsService } from '@core/services/utils.service';
import { Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  products = [];
  perPage = 48;
  type = 'boxed';
  totalCount = 0;
  orderBy: string = 'nameAsc';
  sortDirection: number = 1;
  pageTitle: string = '';
  previousPageUrl: string = '';
  previousPageTitle: string = '';
  queryParams: object = {};
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
  subCategories = [];
  offer: boolean;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public utilsService: UtilsService,
    public productService: ProductsService
  ) {
    combineLatest([
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
      this.activeRoute.data
    ])
      .pipe(takeUntil(this.unsubscribe$)) // Unsubscribe cuando el componente se destruye
      .subscribe(([navigationEnd, data]: [NavigationEnd, { title: string }]) => {
        // Obtener el título de la página anterior del historial de navegación
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.previousNavigation) {
          console.log('navigation?.previousNavigation: ', navigation?.previousNavigation);
          const url = navigation.previousNavigation.finalUrl.toString();
          const firstSlashIndex = url.indexOf('/');
          const questionMarkIndex = url.indexOf('?');
          const secondSlashIndex = url.indexOf('/', firstSlashIndex + 1);
          if (firstSlashIndex !== -1 && secondSlashIndex !== -1) {
            const previousPageTitle = url.substring(firstSlashIndex + 1, secondSlashIndex);
            this.previousPageTitle = previousPageTitle;
          } else if (firstSlashIndex !== -1 && questionMarkIndex !== -1) {
            const previousPageTitle = url.substring(firstSlashIndex + 1, questionMarkIndex);
            this.previousPageTitle = previousPageTitle;
          } else if (firstSlashIndex !== -1) {
            this.previousPageTitle = url.substring(firstSlashIndex + 1);
          } else {
            this.previousPageTitle = url;
          }
          this.previousPageUrl = navigation.previousNavigation.finalUrl.toString();
          this.queryParams = navigation.previousNavigation.finalUrl.queryParams;
        }
      });
    this.toggle = false;
    this.activeRoute.params.subscribe(params => {
      this.type = params.type || '4cols';
      if (this.type === 'boxed') {
        this.containerClass = 'container';
        this.cols = 'col-6 col-md-4 col-lg-4 col-xl-3';
      } else {
        this.containerClass = 'container-fluid';
        this.cols = 'col-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2';
      }
    });

    this.activeRoute.queryParams.subscribe(params => {
      this.loaded = false;
      this.offer = false;

      if (params.description) {
        this.pageTitle = params.description.toUpperCase();
      }

      if (params.searchTerm) {
        this.searchTerm = params.searchTerm;
      } else {
        this.searchTerm = '';
      }

      this.orderBy = params.orderBy || '';

      this.brands = null;
      if (params.brand) {
        this.brands = [];
        this.brands = params.brand.split(',');
        this.pageTitle = params.brand.toUpperCase();
      }
      this.categories = null;
      if (params.category) {
        this.categories = [];
        this.categories.push(params.category);
      }
      this.subCategories = null;
      if (params.subCategory) {
        this.subCategories = [];
        this.subCategories.push(params.subCategory);
      }
      if (params.page) {
        this.page = parseInt(params.page, 10);
      } else {
        this.page = 1;
      }
      this.perPage = 48;
      this.productService.getProducts(
        this.page,
        this.perPage,
        this.searchTerm.toLowerCase(),
        this.offer,
        this.brands,
        this.categories,
        this.subCategories
      ).subscribe(result => {
        this.products = result.products;
        const category = [[]];
        const subCategory = [[]];
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
        if (params.subCategory) {
          subCategory.push(params.subCategory);
          this.products = utilsService.subCatFilter(this.products, subCategory);
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

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
