import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '@shared/classes/product';

import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { CompareService } from '@core/services/compare.service';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
	selector: 'product-detail-three',
	templateUrl: './detail-three.component.html',
	styleUrls: ['./detail-three.component.scss']
})

export class DetailThreeComponent implements OnInit {
	@Input() product: Product;

	variationGroup = [];
	selectableGroup = [];
	sizeArray = [];
	colorArray = [];
	selectedVariant = {
		color: null,
		colorName: null,
		price: null,
		size: ""
	};
	maxPrice = 0;
	minPrice = 99999;
	qty = 1;

	SERVER_URL = environment.SERVER_URL;

	constructor(
		public cartService: CartService,
		public wishlistService: WishlistService,
		public compareService: CompareService,
		public router: Router,
		public el: ElementRef) {
	}

	ngOnInit(): void {
		let min = this.minPrice;
		let max = this.maxPrice;
		this.variationGroup = this.product.variants.reduce((acc, cur) => {
			cur.size.map(item => {
				acc.push({
					color: cur.color,
					colorName: cur.color_name,
					size: item.name,
					price: cur.price
				});
			});
			if (min > cur.price) min = cur.price;
			if (max < cur.price) max = cur.price;
			return acc;
		}, []);

		if (this.product.variants.length == 0) {
			min = this.product.sale_price
				? this.product.sale_price
				: this.product.price;
			max = this.product.price;
		}

		this.minPrice = min;
		this.maxPrice = max;

		this.refreshSelectableGroup();
	}

	addCart(event: Event) {
		event.preventDefault();
		if ((event.currentTarget as HTMLElement).classList.contains('btn-disabled')) return;

		let newProduct = { ...this.product };
		if (this.product.variants.length > 0) {
			newProduct = {
				...this.product,
				name:
					this.product.name +
					' - ' +
					this.selectedVariant.colorName +
					', ' +
					this.selectedVariant.size,
				price: this.selectedVariant.price
			};
		}

		this.cartService.addToCart(
			newProduct, this.qty
		);
	}

	addToWishlist(event: Event) {
		event.preventDefault();

		if (this.isInWishlist()) {
			this.router.navigate(['/wishlist']);
		} else {
			this.wishlistService.addToWishList(this.product);
		}
	}

	addToCompare(event: Event) {
		event.preventDefault();
		if (this.isInCompare()) return;
		this.compareService.addToCompare(this.product);
	}

	isInCompare() {
		return this.compareService.isInCompare(this.product);
	}

	isInWishlist() {
		return this.wishlistService.isInWishlist(this.product);
	}

	refreshSelectableGroup() {
		let tempArray = [...this.variationGroup];
		if (this.selectedVariant.color) {
			tempArray = this.variationGroup.reduce((acc, cur) => {
				if (this.selectedVariant.color !== cur.color) {
					return acc;
				}
				return [...acc, cur];
			}, []);
		}

		this.sizeArray = tempArray.reduce((acc, cur) => {
			if (acc.findIndex(item => item.size == cur.size) !== -1)
				return acc;
			return [...acc, cur];
		}, []);

		tempArray = [...this.variationGroup];
		if (this.selectedVariant.size) {
			tempArray = this.variationGroup.reduce((acc, cur) => {
				if (this.selectedVariant.size !== cur.size) {
					return acc;
				}
				return [...acc, cur];
			}, []);
		}

		this.colorArray = this.product.variants.reduce((acc, cur) => {
			if (
				tempArray.findIndex(item => item.color == cur.color) == -1
			) {
				return [
					...acc,
					{
						color: cur.color,
						colorName: cur.color_name,
						price: cur.price,
						disabled: true
					}
				];
			}
			return [
				...acc,
				{
					color: cur.color,
					colorName: cur.color_name,
					price: cur.price,
					disabled: false
				}
			];
		}, []);

		let toggle = this.el.nativeElement.querySelector('.variation-price');
		if (toggle) {
			if (this.selectedVariant.color && this.selectedVariant.size != "") {
				$(toggle).slideDown();
			} else {
				$(toggle).slideUp();
			}
		}
	}

	selectColor(event: Event, item: any) {
		event.preventDefault();

		if (item.color == this.selectedVariant.color) {
			this.selectedVariant = {
				...this.selectedVariant,
				color: null,
				colorName: null,
				price: item.price
			};
		} else {
			this.selectedVariant = {
				...this.selectedVariant,
				color: item.color,
				colorName: item.colorName,
				price: item.price
			};
		}
		this.refreshSelectableGroup();
	}

	selectSize(event: Event) {
		if (this.selectedVariant.size == 'null') {
			this.selectedVariant = { ...this.selectedVariant, size: "" };
		}
		if ($(event.target).val() == "") {
			this.selectedVariant = { ...this.selectedVariant, size: "" };
		} else {
			this.selectedVariant = { ...this.selectedVariant, size: $(event.target).val() };
		}
		this.refreshSelectableGroup();
	}

	onChangeQty(current: number) {
		this.qty = current;
	}

	clearSelection() {
		this.selectedVariant = {
			...this.selectedVariant,
			color: null,
			colorName: null,
			size: ""
		};
		this.refreshSelectableGroup();
	}
}
