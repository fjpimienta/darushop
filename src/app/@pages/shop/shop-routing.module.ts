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
import { CategorysComponent } from './categorys/categorys.component';
import { BrandsComponent } from './brands/brands.component';
import { OffersComponent } from './offers/offers.component';
import { BrandComponent } from './brand/brand.component';
import { CategoryComponent } from './category/category.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  // {
  //   path: 'nosidebar/:type',
  //   component: NosidebarPageComponent
  // },
  // {
  //   path: 'nosidebar',
  //   pathMatch: 'full',
  //   redirectTo: 'nosidebar/boxed'
  // },
  // {
  //   path: 'market',
  //   component: MarketPageComponent
  // },
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
    path: 'checkout/:idOrder/:id',
    component: CheckoutComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'category/:slug',
  //   component: CategoryComponent
  // },
  {
    path: 'category/:type',
    component: CategoryComponent
  },
  {
    path: 'category',
    pathMatch: 'full',
    redirectTo: 'category/4cols'
  },
  {
    path: 'categorys',
    component: CategorysComponent
  },
  {
    path: 'offers/:type',
    component: OffersComponent
  },
  {
    path: 'offers',
    pathMatch: 'full',
    redirectTo: 'offers/4cols'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'offers/4cols'
  },
  // {
  //   path: 'brand/:slug',
  //   component: BrandComponent
  // },
  {
    path: 'brand/:type',
    component: BrandComponent
  },
  {
    path: 'brand',
    pathMatch: 'full',
    redirectTo: 'brand/4cols'
  },
  {
    path: 'brands',
    component: BrandsComponent
  },
  {
    path: 'products/:type',
    component: ProductsComponent
  },
  {
    path: 'products',
    pathMatch: 'full',
    redirectTo: 'products/4cols'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products/4cols'
  // },
  // {
  //   path: 'products',
  //   component: ProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShopRoutingModule { }
