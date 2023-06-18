import { Component, OnInit } from '@angular/core';
import { faqGroups } from './terms-data';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  faqGroups = faqGroups;

  constructor() { }

  ngOnInit(): void {
  }

}
