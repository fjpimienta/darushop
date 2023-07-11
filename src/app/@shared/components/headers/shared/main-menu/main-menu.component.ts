import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Catalog } from '@core/models/catalog.models';
import { BrandsService } from '@core/services/brand.service';
import { CategoriesService } from '@core/services/categorie.service';
import { BrandsGroupsService } from '@core/services/brandgroup.service';
import { CategorysGroupsService } from '@core/services/categorygroup.service';
import { CatalogGroup } from '@core/models/cataloggroup.models';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {

  current = '/';
  brands: Catalog[];
  categories: Catalog[];
  brandsGroup: CatalogGroup[] = [];
  categorysGroup: CatalogGroup[] = [];
  searchQuery: string = '';

  private subscr: Subscription;

  constructor(
    private router: Router,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService,
    public brandsgroupService: BrandsGroupsService,
    public categorysgroupService: CategorysGroupsService
  ) {
    this.subscr = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.current = event.url;
      } else if (event instanceof NavigationEnd) {
        this.current = event.url;
      }
    });
    this.brandsgroupService.getBrandsGroup().subscribe(result => {
      result.brandsgroups.forEach(brand => {
        const brandGroup = new CatalogGroup();
        brandGroup.total = brand.total;
        brandGroup.name = brand._id[0].name;
        brandGroup.slug = brand._id[0].slug;
        this.brandsGroup.push(brandGroup);
      });
    });
    this.categorysgroupService.getCategorysGroup().subscribe(result => {
      result.categorysgroups.forEach(category => {
        const categoryGroup = new CatalogGroup();
        categoryGroup.total = category.total;
        categoryGroup.name = category._id[0].name;
        categoryGroup.slug = category._id[0].slug;
        this.categorysGroup.push(categoryGroup);
      });
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

  searchBrands(event: any): void {
    this.searchQuery = event.target.value;
    if (this.searchQuery !== '') {
      const brand = typeof this.searchQuery === 'string' ? this.searchQuery.trim().toLowerCase() : '';
      const existBrand = this.brands.find(item => item.slug === brand) ? true : false;
      // Solo filtra las marcas que existen en el catalogo.
      if (existBrand) {
        this.router.navigate(['/shop/brand'], { queryParams: { brand: brand } });
      }
    }
  }
}
