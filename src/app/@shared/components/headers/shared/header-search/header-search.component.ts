import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '@core/services/api.service';
import { UtilsService } from '@core/services/utils.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss']
})

export class HeaderSearchComponent implements OnInit, OnDestroy {

  products = [];
  searchTerm = '';
  cat = null;
  suggestions = [];
  timer: any;
  SERVER_URL = environment.SERVER_URL;

  constructor(public activeRoute: ActivatedRoute, public router: Router, public utilsService: UtilsService, public apiService: ApiService) {
  }

  ngOnInit(): void {
    document.querySelector('body').addEventListener('click', this.closeSearchForm);
  }

  ngOnDestroy(): void {
    document.querySelector('body').removeEventListener('click', this.closeSearchForm);
  }

  searchProducts(event: any) {
    this.searchTerm = event.target.value;
    if (this.searchTerm.length > 2) {
      if (this.timer) {
        window.clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.apiService.fetchHeaderSearchData(this.searchTerm).subscribe(result => {
          this.suggestions = result.products.reduce(
            (acc, cur) => {
              let max = 0;
              let min = 99999;
              cur.variants.map(item => {
                if (min > item.price) {
                  min = item.price;
                }
                if (max < item.price) {
                  max = item.price;
                }
              }, []);

              if (cur.variants.length === 0) {
                min = cur.sale_price
                  ? cur.sale_price
                  : cur.price;
                max = cur.price;
              }
              return [
                ...acc,
                {
                  ...cur,
                  minPrice: min,
                  maxPrice: max
                }
              ];
            },
            []
          );
        });
      }, 500);
    } else {
      window.clearTimeout(this.timer);
      this.suggestions = [];
    }
  }

  matchEmphasize(name: string) {
    const regExp = new RegExp(this.searchTerm, 'i');
    return name.replace(
      regExp,
      match => '<strong>' + match + '</strong>'
    );
  }

  goProductPage(): void {
    this.searchTerm = '';
    this.suggestions = [];
    const inputElement: any = document.querySelector('.header-search .form-control');
    inputElement.value = '';
    this.closeSearchForm();
  }

  searchToggle(e: Event): void {
    document.querySelector('.header-search .header-search-wrapper').classList.toggle('show');
    document.querySelector('.header-search').classList.toggle('show');
    e.stopPropagation();
  }

  showSearchForm(e: Event): void {
    document
      .querySelector('.header .header-search .header-search-wrapper')
      .classList.add('show');
    document
      .querySelector('.header .header-search')
      .classList.add('show');
    e.stopPropagation();
  }

  closeSearchForm(): void {
    document
      .querySelector('.header .header-search .header-search-wrapper')
      .classList.remove('show');
    document
      .querySelector('.header .header-search')
      .classList.remove('show');
  }

  submitSearchForm(e: Event): void {
    e.preventDefault();
    this.router.navigate(['/shop/products'], { queryParams: { searchTerm: this.searchTerm } });
  }

  onCatSelect(event: any): void {
    this.cat = event.currentTarget.value;
    this.searchProducts(this.cat);
  }
}
