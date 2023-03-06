import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'angular-owl-carousel';

import { SharedModule } from '@shared/shared.module';

import { IndexComponent } from './index/index.component';
import { Index3Component } from './index/index3.component';
import { Index4Component } from './index/index4.component';
import { Index5Component } from './index/index5.component';
import { Index6Component } from './index/index6.component';
import { Index7Component } from './index/index7.component';

@NgModule({
  declarations: [
    IndexComponent,
    Index3Component,
    Index4Component,
    Index5Component,
    Index6Component,
    Index7Component,
  ],

  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    OwlModule,
    SharedModule
  ]
})

export class HomeModule { }
