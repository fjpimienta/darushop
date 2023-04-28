import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '@shared/layout/layout.component';
import { ComingSoonPageComponent } from '@pages/others/coming-soon/coming-soon.component';
import { IndexComponent } from '@pages/home/index/index.component';

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
      },
      {
        path: 'products',
        loadChildren: () => import('@pages/shop/shop.module').then(m => m.ShopModule)
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
