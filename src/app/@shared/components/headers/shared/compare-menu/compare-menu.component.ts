import { Component, OnInit } from '@angular/core';

import { Product } from '@shared/classes/product';
import { CompareService } from '@core/services/compare.service';

@Component({
	selector: 'app-compare-menu',
	templateUrl: './compare-menu.component.html',
	styleUrls: ['./compare-menu.component.scss']
})

export class CompareMenuComponent implements OnInit {

	constructor(public compareService: CompareService) { }

	ngOnInit(): void {
	}

	removeFromCompare($event: Event, product: Product) {
		$event.preventDefault();
		this.compareService.removeFromCompare(product);
	}

	clearAllCompare($event: Event) {
		$event.preventDefault();
		this.compareService.clearAllCompare();
	}
}
