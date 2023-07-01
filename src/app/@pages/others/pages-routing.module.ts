import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutOneComponent } from './about-one/about-one.component';
import { AboutTwoPageComponent } from './about-two/about-two.component';
import { LoginPageComponent } from './login/login.component';
import { FaqsPageComponent } from './faqs/faqs.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ContactOnePageComponent } from './contact-one/contact-one.component';
import { ServicesComponent } from './services/services.component';
import { HowtobuyComponent } from './howtobuy/howtobuy.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full'
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
    path: 'about-2',
    component: AboutTwoPageComponent
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'howtobuy',
    component: HowtobuyComponent
  },
  {
    path: 'faq',
    component: FaqsPageComponent
  },
  {
    path: 'contact',
    component: ContactOnePageComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PagesRoutingModule { }
