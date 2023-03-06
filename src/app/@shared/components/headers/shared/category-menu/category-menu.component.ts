import { Component, OnInit } from '@angular/core';
import { Catalog } from '@core/models/catalog.models';
import { CategoriesService } from '@core/services/categorie.service';

@Component({
  selector: 'app-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.scss']
})

export class CategoryMenuComponent implements OnInit {

  categories: Catalog[];

  constructor(
    public categoriesService: CategoriesService
  ) {
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
}
