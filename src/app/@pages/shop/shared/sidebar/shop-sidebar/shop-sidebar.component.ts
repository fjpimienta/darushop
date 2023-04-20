import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalog } from '@core/models/catalog.models';
import { BrandsService } from '@core/services/brand.service';
import { CategoriesService } from '@core/services/categorie.service';
import { shopData } from '../../data';

@Component({
  selector: 'app-shop-sidebar',
  templateUrl: './shop-sidebar.component.html',
  styleUrls: ['./shop-sidebar.component.scss']
})
export class ShopSidebarComponent implements OnInit {

  @Input() toggle = false;

  shopData = shopData;
  params = {};
  @Input() brandsProd: Catalog[] = [];
  @Input() categoriesProd: Catalog[] = [];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService
  ) {
    activeRoute.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  ngOnInit(): void {
  }

  onReload(): void {
    console.log('onReload');
    window.location.reload();
  }

  containsAttrInUrl(type: string, value: string): any {
    const currentQueries = this.params[type] ? this.params[type].split(',') : [];
    return currentQueries && currentQueries.includes(value);
  }

  containsPriceInUrl(price: any): boolean {
    let flag = false;
    // tslint:disable-next-line: no-string-literal
    if (this.params['minPrice'] && this.params['minPrice'] === price.min) {
      flag = true;
    }
    else { return false; }

    if (price.max) {
      if (
        // tslint:disable-next-line: no-string-literal
        this.params['maxPrice'] &&
        // tslint:disable-next-line: no-string-literal
        this.params['maxPrice'] === price.max
      ) {
        flag = true;
      }
      else { return false; }
    }
    return true;
  }

  getUrlForAttrs(type: string, value: string): any {
    let currentQueries = this.params[type] ? this.params[type].split(',') : [];
    currentQueries = this.containsAttrInUrl(type, value) ? currentQueries.filter(item => item !== value) : [...currentQueries, value];
    return currentQueries.join(',');
  }

  onAttrClick(attr: string, value: string): void {
    this.router.navigate([], { queryParams: { [attr]: this.getUrlForAttrs(attr, value), page: 1 }, queryParamsHandling: 'merge' });
  }

  onPriceChange(event: any, value: any): void {
    let queryParams: any;
    if (event.currentTarget.checked) {
      queryParams = { ...queryParams, minPrice: value.min, maxPrice: value.max, page: 1 };
    } else {
      queryParams = { ...queryParams, minPrice: 0, maxPrice: 9999, page: 1 };
    }

    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }
}
