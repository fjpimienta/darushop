import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from '@shared/classes/product';

@Component({
  selector: 'product-extended-page',
  templateUrl: './extended.component.html',
  styleUrls: ['./extended.component.scss']
})

export class ExtendedPageComponent implements OnInit {

  product: Product;
  prev: Product;
  next: Product;
  related = [];
  loaded = false;

  constructor(
    private activeRoute: ActivatedRoute,
    public router: Router
  ) {
    activeRoute.params.subscribe(params => {
      this.loaded = false;
      // this.apiService.getSingleProduct(params['slug']).subscribe(result => {
      //   if (result === null) {
      //     this.router.navigate(['/pages/404']);
      //   }

      //   this.product = result.product;
      //   this.prev = result.prevProduct;
      //   this.next = result.nextProduct;
      //   this.related = result.relatedProducts;
      //   this.loaded = true;
      // });
    });
  }

  ngOnInit(): void {
  }
}
