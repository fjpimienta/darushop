import { Component, OnInit, Input } from '@angular/core';
import { Product } from '@shared/classes/product';

@Component({
  selector: 'app-product-info-one',
  templateUrl: './info-one.component.html',
  styleUrls: ['./info-one.component.scss']
})

export class InfoOneComponent implements OnInit {

  @Input() product: Product;
  fragments: string[];

  constructor() { }

  ngOnInit(): void {
    const text = this.product.generalInfo.SummaryDescription.LongSummaryDescription;
    this.fragments = text.split('. ');
  }

  setRating = (event: any) => {
    event.preventDefault();

    if (event.currentTarget.parentNode.querySelector('.active')) {
      event.currentTarget.parentNode.querySelector('.active').classList.remove('active');
    }

    event.currentTarget.classList.add('active');
  }

}
