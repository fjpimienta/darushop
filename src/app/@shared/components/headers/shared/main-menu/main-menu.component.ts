import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Catalog } from '@core/models/catalog.models';
import { BrandsService } from '@core/services/brand.service';
import { CategoriesService } from '@core/services/categorie.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {

  current = '/';
  brands: Catalog[];
  categories: Catalog[];

  private subscr: Subscription;

  constructor(
    private router: Router,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService
  ) {
    this.subscr = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.current = event.url;
      } else if (event instanceof NavigationEnd) {
        this.current = event.url;
      }
    });
    this.brands = [];
    this.brandsService.getBrands(1, -1).subscribe(result => {
      this.brands = result.brands;
    });
    this.categories = [];
    this.categoriesService.getCategories(1, -1).subscribe(result => {
      result.categories.forEach(cat => {
        cat.param = {
          category: cat.slug,
          description: cat.description
        };
      });
      this.categories = result.categories;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscr.unsubscribe();
  }

  viewAllDemos(event: any) {
    event.preventDefault();
    var list = document.querySelectorAll('.demo-list .hidden');
    for (let i = 0; i < list.length; i++) {
      list[i].classList.add('show');
    }

    event.target.parentElement.classList.add('d-none');
  }
}
