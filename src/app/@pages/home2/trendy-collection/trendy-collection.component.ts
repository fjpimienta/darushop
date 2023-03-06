import { Component, OnInit, Input } from '@angular/core';

import { trendySlider } from '../data2';

@Component({
  selector: 'app-trendy-collection',
  templateUrl: './trendy-collection.component.html',
  styleUrls: ['./trendy-collection.component.scss']
})
export class TrendyCollectionComponent implements OnInit {

  @Input() products = [];
  @Input() loaded = false;

  attrs = ['rated', 'featured', 'sale'];
	sliderOption = trendySlider;

  constructor() { }

  ngOnInit(): void {
  }

}
