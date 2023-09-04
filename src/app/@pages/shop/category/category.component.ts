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

  products: any[] = [];
  page = 1;
  perPage = 48;
  type: string = 'list';
  totalCount = 0;
  orderBy = 'default';
  pageTitle = 'List';
  toggle = false;
  searchTerm = '';
  loaded = false;
  firstLoad = false;
  brands: string[] = [];
  categories: string[] = [];
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

      this.orderBy = params.orderBy || 'default';

      this.brands = params.brand ? params.brand.split(',') : [];

      this.categories = params.category ? [params.category] : [];
      console.log('params.category: ', params.category);
      console.log('this.categories.0: ', this.categories);

      this.page = params.page ? parseInt(params.page, 10) : 1;

      this.perPage = 48;

      if (this.categories.length > 0) {
        const category = this.categories[0];
        console.log('category: ', category);
        this.categoriesService.getCategories(1, -1, category).subscribe(result => {
          console.log('result: ', result);
          if (result.categories.length > 0) {
            this.categories = result.categories.map(cat => cat.slug);
          }
          console.log('this.categories.1: ', this.categories);
          this.loadProducts();
        });
      } else {
        this.loadProducts();
      }
    });
  }

  ngOnInit(): void {
    this.toggle = window.innerWidth <= 991;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.toggle = window.innerWidth <= 991;
  }

  changeOrderBy(event: any): void {
    this.router.navigate([], { queryParams: { orderBy: event.currentTarget.value, page: 1 }, queryParamsHandling: 'merge' });
  }

  toggleSidebar(): void {
    const body = document.querySelector('body');
    if (body && body.classList.contains('sidebar-filter-active')) {
      body.classList.remove('sidebar-filter-active');
    } else if (body) {
      body.classList.add('sidebar-filter-active');
    }
  }

  hideSidebar(): void {
    const body = document.querySelector('body');
    if (body) {
      body.classList.remove('sidebar-filter-active');
    }
  }

  private loadProducts(): void {
    console.log('this.page: ', this.page);
    console.log('this.perPage: ', this.perPage);
    console.log('this.searchTerm.toLowerCase(): ', this.searchTerm.toLowerCase());
    console.log('this.offer: ', this.offer);
    console.log('this.brands: ', this.brands);
    console.log('this.categories.2: ', this.categories);
    this.productService.getProducts(
      this.page, this.perPage, this.searchTerm.toLowerCase(), this.offer, this.brands, this.categories
    ).subscribe(result => {
      console.log('getProducts/result: ', result);
      this.products = result.products;
      if (this.brands.length > 0) {
        this.products = this.utilsService.braFilter(this.products, this.brands);
      }
      if (this.categories.length > 0) {
        this.products = this.utilsService.catFilter(this.products, this.categories);
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
  }
}
