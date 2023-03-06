import { Component, OnInit } from '@angular/core';

import { CartService } from '@core/services/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart-menu',
  templateUrl: './cart-menu.component.html',
  styleUrls: ['./cart-menu.component.scss']
})

export class CartMenuComponent implements OnInit {

  SERVER_URL = environment.SERVER_URL;

  constructor(public cartService: CartService) {
  }

  ngOnInit(): void {
  }

  removeFromCart(event: Event, product: any) {
    event.preventDefault();
    this.cartService.removeFromCart(product);
  }
}
