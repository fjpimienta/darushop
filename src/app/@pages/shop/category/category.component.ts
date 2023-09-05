import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalog } from '@core/models/catalog.models';

import { BrandsService } from '@core/services/brand.service';
import { CategoriesService } from '@core/services/categorie.service';
import { ConfigsService } from '@core/services/config.service';
import { ProductsService } from '@core/services/products.service';
import { UtilsService } from '@core/services/utils.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  products = [];
  page = 1;
  perPage = 48;
  type: 'list';
  totalCount = 0;
  orderBy = 'default';
  pageTitle = 'List';
  toggle = false;
  searchTerm = '';
  loaded = false;
  firstLoad = false;
  brands = [];
  categories = [];
  offer: boolean = false;
  brandsProd: Catalog[] = [];
  categoriesProd: Catalog[] = [];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public utilsService: UtilsService,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService,
    public productService: ProductsService,
    public configsService: ConfigsService
  ) {
    this.activeRoute.params.subscribe(params => {
      this.type = params.type;
    });

    this.activeRoute.queryParams.subscribe(params => {
      this.loaded = false;
      this.offer = false;
      this.pageTitle = params.description || 'List';
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
      this.page = params.page ? parseInt(params.page, 10) : 1;
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
          this.products.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // Convertir a mayúsculas para asegurar un ordenamiento sin distinción entre mayúsculas y minúsculas
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
              return -1; // a debe aparecer antes que b
            } else if (nameA > nameB) {
              return 1; // b debe aparecer antes que a
            } else {
              return 0; // a y b son iguales en términos de orden
            }
          });
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
  }

  @HostListener('window: resize', ['$event'])
  onResize(event: Event): void {
    this.toggle = window.innerWidth <= 991;
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
