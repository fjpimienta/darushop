import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '@shared/classes/product';

import { ModalService } from '@core/services/modal.service';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { CompareService } from '@core/services/compare.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-eleven',
  templateUrl: './product-eleven.component.html',
  styleUrls: ['./product-eleven.component.scss']
})

export class ProductElevenComponent implements OnInit {

  @Input() product: Product;

  maxPrice = 0;
  minPrice = 99999;

  SERVER_URL = environment.SERVER_URL;

  constructor(
    private router: Router,
    private modalService: ModalService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private compareService: CompareService
  ) { }

  ngOnInit(): void {
    let min = this.minPrice;
    let max = this.maxPrice;

    console.log(this.SERVER_URL + this.product.sm_pictures[0].url);

    this.product.variants.map(item => {
      if (min > item.price) { min = item.price; }
      if (max < item.price) { max = item.price; }
    }, []);

    if (this.product.variants.length === 0) {
      min = this.product.sale_price
        ? this.product.sale_price
        : this.product.price;
      max = this.product.price;
    }

    this.minPrice = min;
    this.maxPrice = max;
  }

  addToCart(event: Event): void {
    event.preventDefault();
    this.cartService.addToCart(this.product);
  }

  addToWishlist(event: Event): void {
    event.preventDefault();

    if (this.isInWishlist()) {
      this.router.navigate(['/wishlist']);
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

  getImageUrl(relativeUrl: string): string {
    return this.SERVER_URL + relativeUrl;
  }
}
