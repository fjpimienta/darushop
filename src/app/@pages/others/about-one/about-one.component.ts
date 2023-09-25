import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { customSay, team, brands } from './about-one-data';
import { sliderOpt } from '@shared/data';
import { Subject, combineLatest } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pages-about-page',
  templateUrl: './about-one.component.html',
  styleUrls: ['./about-one.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AboutOneComponent implements OnInit {

  customSay = customSay;
  brands = brands;
  team = team;
  sliderOption = {
    ...sliderOpt,
    nav: false,
    dots: true,
    margin: 20,
    loop: false,
    responsive: {
      1200: {
        nav: true
      }
    }
  };
  teamOption = {
    ...sliderOpt,
    nav: false,
    dots: false,
    items: 3,
    margin: 20,
    loop: false,
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 2
      },
      992: {
        items: 3
      }
    }
  };
  pageTitle: string = '';
  previousPageTitle: string = '';
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute
  ) {
    combineLatest([
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
      this.activeRoute.data
    ])
      .pipe(takeUntil(this.unsubscribe$)) // Unsubscribe cuando el componente se destruye
      .subscribe(([navigationEnd, data]: [NavigationEnd, { title: string }]) => {
        // Obtener el título de la página actual a través de activeRoute.data
        this.pageTitle = data.title || '';
        // Obtener el título de la página anterior del historial de navegación
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.previousNavigation) {
          this.previousPageTitle = navigation.previousNavigation.finalUrl.toString();
        } else {
          this.previousPageTitle = '';
        }
        console.log('this.pageTitle: ', this.pageTitle);
      });
  }

  ngOnInit(): void {
    this.activeRoute.data.subscribe((data: { title: string }) => {
      this.pageTitle = data.title || this.pageTitle;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
