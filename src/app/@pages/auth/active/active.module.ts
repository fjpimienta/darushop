import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiveRoutingModule } from './active-routing.module';
import { ActiveComponent } from './active.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    ActiveComponent
  ],
  imports: [
    CommonModule,
    ActiveRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule
  ]
})
export class ActiveModule { }
