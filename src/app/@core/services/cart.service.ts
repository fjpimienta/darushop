import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// RxJS
import { Subject, BehaviorSubject } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';

import { Product } from '@shared/classes/product';
import { CartItem } from '@shared/classes/cart-item';
import { cartItemsSelector } from '@core/selectors/selectors';
import { AddToCartAction, ClearCartAction, RefreshStoreAction, RemoveFromCartAction, UpdateCartAction } from '@core/actions/actions';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  public cartItems: CartItem[] = [];
  public cartStream: Subject<any> = new BehaviorSubject([]);
  public qtyTotal: Subject<number> = new BehaviorSubject(0);
  public priceTotal: Subject<number> = new BehaviorSubject(0);

  constructor(private store: Store<any>, private toastrService: ToastrService) {
    store.pipe(select(cartItemsSelector)).subscribe(items => {
      this.cartItems = items;

      this.cartStream.next(items);

      this.qtyTotal.next(
        this.cartItems.reduce((acc, cur) => {
          return acc + cur.qty;
        }, 0));

      this.priceTotal.next(
        this.cartItems.reduce((acc, cur) => {
          return acc + cur.sum;
        }, 0)
      );
    });
  }

  // Product Add to Cart
  addToCart(product: Product, qty = 1): void {
    if (this.canAddToCart(product, qty)) {
      this.store.dispatch(new AddToCartAction({ product, qty }));
      this.toastrService.success('Producto agregado al Carrito.');
    } else {
      this.toastrService.error('Lo sentimos, no puedes agregar esa cantidad al Carrito.');
    }
  }

  // Product Removed from the Cart
  removeFromCart(product: CartItem): void {
    this.store.dispatch(new RemoveFromCartAction({ product }));
    this.toastrService.success('Producto removido del Carrito.');
  }

  // Cart update
  updateCart(cartItems: CartItem[], costoEnvio: number = 0): void {
    this.store.dispatch(new UpdateCartAction({ cartItems }));
    this.toastrService.success('Carrito Actualizado.');
  }

  // Clear Cart
  clearCart(withMessage: boolean = true): void {
    this.store.dispatch(new ClearCartAction());
    if (withMessage) {
      this.toastrService.success('Se limpió el carrito.');
    }
  }

  // Refresh Store
  refreshStore(): void {
    this.store.dispatch(new RefreshStoreAction());
    this.toastrService.success('Carrito vaciado.');
  }

  // Check whether product is in Cart or not
  isInCart(product: Product): boolean {
    return this.cartItems.find(item => item.id === product.id) ? true : false;
  }

  // Check where product could be added to the cart
  canAddToCart(product: Product, qty = 1): boolean {
    const find = this.cartItems.find(item => item.id === product.id);

    if (find) {
      if (product.stock === 0 || (product.stock && product.stock < (find.qty + qty))) { return false; }
      else { return true; }
    } else {
      if (product.stock === 0 || (product.stock && product.stock < qty)) { return false; }
      else { return true; }
    }
  }

  orderDescription(): string {
    let i = 0;
    let description = '';
    this.cartItems.map((product: CartItem) => {
      i += 1;
      description += `${product.qty}; `;
      description += `${product.name}; `;
      description += `${product.price}; `;
      description += `${product.sum} \n`;
    });
    return description;
  }

}
