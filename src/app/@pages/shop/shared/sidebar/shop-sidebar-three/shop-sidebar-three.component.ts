import { Component, OnInit, Input } from '@angular/core';

import { shopData } from '../../data';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalog } from '@core/models/catalog.models';
import { BrandsGroupsService } from '@core/services/brandgroup.service';
import { CategorysGroupsService } from '@core/services/categorygroup.service';

@Component({
  selector: 'app-shop-sidebar-three',
  templateUrl: './shop-sidebar-three.component.html',
  styleUrls: ['./shop-sidebar-three.component.scss']
})

export class ShopSidebarThreeComponent implements OnInit {

  @Input() toggle = false;

  shopData = shopData;
  params = {};
  brands: Catalog[] = [];
  categories: Catalog[] = [];
  brandsTmp: Catalog[] = [];
  categoriesTmp: Catalog[] = [];
  searchQuery: string = '';
  searchQueryCat: string = '';
  offer: boolean;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public brandsGroupsService: BrandsGroupsService,
    public categorysgroupService: CategorysGroupsService
  ) {
    activeRoute.queryParams.subscribe(params => {
      this.params = params;
    });
    this.offer = false;
  }

  ngOnInit(): void {
    this.loadCategoriesAndBrands();
  }

  private loadCategoriesAndBrands(): void {
    this.brands = [];
    this.categories = [];
    this.brandsTmp = [];
    this.categoriesTmp = [];
    this.categorysgroupService.getCategorysGroup().subscribe(result => {
      this.categories = result.categorysgroups.map(category => this.mapCatalog(category));
      this.sortCatalogs(this.categories);
      this.categoriesTmp = [...this.categories]; // Copiar datos originales
    });

    this.brandsGroupsService.getBrandsGroup().subscribe(result => {
      this.brands = result.brandsgroups.map(group => this.mapCatalog(group));
      this.sortCatalogs(this.brands);
      this.brandsTmp = [...this.brands]; // Copiar datos originales
    });
  }

  private mapCatalog(data: any): Catalog {
    const catalog = new Catalog();
    catalog.id = data._id[0].slug;
    catalog.slug = data._id[0].slug;
    catalog.description = data._id[0].name.toUpperCase().slice(0, 32);
    catalog.total = data.total;
    return catalog;
  }

  private sortCatalogs(catalogs: Catalog[]): void {
    catalogs.sort((a, b) => a.description.localeCompare(b.description));
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
