import { Component, OnInit, Input } from '@angular/core';

import { Post } from '@shared/classes/post';

import { ModalService } from '@core/services/modal.service';

import { sliderOpt } from '@shared/data';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-post-two',
	templateUrl: './post-two.component.html',
	styleUrls: ['./post-two.component.scss']
})

export class PostTwoComponent implements OnInit {

	@Input() post: Post;
	@Input() imageSize = 4;

	sliderOption = { ...sliderOpt, loop: false };
	SERVER_URL = environment.SERVER_URL;
	paddingTop = '100%';

	constructor(private modalService: ModalService) { }

	ngOnInit(): void {
		this.paddingTop = Math.floor((parseFloat(this.post.image[0].height.toString()) / parseFloat(this.post.image[0].width.toString()) * 1000)) / 10 + '%';
	}

	showModal(event: Event) {
		event.preventDefault();
		this.modalService.showVideoModal();
	}
}
