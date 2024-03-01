import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Catalog } from '@core/models/catalog.models';
import { CategorysGroupsService } from '@core/services/categorygroup.service';
import { BrandsGroupsService } from '@core/services/brandgroup.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {

  current = '/';
  brands: Catalog[] = [];
  categories: Catalog[] = [];
  brandsTmp: Catalog[] = [];
  categoriesTmp: Catalog[] = [];
  searchQuery: string = '';
  searchQueryCat: string = '';

  private subscr: Subscription;

  constructor(
    private router: Router,
    public brandsGroupsService: BrandsGroupsService,
    public categorysgroupService: CategorysGroupsService
  ) {
    this.subscr = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.current = event.url;
      } else if (event instanceof NavigationEnd) {
        this.current = event.url;
      }
    });
  }

  ngOnInit(): void {
    this.loadCategoriesAndBrands();
  }

  ngOnDestroy(): void {
    this.subscr.unsubscribe();
  }

  private loadCategoriesAndBrands(): void {
    this.categorysgroupService.getCategorysGroup().subscribe(result => {
      if (result && result.categorysgroups && result.categorysgroups.length > 0) {
        this.categories = result.categorysgroups.map(category => {
          if (category && category.id) {
            this.mapCatalog(category)
          }
        });
        if (this.categories && this.categories.length > 0) {
          this.sortCatalogs(this.categories);
          this.categoriesTmp = [...this.categories]; // Copiar datos originales
        }
      }
    });

    this.brandsGroupsService.getBrandsGroup().subscribe(result => {
      if (result && result.brandsgroups && result.brandsgroups.length > 0) {
        this.brands = result.brandsgroups.map(group => {
          if (group.id) {
            this.mapCatalog(group)
          }
        });
        if (this.brands && this.brands.length > 0) {
          this.sortCatalogsByTotal(this.brands);
          this.brandsTmp = [...this.brands]; // Copiar datos originales
        }
      }
    });
  }

  sortCatalogsByTotal(catalogs) {
    catalogs.sort((a, b) => b.total - a.total); // Ordenar de mayor a menor por el campo "total"
  }

  private mapCatalog(data: any): Catalog {
    const catalog = new Catalog();
    if (data && data._id) {
      catalog.id = data._id[0].slug;
      catalog.slug = data._id[0].slug;
      catalog.description = data._id[0].name.toUpperCase().slice(0, 32);
      catalog.total = data.total;
    }
    return catalog;
  }

  private sortCatalogs(catalogs: Catalog[]): void {
    catalogs.sort((a, b) => a.description.localeCompare(b.description));
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
      // Solo filtra las marcas que existen en el catálogo.
      if (existBrand) {
        this.router.navigate(['/marca'], { queryParams: { brand } });
      } else {
        const filtro = new RegExp(`.*${brand}.*`, 'i');
        this.brandsTmp = this.brands.filter(item => filtro.test(item.slug));
      }
    } else {
      // Restaura los datos originales
      this.brandsTmp = [...this.brands];
    }
  }

  searchCategories(event: any): void {
    this.searchQueryCat = event.target.value;

    if (this.searchQueryCat !== '') {
      const category = this.searchQueryCat.trim().toLowerCase();
      const existCategory = this.categoriesTmp.find(item => item.slug === category);

      if (existCategory) {
        this.router.navigate(['/categoria'], { queryParams: { category } });
      } else {
        const filtro = new RegExp(`.*${category}.*`, 'i');
        this.categoriesTmp = this.categories.filter(item => filtro.test(item.slug));

        // Si no hay resultados de búsqueda, redirige a una página de búsqueda vacía
        if (this.categoriesTmp.length === 0) {
          this.router.navigate(['/categoria'], { queryParams: { category: '' } });
        }
      }
    } else {
      // Restaura los datos originales y redirige a una página de búsqueda vacía
      this.categoriesTmp = [...this.categories];
      this.router.navigate(['/categoria'], { queryParams: { category: '' } });
    }
  }
}
