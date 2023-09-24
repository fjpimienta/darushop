import { Component, OnInit, Input } from '@angular/core';

import { shopData } from '../../data';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '@core/services/categorie.service';
import { BrandsService } from '@core/services/brand.service';
import { Catalog } from '@core/models/catalog.models';
import { ProductsService } from '@core/services/products.service';

@Component({
  selector: 'app-shop-sidebar-one',
  templateUrl: './shop-sidebar-one.component.html',
  styleUrls: ['./shop-sidebar-one.component.scss']
})

export class ShopSidebarOneComponent implements OnInit {

  @Input() toggle = false;

  shopData = shopData;
  params = {};
  @Input() offer: boolean;
  brands: Catalog[] = [];
  categories: Catalog[] = [];
  brandsProd: Catalog[] = [];
  categoriesProd: Catalog[] = [];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService,
    public productService: ProductsService
  ) {
    activeRoute.queryParams.subscribe(params => {
      this.params = params;
      this.brands = [];
      this.categories = [];
      this.productService.getProducts(1, -1, '', this.offer)
        .subscribe(result => {
          const resultBrand = result;
          const resultCategorie = result;
          const brandsProd = resultBrand.products.reduce((products, product) => {
            if (!products[product.brands[0].slug]) {
              products[product.brands[0].slug] = [];
            }
            products[product.brands[0].slug].push({ brands: product.brands[0].name, slug: product.brands[0].slug });
            return products;
          }, {});
          // Ahora, ordenamos las marcas alfabéticamente
          const sortedBrandsProd = {};
          Object.keys(brandsProd).sort().forEach((key) => {
            sortedBrandsProd[key] = brandsProd[key];
          });
          let i = 0;
          Object.keys(sortedBrandsProd).forEach((brand) => {
            i += 1;
            const br = new Catalog();
            br.id = i.toString();
            br.slug = brand;
            br.description = brand.toUpperCase();
            this.brands.push(br);
          });

          const categoriesProd = resultCategorie.products.reduce((products, product) => {
            if (!products[product.category[0].slug]) {
              products[product.category[0].slug] = [];
            }
            products[product.category[0].slug].push({ categories: product.category[0].name, slug: product.category[0].slug });
            return products;
          }, {});
          // Ahora, ordenamos las categorías alfabéticamente
          const sortedCategoriesProd = {};
          Object.keys(categoriesProd).sort().forEach((key) => {
            sortedCategoriesProd[key] = categoriesProd[key];
          });
          let j = 0;
          Object.keys(sortedCategoriesProd).forEach((categorie) => {
            j += 1;
            const br = new Catalog();
            br.id = j.toString();
            br.slug = categorie;
            br.description = categorie.toUpperCase().toString().slice(0, 32).replace(/-/g, ' ');
            this.categories.push(br);
          });

          if (this.brands.length !== this.brandsProd.length) {
            this.brandsProd = this.brands;
          }
          if (this.categories.length !== this.categoriesProd.length) {
            this.categoriesProd = this.categories;
          }
        });
    });
  }

  ngOnInit(): void {
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
