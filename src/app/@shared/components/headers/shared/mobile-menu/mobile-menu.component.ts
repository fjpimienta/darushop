import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Catalog } from '@core/models/catalog.models';
import { BrandsService } from '@core/services/brand.service';
import { CategoriesService } from '@core/services/categorie.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MobileMenuComponent implements OnInit, OnDestroy {

  searchTerm = '';
  current = '/';
  brands: Catalog[];
  brandsTmp: Catalog[];
  categories: Catalog[];
  categoriesTmp: Catalog[];
  searchQuery: string = '';
  searchQueryCat: string = '';

  private subscr: Subscription;

  constructor(
    private router: Router,
    public brandsService: BrandsService,
    public categoriesService: CategoriesService
  ) {
    this.subscr = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.hideMobileMenu();
        this.current = event.url;
      } else if (event instanceof NavigationEnd) {
        this.current = event.url;
      }
    });
    this.brands = [];
    this.brandsTmp = [];
    this.brandsService.getBrands(1, -1).subscribe(result => {
      this.brands = result.brands;
      this.brandsTmp = this.brands;
    });
    this.categories = [];
    this.categoriesTmp = [];
    this.categoriesService.getCategories(1, -1).subscribe(result => {
      result.categories.forEach(cat => {
        cat.param = {
          category: cat.slug,
          description: cat.description
        };
      });
      this.categories = result.categories;
      this.categoriesTmp = this.categories;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscr.unsubscribe();
  }

  submenuToggle(e): void {
    const parent: HTMLElement = e.target.closest('li');
    const submenu: HTMLElement = parent.querySelector('ul');

    if (parent.classList.contains('open')) {
      $(submenu).slideUp(300, () => {
        parent.classList.remove('open');
      });
    }
    else {
      $(submenu).slideDown(300, () => {
        parent.classList.add('open');
      });
    }

    e.preventDefault();
    e.stopPropagation();
  }

  hideMobileMenu(): void {
    document.querySelector('body').classList.remove('mmenu-active');
    document.querySelector('html').removeAttribute('style');
  }

  submitSearchForm(e: any): void {
    e.preventDefault();
    this.searchTerm = e.currentTarget.querySelector('.form-control').value;
    this.router.navigate(['/shop/products'], { queryParams: { searchTerm: this.searchTerm } });
  }

  searchBrands(event: any): void {
    this.searchQuery = event.target.value;
    console.log('this.searchQuery: ', this.searchQuery);
    console.log('event.target.value: ', event.target.value);
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
