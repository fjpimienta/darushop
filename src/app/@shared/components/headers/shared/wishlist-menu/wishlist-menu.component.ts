import { Component, OnInit, OnDestroy } from '@angular/core';

import { WishlistService } from '@core/services/wishlist.service';

@Component({
	selector: 'app-wishlist-menu',
	templateUrl: './wishlist-menu.component.html',
	styleUrls: ['./wishlist-menu.component.scss']
})

export class WishlistMenuComponent implements OnInit, OnDestroy {

	constructor(public wishlistService: WishlistService) { }

	ngOnInit(): void {
	}

	ngOnDestroy(): void {
	}
}
