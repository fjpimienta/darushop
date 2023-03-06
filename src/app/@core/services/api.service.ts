import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Apollo } from 'apollo-angular';
import { LOGIN_QUERY } from 'src/app/@graphql/operations/query/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient, private apollo: Apollo) {
  }

  /**
   * Get Products
   */
  public fetchShopData(params: any, perPage: number, initial = 'shop'): Observable<any> {
    let temp = initial;
    if (!initial.includes('?')) {
      temp += '?';
    }

    for (let i = 0; i < params.length; i++) {
      temp += i + '=' + params[i] + '&';
    }

    if (!params.page) {
      temp += 'page=1';
    }

    if (!params.perPage) {
      temp += '&perPage=' + perPage;
    }

    temp += '&demo=' + environment.demo;

    // return this.http.get(`${environment.SERVER_URL}/${temp}`);
    return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
  }

  /**
   * Get Products
   */
  public fetchBlogData(params: any, initial = 'blogs/classic', perPage: number, ): Observable<any> {
    let temp = initial;
    if (!initial.includes('?')) {
      temp += '?';
    }

    for (let i = 0; i < params.length; i++) {
      temp += i + '=' + params[i] + '&';
    }

    if (!params.page) {
      temp += 'page=1';
    }

    if (!params.perPage) {
      temp += '&perPage=' + perPage;
    }

    return this.http.get(`${environment.SERVER_URL}/${temp}`);
  }

  /**
   * Get Products
   */
  public fetchSinglePost(slug: string): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/${'single/' + slug + '?demo=' + environment.demo}`);
  }

  /**
   * Get Products for home page
   */
  public fetchHomeData(): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/${environment.demo}`);
  }

  /**
   * Get products by demo
   */
  public getSingleProduct(slug: string, isQuickView = false): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/products/${slug}?demo=${environment.demo}&isQuickView=${isQuickView}`);
  }

  /**
   * Get Products
   */
  public fetchHeaderSearchData(searchTerm: string, cat = null): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/shop?perPage=5&searchTerm=${searchTerm}&category=${cat}&demo=${environment.demo}`);
  }

  /**
   * Get Element Products
   */
  public fetchElementData(): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/elements/products`);
  }

  /**
   * Get Element Blog
   */
  public fetchElementBlog(): Observable<any> {
    return this.http.get(`${environment.SERVER_URL}/elements/blogs`);
  }

  // login(email: string, password: string, include: boolean) {
  //   return this.apollo.watchQuery({
  //     query: LOGIN_QUERY,
  //     variables: {
  //       email,
  //       password,
  //       include
  //     }
  //   }).valueChanges.pipe(map((result) => {
  //     return result.data;
  //   }));
  // }

}
