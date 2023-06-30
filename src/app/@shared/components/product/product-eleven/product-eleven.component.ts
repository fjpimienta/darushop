import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '@shared/classes/product';

import { ModalService } from '@core/services/modal.service';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { CompareService } from '@core/services/compare.service';

import { environment } from 'src/environments/environment';
import { CurrencyConversionService } from '@core/services/currency-conversion.service';

@Component({
  selector: 'app-product-eleven',
  templateUrl: './product-eleven.component.html',
  styleUrls: ['./product-eleven.component.scss']
})

export class ProductElevenComponent implements OnInit {

  @Input() product: Product;
  productTmp: Product;

  maxPrice = 0;
  minPrice = 99999;

  SERVER_URL = environment.SERVER_URL;

  constructor(
    private router: Router,
    private modalService: ModalService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private compareService: CompareService,
    private currencyConversionService: CurrencyConversionService
  ) { }

  async ngOnInit(): Promise<void> {
    let min = this.minPrice;
    let max = this.maxPrice;
    if (this.product.suppliersProd.moneda === 'USD') {
      this.productTmp = this.product;
      try {
        const convertedPrice = await this.product.price;
        this.productTmp.price = convertedPrice;
        for (const item of this.product.variants) {
          const convertedItemPrice = await item.price;
          if (min > convertedItemPrice) { min = convertedItemPrice; }
          if (max < convertedItemPrice) { max = convertedItemPrice; }
        }
        if (this.product.variants.length === 0) {
          const convertedSalePrice = this.product.sale_price
            ? await this.currencyConversionService.convertPrice(this.product.sale_price)
            : await this.currencyConversionService.convertPrice(this.product.price);
          min = convertedSalePrice;
          max = await this.currencyConversionService.convertPrice(this.product.price);
        }
        this.minPrice = min;
        this.maxPrice = max;
      } catch (error) {
        // Manejar el error si es necesario
      }
    } else {
      for (const item of this.product.variants) {
        if (min > item.price) { min = item.price; }
        if (max < item.price) { max = item.price; }
      }

      if (this.product.variants.length === 0) {
        min = this.product.sale_price
          ? this.product.sale_price
          : this.product.price;
        max = this.product.price;
      }
      this.minPrice = min;
      this.maxPrice = max;
    }
  }


  addToCart(event: Event): void {
    event.preventDefault();
    this.cartService.addToCart(this.product);
  }

  addToWishlist(event: Event): void {
    event.preventDefault();

    if (this.isInWishlist()) {
      this.router.navigate(['/shop/wishlist']);
    } else {
      this.wishlistService.addToWishList(this.product);
    }
  }

  addToCompare(event: Event): void {
    event.preventDefault();
    if (this.isInCompare()) { return; }
    this.compareService.addToCompare(this.product);
  }

  quickView(event: Event): void {
    event.preventDefault();
    this.modalService.showQuickView(this.product);
  }

  isInCompare(): boolean {
    return this.compareService.isInCompare(this.product);
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product);
  }
}
