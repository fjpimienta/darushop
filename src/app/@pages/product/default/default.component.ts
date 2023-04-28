import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from '@shared/classes/product';
import { ProductsService } from '@core/services/products.service';

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

  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router,
    public productService: ProductsService
  ) {
    activeRoute.params.subscribe(params => {
      this.loaded = false;
      // this.apiService.getSingleProduct(params['slug']).subscribe(result => {
      this.productService.getProduct(params.slug).subscribe(result => {
        if (result === null) {
          this.router.navigate(['/pages/404']);
        }
        this.product = result.product.product;
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
