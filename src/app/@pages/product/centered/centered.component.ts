import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@core/services/products.service';
import { IcecatProductsService } from '@core/services/suppliers/icecat.service';

import { Product } from '@shared/classes/product';

@Component({
  selector: 'product-centered-page',
  templateUrl: './centered.component.html',
  styleUrls: ['./centered.component.scss']
})

export class CenteredPageComponent implements OnInit {

  product: Product;
  prev: Product;
  next: Product;
  related = [];
  loaded = false;
  productName = '';

  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    public productService: ProductsService,
    public icecatProductsService: IcecatProductsService
  ) {
    activeRoute.params.subscribe(params => {
      this.loaded = false;
      this.productService.getProduct(params.slug).subscribe(result => {
        this.product = result.product.product;
        this.productName = result.product.product.partnumber;
        // this.prev = this.product;
        // this.next = this.product;
        // this.product = result.product;
        // this.prev = result.prevProduct;
        // this.next = result.nextProduct;
        // this.related = result.relatedProducts;
        this.loaded = true;
      });
    });
  }

  ngOnInit(): void {
  }
}
