import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalog } from '@core/models/catalog.models';

import { ApiService } from '@core/services/api.service';
import { BrandsService } from '@core/services/brand.service';
import { CategoriesService } from '@core/services/categorie.service';
import { ConfigsService } from '@core/services/config.service';
import { ProductsService } from '@core/services/products.service';
import { UtilsService } from '@core/services/utils.service';

import { cats, brandsJson, bannerSlider, brandSlider } from '../market/data';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  brandsJson = brandsJson;
  cats = cats;
  introSlider = bannerSlider;
  brandSlider = brandSlider;
  brands: Catalog[];
  categories: Catalog[];
  products = [];
  page = 1;
  perPage = 12;
  type: 'list';
  totalCount = 0;
  orderBy = 'default';
  pageTitle = 'List';
  toggle = false;
  searchTerm = '';
  loaded = false;
  firstLoad = false;
  offer = 0;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public apiService: ApiService,
    public utilsService: UtilsService,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService,
    public productService: ProductsService,
    public configsService: ConfigsService
  ) {
    this.activeRoute.queryParams.subscribe(async params => {
      this.loaded = false;
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
      if (params.page) {
        this.page = parseInt(params.page, 10);
      } else {
        this.page = 1;
      }
      this.configsService.getConfig('1').subscribe((result) => {
        this.offer = result.offer;
        this.productService.getProducts(this.page, this.perPage,
          this.searchTerm.toLowerCase(),
          this.offer).subscribe(result => {
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

      // this.brands = [];
      // this.brandsService.getBrands(1, -1).subscribe(result => {
      //   this.brands = result.brands;
      // });
      // this.categories = [];
      // this.categoriesService.getCategories(1, -1).subscribe(result => {
      //   result.categories.forEach(cat => {
      //     cat.param = {
      //       category: cat.slug,
      //       description: cat.description
      //     };
      //   });
      //   this.categories = result.categories;
      // });
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
