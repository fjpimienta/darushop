import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})

export class PageHeaderComponent implements OnInit {

  @Input() containerClass = 'container';
  @Input() image = 'assets/images/page-header-bg.jpg';
  @Input() subtitle: string;
  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }
}
