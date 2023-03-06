import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SidebarPageComponent } from './sidebar/sidebar.component';
import { NosidebarPageComponent } from './nosidebar/nosidebar.component';
import { MarketPageComponent } from './market/market.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { CategoryComponent } from './category/category.component';
import { BrandsComponent } from './brands/brands.component';
import { OffersComponent } from './offers/offers.component';

const routes: Routes = [
  {
    path: 'sidebar/:type',
    component: SidebarPageComponent
  },
  {
    path: 'sidebar',
    pathMatch: 'full',
    redirectTo: 'sidebar/list'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sidebar/list'
  },
  {
    path: 'nosidebar/:type',
    component: NosidebarPageComponent
  },
  {
    path: 'nosidebar',
    pathMatch: 'full',
    redirectTo: 'nosidebar/boxed'
  },
  {
    path: 'market',
    component: MarketPageComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'offers',
    component: OffersComponent
  },
  {
    path: 'brands',
    component: BrandsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShopRoutingModule { }
