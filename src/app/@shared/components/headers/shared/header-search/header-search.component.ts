import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UtilsService } from '@core/services/utils.service';
import { ApiService } from '@graphql/services/api.service';

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

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public utilsService: UtilsService,
    public apiService: ApiService
  ) {
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
    const headerSearchWrapper = document.querySelector('.header-search .header-search-wrapper');
    const headerSearch = document.querySelector('.header-search');
    const formControl = document.querySelector('.header-search .form-control') as HTMLInputElement; // Aserción de tipo
    if (headerSearchWrapper && headerSearch) {
      headerSearchWrapper.classList.toggle('show');
      headerSearch.classList.toggle('show');
      if (formControl) {
        formControl.focus();
      }
    }
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
    this.router.navigate(['/products'], { queryParams: { searchTerm: this.searchTerm } });
    this.searchTerm = '';
    // Restablece el valor del campo de entrada a una cadena vacía
    const inputElement: any = document.getElementById('searchTerm');
    if (inputElement) {
      inputElement.value = '';
    }
  }

  onCatSelect(event: any): void {
    this.cat = event.currentTarget.value;
    this.searchProducts(this.cat);
  }

}
