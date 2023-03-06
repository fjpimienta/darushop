import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recommend-collection',
  templateUrl: './recommend-collection.component.html',
  styleUrls: ['./recommend-collection.component.scss']
})

export class RecommendCollectionComponent implements OnInit {

  @Input() products = [];
  @Input() loaded = false;
  constructor() { }

  ngOnInit(): void {
  }

}
