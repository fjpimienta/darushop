import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { UtilsService } from '@core/services/utils.service';
import { ApiService } from '@graphql/services/api.service';
import { Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'shop-nosidebar-page',
  templateUrl: './nosidebar.component.html',
  styleUrls: ['./nosidebar.component.scss']
})

export class NosidebarPageComponent implements OnInit {

  products = [];
  perPage = 0;
  type = 'boxed';
  totalCount = 0;
  orderBy = 'default';
  searchTerm = '';
  containerClass = 'container';
  cols = "col-6 col-md-4 col-lg-4 col-xl-3";
  loaded = false;
  moreLoading = false;
  params = {};
  pageTitle: string = '';
  previousPageTitle: string = '';
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    public utilsService: UtilsService,
    public apiService: ApiService
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
    this.activeRoute.params.subscribe(params => {
      this.type = params['type'];
      if (this.type == 'boxed') {
        this.pageTitle = 'Boxed No Sidebar';
        this.containerClass = 'container';
        this.cols = "col-6 col-md-4 col-lg-4 col-xl-3";
      } else {
        this.pageTitle = 'Fullwidth No Sidebar';
        this.containerClass = 'container-fluid'
        this.cols = "col-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2";
      }
    });

    this.activeRoute.queryParams.subscribe(params => {
      this.params = params;
      this.perPage = 12;
      this.loadProducts();
    })
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

  loadProducts() {
    this.loaded = false;

    if (this.params['searchTerm']) {
      this.searchTerm = this.params['searchTerm'];
    } else {
      this.searchTerm = '';
    }

    if (this.params['orderBy']) {
      this.orderBy = this.params['orderBy'];
    } else {
      this.orderBy = 'default';
    }

    // this.apiService.fetchShopData(this.params, this.perPage).subscribe(result => {
    //   this.products = result.products;
    //   this.totalCount = result.totalCount;
    //   this.loaded = true;

    //   this.utilsService.scrollToPageContent();
    // })
  }

  changeOrderBy(event: any) {
    this.router.navigate([], { queryParams: { orderBy: event.currentTarget.value, page: 1 }, queryParamsHandling: 'merge' });
  }

  toggleSidebar() {
    if (document.querySelector('body').classList.contains('sidebar-filter-active'))
      document.querySelector('body').classList.remove('sidebar-filter-active');
    else
      document.querySelector('body').classList.add('sidebar-filter-active');
  }

  hideSidebar() {
    document.querySelector('body').classList.remove('sidebar-filter-active');
  }

  loadMore(e: Event) {
    e.preventDefault();
    if (this.products.length < this.totalCount) {
      this.moreLoading = true;

      // setTimeout(() => {
      //   this.apiService.fetchShopData(this.params, 4, 'shop?from=' + this.perPage).subscribe(result => {
      //     this.products = [...this.products, ...result.products];
      //     this.totalCount = result.totalCount;
      //     this.moreLoading = false;
      //   })

      //   this.perPage += 4;
      // }, 500);
    }
  }
}
