import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@core/services/products.service';
import { UtilsService } from '@core/services/utils.service';
import { ApiService } from '@graphql/services/api.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  products = [];
  perPage = 0;
  type = 'boxed';
  totalCount = 0;
  orderBy = 'default';
  pageTitle: string;
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

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public utilsService: UtilsService,
    public apiService: ApiService,
    public productService: ProductsService
  ) {
    this.toggle = false;
    this.activeRoute.params.subscribe(params => {
      this.type = params.type;
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

      this.pageTitle = 'Marca';
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
        this.pageTitle += ' (' + params.brand + ')';
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
