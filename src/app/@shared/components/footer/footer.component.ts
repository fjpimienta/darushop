import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit, OnDestroy {

	@Input() containerClass = "container";
	@Input() isBottomSticky = false;

	isHome: boolean;
	year: any;

	private subscr: Subscription;

	constructor(public router: Router) {
		this.subscr = this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.isHome = event.url === "/";
			} else if (event instanceof NavigationEnd) {
				this.isHome = event.url === "/";
			}
		})
	}

	ngOnInit(): void {
		this.year = (new Date()).getFullYear();
	}

	ngOnDestroy(): void {
		this.subscr.unsubscribe();
	}
}
