import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { OwlModule } from 'angular-owl-carousel';
import { GoogleMapsModule } from '@angular/google-maps';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '@shared/shared.module';

import { AboutOneComponent } from './about-one/about-one.component';
import { AboutTwoPageComponent } from './about-two/about-two.component';
import { LoginPageComponent } from './login/login.component';
import { FaqsPageComponent } from './faqs/faqs.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ContactOnePageComponent } from './contact-one/contact-one.component';
import { ComingSoonPageComponent } from './coming-soon/coming-soon.component';
import { ServicesComponent } from './services/services.component';
import { HowtobuyComponent } from './howtobuy/howtobuy.component';
import { DatePickerLegalAgeModule } from '@shared/calendar/date-picker-legal-age/date-picker-legal-age.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsComponent } from './terms/terms.component';

@NgModule({
  declarations: [
    AboutOneComponent,
    AboutTwoPageComponent,
    FaqsPageComponent,
    LoginPageComponent,
    PageNotFoundComponent,
    ContactOnePageComponent,
    ComingSoonPageComponent,
    ServicesComponent,
    HowtobuyComponent,
    TermsComponent
  ],

  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule,
    OwlModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    DatePickerLegalAgeModule,
  ]
})

export class PagesModule { }
