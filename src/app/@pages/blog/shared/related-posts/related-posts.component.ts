import { Component, OnInit, Input } from '@angular/core';

import { Post } from '@shared/classes/post';

@Component({
	selector: 'blog-related-posts',
	templateUrl: './related-posts.component.html',
	styleUrls: ['./related-posts.component.scss']
})

export class RelatedPostsComponent implements OnInit {

	@Input() sliderOption: any;
	@Input() posts = [];

	constructor() {
	}

	ngOnInit(): void {
	}
}
