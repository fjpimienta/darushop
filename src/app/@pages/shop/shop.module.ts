import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'angular-owl-carousel';
import { NouisliderModule } from 'ng2-nouislider';

import { ShopRoutingModule } from './shop-routing.module';
import { SharedModule } from '@shared/shared.module';

import { SidebarPageComponent } from './sidebar/sidebar.component';
import { NosidebarPageComponent } from './nosidebar/nosidebar.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductCategoryBoxedPageComponent } from './product-category-boxed/product-category-boxed.component';
import { ProductCategoryFluidPageComponent } from './product-category-fluid/product-category-fluid.component';
import { ShopSidebarOneComponent } from './shared/sidebar/shop-sidebar-one/shop-sidebar-one.component';
import { ShopSidebarTwoComponent } from './shared/sidebar/shop-sidebar-two/shop-sidebar-two.component';
import { ShopSidebarThreeComponent } from './shared/sidebar/shop-sidebar-three/shop-sidebar-three.component';
import { MarketPageComponent } from './market/market.component';
import { ShopListOneComponent } from './shared/list/shop-list-one/shop-list-one.component';
import { ShopListTwoComponent } from './shared/list/shop-list-two/shop-list-two.component';
import { ShopListThreeComponent } from './shared/list/shop-list-three/shop-list-three.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StripePaymentFormModule } from '@mugan86/stripe-payment-form';
import { CategorysComponent } from './categorys/categorys.component';
import { OffersComponent } from './offers/offers.component';
import { BrandsComponent } from './brands/brands.component';
import { BrandComponent } from './brand/brand.component';
import { CategoryComponent } from './category/category.component';

@NgModule({
  declarations: [
    SidebarPageComponent,
    NosidebarPageComponent,
    CartComponent,
    WishlistComponent,
    CheckoutComponent,
    DashboardComponent,
    ProductCategoryBoxedPageComponent,
    ProductCategoryFluidPageComponent,
    ShopSidebarOneComponent,
    ShopSidebarTwoComponent,
    ShopSidebarThreeComponent,
    ShopListOneComponent,
    ShopListTwoComponent,
    ShopListThreeComponent,
    MarketPageComponent,
    CategorysComponent,
    OffersComponent,
    BrandsComponent,
    BrandComponent,
    CategoryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ShopRoutingModule,
    RouterModule,
    NgbModule,
    OwlModule,
    NouisliderModule,
    StripePaymentFormModule
  ]
})

export class ShopModule { }
