import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categorys',
  templateUrl: './categorys.component.html',
  styleUrls: ['./categorys.component.scss']
})
export class CategorysComponent implements OnInit {

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
