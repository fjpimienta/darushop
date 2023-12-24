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
  previousPageUrl: string = '';
  previousPageTitle: string = '';
  queryParams: object = {};
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
          const url = navigation.previousNavigation.extractedUrl.toString();
          const firstSlashIndex = url.indexOf('/');
          const questionMarkIndex = url.indexOf('?');
          const secondSlashIndex = url.indexOf('/', firstSlashIndex + 1);
          if (firstSlashIndex !== -1 && secondSlashIndex !== -1) {
            const previousPageTitle = url.substring(firstSlashIndex + 1, secondSlashIndex);
            this.previousPageTitle = previousPageTitle;
          } else if (firstSlashIndex !== -1 && questionMarkIndex !== -1) {
            const previousPageTitle = url.substring(firstSlashIndex + 1, questionMarkIndex);
            this.previousPageTitle = previousPageTitle;
            this.previousPageTitle = this.previousPageTitle.charAt(0).toUpperCase() + this.previousPageTitle.slice(1).toLowerCase();
          } else if (firstSlashIndex !== -1) {
            this.previousPageTitle = url.substring(firstSlashIndex + 1);
          } else {
            this.previousPageTitle = url;
          }
          this.previousPageUrl = navigation.previousNavigation.finalUrl.toString();
          this.queryParams = navigation.previousNavigation.finalUrl.queryParams;
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
