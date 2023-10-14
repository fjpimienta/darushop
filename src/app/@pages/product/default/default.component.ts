import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from '@shared/classes/product';
import { ProductsService } from '@core/services/products.service';
import { IcecatProductsService } from '@core/services/suppliers/icecat.service';

@Component({
  selector: 'app-product-default-page',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})

export class DefaultPageComponent implements OnInit {

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
        if (result.product.product.pictures.length >= 3) {
          this.router.navigate(['/product/gallery/' + result.product.product.id]);
        }
        this.product = result.product.product;
        this.productName = result.product.product.sku;
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
