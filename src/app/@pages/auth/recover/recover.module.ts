import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecoverRoutingModule } from './recover-routing.module';
import { RecoverComponent } from './recover.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    RecoverComponent
  ],
  imports: [
    CommonModule,
    RecoverRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule
  ]
})
export class RecoverModule { }
