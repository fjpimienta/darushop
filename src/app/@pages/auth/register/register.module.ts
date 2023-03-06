import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { DatePickerLegalAgeModule } from '@shared/calendar/date-picker-legal-age/date-picker-legal-age.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    DatePickerLegalAgeModule,
    FormsModule,
    NgbModule,
    SharedModule
  ]
})
export class RegisterModule { }
