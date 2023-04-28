import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { shopData } from '../../data';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '@core/services/categorie.service';
import { BrandsService } from '@core/services/brand.service';
import { Catalog } from '@core/models/catalog.models';
import { BrandsGroupsService } from '@core/services/brandgroup.service';
import { CategorysGroupsService } from '@core/services/categorygroup.service';
import { CatalogGroup } from '@core/models/cataloggroup.models';

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
  brandsGroup: CatalogGroup[] = [];
  categorysGroup: CatalogGroup[] = [];

  @ViewChild('priceSlider') priceSlider: any;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService,
    public brandsgroupService: BrandsGroupsService,
    public categorysgroupService: CategorysGroupsService
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

    this.brandsgroupService.getBrandsGroup().subscribe(result => {
      result.brandsgroups.forEach(brand => {
        const brandGroup = new CatalogGroup();
        brandGroup.total = brand.total;
        brandGroup.name = brand._id[0].name;
        brandGroup.slug = brand._id[0].slug;
        this.brandsGroup.push(brandGroup);
      });
    });
    this.categorysgroupService.getCategorysGroup().subscribe(result => {
      result.categorysgroups.forEach(category => {
        const categoryGroup = new CatalogGroup();
        categoryGroup.total = category.total;
        categoryGroup.name = category._id[0].name;
        categoryGroup.slug = category._id[0].slug;
        this.categorysGroup.push(categoryGroup);
      });
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
