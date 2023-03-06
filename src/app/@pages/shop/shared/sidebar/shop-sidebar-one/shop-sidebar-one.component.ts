import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { shopData } from '../../data';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '@core/services/categorie.service';
import { BrandsService } from '@core/services/brand.service';
import { Catalog } from '@core/models/catalog.models';

@Component({
  selector: 'app-shop-sidebar-one',
  templateUrl: './shop-sidebar-one.component.html',
  styleUrls: ['./shop-sidebar-one.component.scss']
})

export class ShopSidebarOneComponent implements OnInit {

  @Input() toggle = false;
  shopData = shopData;
  params = {};
  priceRange: any = [0, 100];
  brands: Catalog[];
  categories: Catalog[];

  @ViewChild('priceSlider') priceSlider: any;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService
  ) {
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

    activeRoute.queryParams.subscribe(params => {
      this.params = params;
      if (params.minPrice && params.maxPrice) {
        this.priceRange = [
          params.minPrice / 10,
          params.maxPrice / 10
        ];
      } else {
        this.priceRange = [0, 100];

        if (this.priceSlider) {
          this.priceSlider.slider.reset({ min: 0, max: 100 });
        }
      }
    });
  }

  ngOnInit(): void {
  }

  containsAttrInUrl(type: string, value: string) {
    const currentQueries = this.params[type] ? this.params[type].split(',') : [];
    return currentQueries && currentQueries.includes(value);
  }

  getUrlForAttrs(type: string, value: string) {
    let currentQueries = this.params[type] ? this.params[type].split(',') : [];
    currentQueries = this.containsAttrInUrl(type, value) ? currentQueries.filter(item => item !== value) : [...currentQueries, value];
    return currentQueries.join(',');
  }

  onAttrClick(attr: string, value: string): void {
    const url = this.getUrlForAttrs(attr, value);
    this.router.navigate([], { queryParams: { [attr]: this.getUrlForAttrs(attr, value), page: 1 }, queryParamsHandling: 'merge' });
  }

  filterPrice(): void {
    this.router.navigate(
      [],
      {
        queryParams: { minPrice: this.priceRange[0] * 10, maxPrice: this.priceRange[1] * 10, page: 1 },
        queryParamsHandling: 'merge'
      });
  }

  changeFilterPrice(value: any): void {
    this.priceRange = [value[0], value[1]];
  }
}
