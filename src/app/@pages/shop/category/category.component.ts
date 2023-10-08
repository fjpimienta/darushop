import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { ProductsService } from '@core/services/products.service';
import { UtilsService } from '@core/services/utils.service';
import { Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  products = [];
  page = 1;
  perPage = 0;
  type: 'list';
  totalCount = 0;
  orderBy: string = 'nameAsc';
  sortDirection: number = 1;
  pageTitle: string = '';
  previousPageTitle: string = '';
  toggle = false;
  searchTerm = '';
  loaded = false;
  firstLoad = false;
  brands = [];
  categories = [];
  subCategories = [];
  offer: boolean = false;
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
    this.activeRoute.queryParams.subscribe(params => {
      this.loaded = false;
      this.offer = false;

      this.pageTitle = params.category.toUpperCase() || '';
      this.searchTerm = params.searchTerm || '';
      this.orderBy = params.orderBy || '';

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
      this.subCategories = null;
      if (params.subCategory) {
        this.subCategories = [];
        this.subCategories.push(params.subCategory);
      }
      this.page = params.page ? parseInt(params.page, 10) : 1;
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
        let brands: string[] = [];
        if (params.brand) {
          brands = params.brand.split(',');
          this.products = utilsService.braFilter(this.products, brands);
        }
        if (params.brands) {
          brands.push(params.brands);
          this.products = utilsService.braFilter(this.products, brands);
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
    this.toggle = window.innerWidth <= 991;
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
    this.toggle = window.innerWidth <= 991;
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
}
