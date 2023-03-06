import { Component, OnInit } from '@angular/core';
import { faqGroups } from './faq-data';

@Component({
  selector: 'app-howtobuy',
  templateUrl: './howtobuy.component.html',
  styleUrls: ['./howtobuy.component.scss']
})
export class HowtobuyComponent implements OnInit {

  faqGroups = faqGroups;

  constructor() { }

  ngOnInit(): void {
  }

}
