import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

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

export class ShopSidebarThreeComponent implements OnInit, OnChanges {

  @Input() toggle = false;
  @Input() products = [];

  productsTmp = [];
  shopData = shopData;
  params = {};
  brands: any[] = [];
  categories: Catalog[] = [];
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
    this.productsTmp = this.products;
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
    for (const product of this.productsTmp) {
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
