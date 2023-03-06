import { Component, OnInit, Input } from '@angular/core';

import { shopData } from '../../data';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalog } from '@core/models/catalog.models';
import { CategoriesService } from '@core/services/categorie.service';
import { BrandsService } from '@core/services/brand.service';

@Component({
  selector: 'app-shop-sidebar-three',
  templateUrl: './shop-sidebar-three.component.html',
  styleUrls: ['./shop-sidebar-three.component.scss']
})

export class ShopSidebarThreeComponent implements OnInit {

  @Input() toggle = false;

  shopData = shopData;
  params = {};
  brands: Catalog[];
  categories: Catalog[];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService
  ) {
    activeRoute.queryParams.subscribe(params => {
      this.params = params;
    });
    this.brands = [];
    this.brandsService.getBrands(1, -1).subscribe(result => {
      this.brands = result.brands;
    });
    this.categories = [];
    this.categoriesService.getCategories(1, -1).subscribe(result => {
      result.categories.forEach(cat => {
        cat.param = {
          category: cat.slug,
          description: cat.description
        };
      });
      this.categories = result.categories;
    });

  }

  ngOnInit(): void {
  }

  containsAttrInUrl(type: string, value: string) {
    const currentQueries = this.params[type] ? this.params[type].split(',') : [];
    return currentQueries && currentQueries.includes(value);
  }

  containsPriceInUrl(price: any): boolean {
    let flag = false;
    if (this.params['minPrice'] && this.params['minPrice'] === price.min) {
      flag = true;
    }
    else { return false; }

    if (price.max) {
      if (
        this.params['maxPrice'] &&
        this.params['maxPrice'] === price.max
      ) {
        flag = true;
      }
      else { return false; }
    }
    return true;
  }

  getUrlForAttrs(type: string, value: string) {
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
