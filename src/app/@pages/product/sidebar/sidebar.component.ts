import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from '@shared/classes/product';

@Component({
  selector: 'app-product-sidebar-page',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarPageComponent implements OnInit, OnDestroy {

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
      // this.apiService.getSingleProduct(params.id).subscribe(result => {
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

  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('sidebar-filter-active');
  }
}
