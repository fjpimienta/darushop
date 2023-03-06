import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerLegalAgeComponent } from './date-picker-legal-age.component';

@NgModule({
  declarations: [
    DatePickerLegalAgeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule
  ],
  exports: [
    DatePickerLegalAgeComponent
  ]
})
export class DatePickerLegalAgeModule { }
