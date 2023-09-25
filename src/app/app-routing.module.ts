import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '@shared/layout/layout.component';
import { ComingSoonPageComponent } from '@pages/others/coming-soon/coming-soon.component';
import { IndexComponent } from '@pages/home/index/index.component';
import { TermsComponent } from '@pages/others/terms/terms.component';
import { AboutOneComponent } from '@pages/others/about-one/about-one.component';
import { ServicesComponent } from '@pages/others/services/services.component';
import { HowtobuyComponent } from '@pages/others/howtobuy/howtobuy.component';
import { FaqsPageComponent } from '@pages/others/faqs/faqs.component';
import { ContactOnePageComponent } from '@pages/others/contact-one/contact-one.component';
import { BrandsComponent } from '@pages/shop/brands/brands.component';
import { CategorysComponent } from '@pages/shop/categorys/categorys.component';
import { OffersComponent } from '@pages/shop/offers/offers.component';
import { CategoryComponent } from '@pages/shop/category/category.component';
import { BrandComponent } from '@pages/shop/brand/brand.component';
import { CartComponent } from '@pages/shop/cart/cart.component';
import { WishlistComponent } from '@pages/shop/wishlist/wishlist.component';
import { CheckoutComponent } from '@pages/shop/checkout/checkout.component';
import { DashboardComponent } from '@pages/shop/dashboard/dashboard.component';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'soon',
    component: ComingSoonPageComponent
  },
  // Quitar
  {
    path: '',
    component: ComingSoonPageComponent
  },
  // Quitar
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: IndexComponent,
        data: { title: 'Inicio' }
      },
      {
        path: 'login',
        loadChildren: () => import('@pages/auth/login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'register',
        loadChildren: () => import('@pages/auth/register/register.module').then(m => m.RegisterModule)
      },
      {
        path: 'recover',
        loadChildren: () => import('@pages/auth/recover/recover.module').then(m => m.RecoverModule)
      },
      {
        path: 'active/:token',
        loadChildren: () => import('@pages/auth/active/active.module').then(m => m.ActiveModule)
      },
      {
        path: 'reset/:token',
        loadChildren: () => import('@pages/auth/change-password/change-password.module').then(m => m.ChangePasswordModule)
      },
      {
        path: 'ofertas',
        component: OffersComponent,
        data: { title: 'Ofertas' }
      },
      {
        path: 'marcas',
        component: BrandsComponent,
        data: { title: 'Marcas' }
      },
      {
        path: 'marca',
        component: BrandComponent,
        data: { title: 'Marca' }
      },
      {
        path: 'marca/:type',
        component: BrandComponent,
        data: { title: 'Marca' }
      },
      {
        path: 'categorias',
        component: CategorysComponent,
        data: { title: 'Categorias' }
      },
      {
        path: 'categoria',
        component: CategoryComponent,
        data: { title: 'Categoria' }
      },
      {
        path: 'categoria/:type',
        component: CategoryComponent,
        data: { title: 'Categoria' }
      },
      {
        path: 'product',
        loadChildren: () => import('@pages/product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'products',
        loadChildren: () => import('@pages/shop/shop.module').then(m => m.ShopModule)
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
        path: 'checkout/:idOrder/:id',
        component: CheckoutComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'conocenos',
        component: AboutOneComponent,
        data: { title: 'Conócenonos' }
      },
      {
        path: 'services',
        component: ServicesComponent
      },
      {
        path: 'comocomprar',
        component: HowtobuyComponent,
        data: { title: 'Cómo comprar' }
      },
      {
        path: 'contacto',
        component: ContactOnePageComponent,
        data: { title: 'Contacto' }
      },
      {
        path: 'faq',
        component: FaqsPageComponent,
        data: { title: 'FAQ' }
      },
      {
        path: 'terminos',
        component: TermsComponent,
        data: { title: 'Terminos' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/pages/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, anchorScrolling: 'disabled', scrollPositionRestoration: 'disabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
