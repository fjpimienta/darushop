import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Servicios } from './servicios-data';
import { sliderOpt } from '@shared/data';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})

export class ServicesComponent implements OnInit {

  Servicios = Servicios;

  constructor() {
  }

  ngOnInit(): void {
  }
}
