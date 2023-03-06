import { Component, OnInit } from '@angular/core';
import { ApiService } from '@core/services/api.service';

import { ModalService } from '@core/services/modal.service';
import { UtilsService } from '@core/services/utils.service';

import { introSlider, brandSlider } from '../data2';

import demo30 from '@assets/demo30.json';
import { ProductsService } from '@core/services/products.service';
import { environment } from 'src/environments/environment';
import { Product } from '@core/models/product.models';

@Component({
  selector: 'app-index2',
  templateUrl: './index2.component.html',
  styleUrls: ['./index2.component.scss']
})

export class Index2Component implements OnInit {

  itemsProducts: any = demo30;

  products = [];
  topProducts = [];
  newProducts = [];
  saleProducts = [];
  saleProducts3 = [];
  saleProductsExclusive = [];
  loaded = false;
  introSlider = introSlider;
  brandSlider = brandSlider;
  saleToday: Product;
  existSaleToday: boolean = false;

  SERVER_URL = environment.SERVER_URL;

  constructor(
    public utilsService: UtilsService,
    private modalService: ModalService,
    public apiService: ApiService,
    public productService: ProductsService
  ) {
    // Mostrar el modal inicial
    this.productService.getProducts(1, -1).subscribe(result => {
      this.products = result.products;
      this.products.forEach(p => {
        p.category.forEach(c => {
          // this.renameKey(c.pivot, 'product_category_id', 'product-category_id');
        });
      });
      this.topProducts = utilsService.attrFilter(result.products, 'top');
      this.newProducts = utilsService.attrFilter(result.products, 'new');
      this.saleProducts = utilsService.attrFilter(result.products, 'sale');
      let i = 0;
      let j = 0;
      this.saleProducts.forEach(sale => {
        if (sale.top) {
          j += 1;
          if (j <= 2) {                                                     // Ofertas Top Exclusivas 2
            this.saleProductsExclusive.push(sale);
          }
        } else {
          i += 1;
          if (i <= 3) {                                                     // Ofertas de Inicio 3
            this.saleProducts3.push(sale);
          }
        }

        if (sale.until === this.today()) {                                  // Oferta del día
          this.existSaleToday = true;
          this.saleToday = sale;
        }
      });
      this.loaded = true;
    });
  }

  today(): string {
    const fecha = new Date(Date.now());
    const añoActual = fecha.getFullYear();
    const mesActual = fecha.getMonth() + 1;
    const diaActual = fecha.getDate();
    return (añoActual + '/' + mesActual + '/' + diaActual);
  }

  ngOnInit(): void {
  }

  renameKey(obj, oldKey, newKey): void {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
}
