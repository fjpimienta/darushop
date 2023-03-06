import { Pipe, PipeTransform } from '@angular/core';

import { Product } from '../classes/product';

@Pipe({
	name: 'braFilter',
	pure: true
})

export class BraFilterPipe implements PipeTransform {

	transform(products: Product[], brands: string[], flag = false): Product[] {
		if (brands[0] === 'all') return products;

		return products.filter(item => {
			for (let i = 0; i < brands.length; i++) {
				if (item.brands.find(cat => cat.slug == brands[i])) {
					if (!flag) return true;
				} else {
					if (flag) return false;
				}
			}

			if (flag)
				return true;
			else
				return false;
		})
	}
}
