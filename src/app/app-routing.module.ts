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

const routes: Routes = [
  {
    path: 'soon',
    component: ComingSoonPageComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: IndexComponent
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
        path: 'elements',
        loadChildren: () => import('@pages/elements/elements.module').then(m => m.ElementsModule)
      },
      {
        path: 'blog',
        loadChildren: () => import('@pages/blog/blog.module').then(m => m.BlogModule)
      },
      {
        path: 'shop',
        loadChildren: () => import('@pages/shop/shop.module').then(m => m.ShopModule)
      },
      {
        path: 'category',
        loadChildren: () => import('@pages/shop/shop.module').then(m => m.ShopModule)
      },
      {
        path: 'offers',
        loadChildren: () => import('@pages/shop/shop.module').then(m => m.ShopModule)
      },
      {
        path: 'brands',
        loadChildren: () => import('@pages/shop/shop.module').then(m => m.ShopModule)
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
        path: 'about',
        component: AboutOneComponent
      },
      {
        path: 'services',
        component: ServicesComponent
      },
      {
        path: 'howtobuy',
        component: HowtobuyComponent
      },
      {
        path: 'contact',
        component: ContactOnePageComponent
      },
      {
        path: 'faq',
        component: FaqsPageComponent
      },
      {
        path: 'terms',
        component: TermsComponent
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
