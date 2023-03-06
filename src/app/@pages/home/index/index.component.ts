import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalService } from '@core/services/modal.service';
import { ApiService } from '@core/services/api.service';
import { UtilsService } from '@core/services/utils.service';
import { CartService } from '@core/services/cart.service';

import { environment } from 'src/environments/environment';
import { ProductsService } from '@core/services/products.service';
import { Product } from '@core/models/product.models';

import { introSlider, brandSlider, reviewSlider } from '../data';
import demo30 from '@assets/demo30.json';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {

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
  reviewSlider = reviewSlider;
  saleToday: Product;
  existSaleToday: boolean = false;
	index = 0;

	SERVER_URL = environment.SERVER_URL;

	@ViewChild('singleSlider') singleSlider: any;
	@ViewChild('customDots') customDots: any;

	constructor(
		public apiService: ApiService,
		public utilsService: UtilsService,
		private modalService: ModalService,
		private cartService: CartService,
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
      console.log('this.products: ', this.products);
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

  renameKey(obj, oldKey, newKey): void {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }

	ngOnInit(): void {
	}

	addCart(event: Event) {
		event.preventDefault();
		if ((event.currentTarget as HTMLElement).classList.contains('btn-disabled')) return;
		let newProduct = { ...this.products[0] };

		if (this.products[0].variants.length > 0) {
			newProduct = {
				...this.products[0],
				name:
					this.products[ 0 ].name +
					' - ' +
					this.products[ 0 ].variants[ this.index ].color_name,
				price: this.products[ 0 ].variants[ this.index ].price
			};
		}

		this.cartService.addToCart(
			newProduct, 1
		);
	}

	itemChange(e: any, self: any) {
		this.customDots.nativeElement.querySelector('.custom-dot.active').classList.remove('active');
		this.customDots.nativeElement.querySelectorAll('.custom-dot')[e.item.index].classList.add('active');

		self.index = e.item.index;
	}

	changeImage($event: Event, i = 0) {
		this.index = i;
		this.singleSlider.to(i);
		$event.preventDefault();
	}

	showModal(event: Event) {
		event.preventDefault();
		this.modalService.showVideoModal();
	}
}
