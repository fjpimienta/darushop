import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
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
