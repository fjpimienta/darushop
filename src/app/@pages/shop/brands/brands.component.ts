import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    if (
      document
        .querySelector('body')
        .classList.contains('sidebar-filter-active')
    ) {
      document
        .querySelector('body')
        .classList.remove('sidebar-filter-active');
    } else {
      document
        .querySelector('body')
        .classList.add('sidebar-filter-active');
    }
  }

  hideSidebar(): void {
    document
      .querySelector('body')
      .classList.remove('sidebar-filter-active');
  }
}
