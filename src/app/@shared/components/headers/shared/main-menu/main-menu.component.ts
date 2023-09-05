import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Catalog } from '@core/models/catalog.models';
import { BrandsService } from '@core/services/brand.service';
import { CategoriesService } from '@core/services/categorie.service';
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
  brandsTmp: Catalog[];
  categories: Catalog[] = [];
  categoriesTmp: Catalog[] = [];
  brandsGroup: CatalogGroup[] = [];
  categorysGroup: CatalogGroup[] = [];
  searchQuery: string = '';
  searchQueryCat: string = '';

  private subscr: Subscription;

  constructor(
    private router: Router,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService,
    public categorysgroupService: CategorysGroupsService
  ) {
    this.subscr = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.current = event.url;
      } else if (event instanceof NavigationEnd) {
        this.current = event.url;
      }
    });
    let j = 0;
    this.categories = [];
    this.categoriesTmp = [];
    this.categorysgroupService.getCategorysGroup().subscribe(result => {
      result.categorysgroups.forEach(category => {
        const categoryGroup = new CatalogGroup();
        categoryGroup.total = category.total;
        categoryGroup.name = category._id[0].name;
        categoryGroup.slug = category._id[0].slug;
        this.categorysGroup.push(categoryGroup);
        j += 1;
        const br = new Catalog();
        br.id = j.toString();
        br.slug = category._id[0].slug;
        br.description = category._id[0].name.toUpperCase().toString().slice(0, 32);
        br.total = category.total;
        br.param = {
          category: br.slug,
          description: br.description
        };
        this.categories.push(br);
        this.categoriesTmp.push(br);
      });
    });
    this.brands = [];
    this.brandsTmp = [];
    this.brandsService.getBrands(1, -1).subscribe(result => {
      this.brands = result.brands;
      this.brandsTmp = this.brands;
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
        this.router.navigate(['/shop/brand'], { queryParams: { brand } });
      } else {
        const filtro = new RegExp(`.*${brand}.*`, 'i');
        this.brandsTmp = this.brands.filter(item => filtro.test(item.slug));
      }
    } else {
      this.brandsTmp = this.brands;
    }
  }

  searchCategories(event: any): void {
    this.searchQueryCat = event.target.value;
    if (this.searchQueryCat !== '') {
      const category = typeof this.searchQueryCat === 'string' ? this.searchQueryCat.trim().toLowerCase() : '';
      const existCategorie = this.categories.find(item => item.slug === category) ? true : false;
      // Solo filtra las categorias que existen en el catalogo.
      if (existCategorie) {
        this.router.navigate(['/shop/category'], { queryParams: { category } });
      } else {
        const filtro = new RegExp(`.*${category}.*`, 'i');
        this.categoriesTmp = this.categories.filter(item => filtro.test(item.slug));
      }
    } else {
      this.categoriesTmp = this.categories;
    }
  }
}
