import { Component, OnInit, Input } from '@angular/core';
import { newSlider } from '../data2';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss']
})
export class NewCollectionComponent implements OnInit {

  @Input() products = [];
  @Input() loaded = false;

  brands = [['all'], ['microsoft'], ['gopro'], ['canon'], ['sony']];
  categories = [['all'], ['computadoras'], ['camaras', 'videocamaras'], ['computadoras', 'tabletas', 'laptops'], ['juegos']];
  titles = ['All', 'Accessories', 'Cameras & Camcorders', 'Computers & Tablets', 'Entertainment'];
  sliderOption = newSlider;
  byBrands = false;
  byCategory = true;

  constructor() { }

  ngOnInit(): void {
  }

  changeCategrory() {
    this.byCategory = true;
    this.byBrands = false;
  }

  changeBrands() {
    this.byBrands = true;
    this.byCategory = false;
  }

}
