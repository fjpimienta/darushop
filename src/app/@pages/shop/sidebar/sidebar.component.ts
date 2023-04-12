import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductsService } from '@core/services/products.service';
import { UtilsService } from '@core/services/utils.service';

@Component({
  selector: 'app-shop-sidebar-page',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})

export class SidebarPageComponent implements OnInit {
  products = [];
  perPage = 0;
  type = 'list';
  totalCount = 0;
  orderBy = 'default';
  pageTitle = 'Lista';
  toggle = false;
  searchTerm = '';
  loaded = false;
  firstLoad = false;
  brands = [];
  categories = [];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public utilsService: UtilsService,
    public productService: ProductsService
  ) {
    this.activeRoute.params.subscribe(params => {
      this.type = params.type;
    });

    this.activeRoute.queryParams.subscribe(params => {
      this.loaded = false;

      this.pageTitle = params.description;

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
      if (params.brands) {
        this.brands = [];
        this.brands.push(params.brands);
      }
      this.categories = null;
      if (params.category) {
        this.categories = [];
        this.categories.push(params.category);
      }
      this.productService.getProducts(
        1, -1, this.searchTerm.toLowerCase(), null, this.brands, this.categories
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
        this.loaded = true;
        this.totalCount = this.products.length;
        this.perPage = 12;
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
