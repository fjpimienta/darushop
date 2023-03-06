import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '@shared/layout/layout.component';
import { ComingSoonPageComponent } from '@pages/others/coming-soon/coming-soon.component';
import { IndexComponent } from '@pages/home/index/index.component';
import { Index2Component } from '@pages/home2/index2/index2.component';
import { LoginPageComponent } from '@pages/others/login/login.component';
import { RegisterComponent } from '@pages/auth/register/register.component';
import { Index3Component } from '@pages/home/index/index3.component';
import { Index4Component } from '@pages/home/index/index4.component';
import { Index5Component } from '@pages/home/index/index5.component';
import { Index6Component } from '@pages/home/index/index6.component';
import { Index7Component } from '@pages/home/index/index7.component';

const routes: Routes = [
  {
    path: 'pages/coming-soon',
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
        path: 'index3',
        component: Index3Component
      },
      {
        path: 'index4',
        component: Index4Component
      },
      {
        path: 'index5',
        component: Index5Component
      },
      {
        path: 'index2',
        component: Index6Component
      },
      {
        path: 'index7',
        component: Index7Component
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
        path: 'pages',
        loadChildren: () => import('@pages/others/pages.module').then(m => m.PagesModule)
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
