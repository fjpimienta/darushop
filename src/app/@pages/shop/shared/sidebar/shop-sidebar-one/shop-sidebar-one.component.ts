import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { shopData } from '../../data';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '@core/services/categorie.service';
import { BrandsService } from '@core/services/brand.service';
import { Catalog } from '@core/models/catalog.models';
import { ProductsService } from '@core/services/products.service';
import { BrandsGroupsService } from '@core/services/brandgroup.service';
import { CategorysGroupsService } from '@core/services/categorygroup.service';

@Component({
  selector: 'app-shop-sidebar-one',
  templateUrl: './shop-sidebar-one.component.html',
  styleUrls: ['./shop-sidebar-one.component.scss']
})

export class ShopSidebarOneComponent implements OnInit, OnChanges {

  @Input() toggle = false;
  @Input() products = [];

  shopData = shopData;
  params = {};
  @Input() offer: boolean;
  brands: any[] = [];
  categories: Catalog[] = [];
  brandsTmp: Catalog[] = [];
  categoriesTmp: Catalog[] = [];
  searchQuery: string = '';
  searchQueryCat: string = '';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public brandsGroupsService: BrandsGroupsService,
    public categorysgroupService: CategorysGroupsService
  ) {
    activeRoute.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  ngOnInit(): void {
    this.brands = [];
    this.brands = this.extractUniqueBrands();
    this.brands = this.formatBrandsForHTML(this.brands);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.products) {
      // La propiedad 'products' ha cambiado, realiza lo que necesites aquí
      this.brands = this.extractUniqueBrands();
      this.brands = this.formatBrandsForHTML(this.brands);
    }
  }

  extractUniqueBrands(): string[] {
    const uniqueBrands: string[] = [];
    // Recorre la lista de productos y agrega las marcas únicas a uniqueBrands
    for (const product of this.products) {
      for (const brand of product.brands) {
        if (!uniqueBrands.includes(brand.name.toUpperCase())) {
          uniqueBrands.push(brand.name.toUpperCase());
        }
      }
    }
    return uniqueBrands;
  }

  formatBrandsForHTML(brands: string[]): any[] {
    const formattedBrands: any[] = [];
    // Formatea las marcas en el formato deseado para tu HTML
    for (const brand of brands) {
      formattedBrands.push({
        name: brand,
        slug: brand.toLowerCase().replace(' ', '-'),
        description: brand // Puedes ajustar esta parte si la descripción es diferente
      });
    }
    return formattedBrands;
  }

  private sortCatalogs(catalogs: Catalog[]): void {
    catalogs.sort((a, b) => a.description.localeCompare(b.description));
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
