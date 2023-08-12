import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Catalog } from '@core/models/catalog.models';
import { BrandsService } from '@core/services/brand.service';
import { CategoriesService } from '@core/services/categorie.service';
import { BrandsGroupsService } from '@core/services/brandgroup.service';
import { CategorysGroupsService } from '@core/services/categorygroup.service';
import { CatalogGroup } from '@core/models/cataloggroup.models';
import { ProductsService } from '@core/services/products.service';

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
    public brandsgroupService: BrandsGroupsService,
    public categorysgroupService: CategorysGroupsService,
    public productService: ProductsService
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
    this.brandsTmp = [];
    this.brandsService.getBrands(1, -1).subscribe(result => {
      this.brands = result.brands;
      this.brandsTmp = this.brands;
    });
    this.categories = [];
    this.categoriesTmp = [];
    this.productService.getProducts(1, -1, '', false)
      .subscribe(result => {
        const resultCategorie = result;
        const categoriesProd = resultCategorie.products.reduce((products, product) => {
          if (!products[product.category[0].slug]) {
            products[product.category[0].slug] = [];
          }
          products[product.category[0].slug].push({ categories: product.category[0].name, slug: product.category[0].slug });
          return products;
        }, {});
        let j = 0;
        Object.keys(categoriesProd).forEach((categorie) => {
          j += 1;
          const br = new Catalog();
          br.id = j.toString();
          br.slug = categorie;
          br.description = categorie.toUpperCase();
          this.categories.push(br);
        });
        for (const cat of this.categories) {
          cat.param = {
            category: cat.slug,
            description: cat.description
          };
          this.categoriesTmp.push(cat);
        }
        if (this.categories.length !== this.categoriesTmp.length) {
          this.categories = result.categories;
          this.categoriesTmp = this.categories;
        }
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
