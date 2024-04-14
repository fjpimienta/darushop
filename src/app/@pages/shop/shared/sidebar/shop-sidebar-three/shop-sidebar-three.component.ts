import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { shopData } from '../../data';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalog } from '@core/models/catalog.models';
import { BrandsGroupsService } from '@core/services/brandgroup.service';
import { CategorysGroupsService } from '@core/services/categorygroup.service';

@Component({
  selector: 'app-shop-sidebar-three',
  templateUrl: './shop-sidebar-three.component.html',
  styleUrls: ['./shop-sidebar-three.component.scss']
})

export class ShopSidebarThreeComponent implements OnInit, OnChanges {

  @Input() toggle = false;
  @Input() products = [];

  productsTmp = [];
  shopData = shopData;
  params = {};
  brands: any[] = [];
  categories: Catalog[] = [];
  searchQuery: string = '';
  searchQueryCat: string = '';
  offer: boolean;
  totalComputadoras = 0;
  totalLaptops = 0;
  totalDesktops = 0;
  totalWorkStations = 0;
  totalTablets = 0;
  totalSofware = 0;
  totalAntivirus = 0;
  totalOfimatica = 0;
  totalSistemaOperativo = 0;
  totalImpresion = 0;
  totalImpresoras = 0;
  totalEscaners = 0;
  totalConsumibles = 0;
  totalRefacciones = 0;
  totalEnergia = 0;
  totalNoBreakYUps = 0;
  totalReguladores = 0;
  totalMulticontacto = 0;
  totalBateriasParaUps = 0;
  totalMonitoresYVideo = 0;
  totalPantallasDeTv = 0;
  totalMonitores = 0;
  totalProyectores = 0;
  totalRedes = 0;
  totalAccessPoint = 0;
  totalSwitches = 0;
  totalAdaptadoresDeRed = 0;
  totalTarjetasDeRed = 0;
  totalComponentes = 0;
  totalMemoriasRam = 0;
  totalDiscosDuros = 0;
  totalProcesadores = 0;
  totalFuentesDePoder = 0;
  totalPlacasMadres = 0;
  totalGabinetes = 0;
  totalAlmacenamiento = 0;
  totalDiscosDurosMecanicos = 0;
  totalDiscosDurosSolidos = 0;
  totalMemoriasUsb = 0;
  totalDiscosDurosExternos = 0;
  totalLectoresDeMemorias = 0;
  totalGabineteParaDiscoDuro = 0;
  totalAccesorios = 0;
  totalTeclados = 0;
  totalMouses = 0;
  totalAudifonos = 0;
  totalBocinas = 0;
  totalMochilas = 0;
  totalHubs = 0;
  totalMousepads = 0;
  totalDiscosDurosA = 0;
  totalAudioyVideo = 0;

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public brandsGroupsService: BrandsGroupsService,
    public categorysgroupService: CategorysGroupsService
  ) {
    activeRoute.queryParams.subscribe(params => {
      this.params = params;
    });
    this.offer = false;
  }

  ngOnInit(): void {
    this.productsTmp = this.products;
    this.brands = [];
    this.brands = this.extractUniqueBrands();
    this.brands = this.formatBrandsForHTML(this.brands);
    this.contarCategoriasYSubacategorias();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.products) {
      this.productsTmp = this.products;
      this.brands = this.extractUniqueBrands();
      this.brands = this.formatBrandsForHTML(this.brands);
      this.contarCategoriasYSubacategorias();
    }
  }

  // Crea una función para contar los productos con la misma categoría y subcategoría
  contarProductosPorCategoriaYSubcategoria(categorySlug: string, subCategorySlug: string): number {
    return this.productsTmp.filter(producto => {
      // Compara la categoría y subcategoría de cada producto con los valores dados
      return producto.category[0].slug === categorySlug && producto.subCategory[0].slug === subCategorySlug;
    }).length;
  }

  contarCategoriasYSubacategorias() {
    this.totalComputadoras = this.contarProductosPorCategoriaYSubcategoria('computadoras', '');
    this.totalLaptops = this.contarProductosPorCategoriaYSubcategoria('computadoras', 'laptops');
    this.totalDesktops = this.contarProductosPorCategoriaYSubcategoria('computadoras', 'desktops');
    this.totalWorkStations = this.contarProductosPorCategoriaYSubcategoria('computadoras', 'work-stations');
    this.totalTablets = this.contarProductosPorCategoriaYSubcategoria('computadoras', 'tablets');
    this.totalSofware = this.contarProductosPorCategoriaYSubcategoria('software', '');
    this.totalAntivirus = this.contarProductosPorCategoriaYSubcategoria('software', 'antivirus');
    this.totalOfimatica = this.contarProductosPorCategoriaYSubcategoria('software', 'ofimatica');
    this.totalSistemaOperativo = this.contarProductosPorCategoriaYSubcategoria('software', 'sistema-operativo');
    this.totalImpresion = this.contarProductosPorCategoriaYSubcategoria('impresion', '');
    this.totalImpresoras = this.contarProductosPorCategoriaYSubcategoria('impresion', 'impresoras');
    this.totalEscaners = this.contarProductosPorCategoriaYSubcategoria('impresion', 'escaners');
    this.totalConsumibles = this.contarProductosPorCategoriaYSubcategoria('impresion', 'consumibles');
    this.totalRefacciones = this.contarProductosPorCategoriaYSubcategoria('impresion', 'refacciones');
    this.totalEnergia = this.contarProductosPorCategoriaYSubcategoria('energia', '');
    this.totalNoBreakYUps = this.contarProductosPorCategoriaYSubcategoria('energia', 'no-break-y-ups');
    this.totalReguladores = this.contarProductosPorCategoriaYSubcategoria('energia', 'reguladores');
    this.totalMulticontacto = this.contarProductosPorCategoriaYSubcategoria('energia', 'multicontacto');
    this.totalBateriasParaUps = this.contarProductosPorCategoriaYSubcategoria('energia', 'baterias-para-ups');
    this.totalMonitoresYVideo = this.contarProductosPorCategoriaYSubcategoria('monitores-y-video', '');
    this.totalPantallasDeTv = this.contarProductosPorCategoriaYSubcategoria('monitores-y-video', 'pantallas-de-tv');
    this.totalMonitores = this.contarProductosPorCategoriaYSubcategoria('monitores-y-video', 'monitores');
    this.totalProyectores = this.contarProductosPorCategoriaYSubcategoria('monitores-y-video', 'proyectores');
    this.totalRedes = this.contarProductosPorCategoriaYSubcategoria('redes', '');
    this.totalAccessPoint = this.contarProductosPorCategoriaYSubcategoria('redes', 'access-point');
    this.totalSwitches = this.contarProductosPorCategoriaYSubcategoria('redes', 'switches');
    this.totalAdaptadoresDeRed = this.contarProductosPorCategoriaYSubcategoria('redes', 'adaptadores-de-red');
    this.totalTarjetasDeRed = this.contarProductosPorCategoriaYSubcategoria('redes', 'tarjetas-de-red');
    this.totalComponentes = this.contarProductosPorCategoriaYSubcategoria('componentes', '');
    this.totalMemoriasRam = this.contarProductosPorCategoriaYSubcategoria('componentes', 'memorias-ram');
    this.totalDiscosDuros = this.contarProductosPorCategoriaYSubcategoria('componentes', 'discos-duros');
    this.totalProcesadores = this.contarProductosPorCategoriaYSubcategoria('componentes', 'procesadores');
    this.totalFuentesDePoder = this.contarProductosPorCategoriaYSubcategoria('componentes', 'fuentes-de-poder');
    this.totalPlacasMadres = this.contarProductosPorCategoriaYSubcategoria('componentes', 'placas-madres');
    this.totalGabinetes = this.contarProductosPorCategoriaYSubcategoria('componentes', 'gabinetes');
    this.totalAlmacenamiento = this.contarProductosPorCategoriaYSubcategoria('almacenamiento', '');
    this.totalDiscosDurosMecanicos = this.contarProductosPorCategoriaYSubcategoria('almacenamiento', 'discos-duros-mecanicos');
    this.totalDiscosDurosSolidos = this.contarProductosPorCategoriaYSubcategoria('almacenamiento', 'discos-duros-solidos');
    this.totalMemoriasUsb = this.contarProductosPorCategoriaYSubcategoria('almacenamiento', 'memorias-usb');
    this.totalDiscosDurosExternos = this.contarProductosPorCategoriaYSubcategoria('almacenamiento', 'discos-duros-externos');
    this.totalLectoresDeMemorias = this.contarProductosPorCategoriaYSubcategoria('almacenamiento', 'lectores-de-memorias');
    this.totalGabineteParaDiscoDuro = this.contarProductosPorCategoriaYSubcategoria('almacenamiento', 'gabinete-para-disco-duro');
    this.totalAccesorios = this.contarProductosPorCategoriaYSubcategoria('accesorios', '');
    this.totalTeclados = this.contarProductosPorCategoriaYSubcategoria('accesorios', 'teclados');
    this.totalMouses = this.contarProductosPorCategoriaYSubcategoria('accesorios', 'mouses');
    this.totalAudifonos = this.contarProductosPorCategoriaYSubcategoria('accesorios', 'audifonos');
    this.totalBocinas = this.contarProductosPorCategoriaYSubcategoria('accesorios', 'bocinas');
    this.totalMochilas = this.contarProductosPorCategoriaYSubcategoria('accesorios', 'mochilas');
    this.totalHubs = this.contarProductosPorCategoriaYSubcategoria('accesorios', 'hubs');
    this.totalMousepads = this.contarProductosPorCategoriaYSubcategoria('accesorios', 'mousepads');
    this.totalDiscosDurosA = this.contarProductosPorCategoriaYSubcategoria('accesorios', 'discosduros');
    this.totalAudioyVideo = this.contarProductosPorCategoriaYSubcategoria('accesorios', 'audio-y-video');
  }
  capitalizeFirstLetter(input: string): string {
    if (input) {
      return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }
    return input;
  }

  generateRouterLink(category: string, subCategory: string = ''): any {
    const queryParams: any = { category, page: 1 };
    if (subCategory) {
      queryParams.subCategory = subCategory;
    }
    return [{}, { queryParams, queryParamsHandling: 'merge' }];
  }

  extractUniqueBrands(): string[] {
    const uniqueBrands: string[] = [];
    // Recorre la lista de productos y agrega las marcas únicas a uniqueBrands
    for (const product of this.productsTmp) {
      for (const brand of product.brands) {
        if (!uniqueBrands.includes(brand.name.toUpperCase())) {
          uniqueBrands.push(brand.name.toUpperCase());
        }
      }
    }
    return uniqueBrands;
  }

  formatBrandsForHTML(brands: string[]): any[] {
    const formattedBrands: any[] = [];
    // Formatea las marcas en el formato deseado para tu HTML
    for (const brand of brands) {
      formattedBrands.push({
        name: brand,
        slug: brand.toLowerCase().replace(' ', '-'),
        description: brand // Puedes ajustar esta parte si la descripción es diferente
      });
    }
    return formattedBrands;
  }

  private sortCatalogs(catalogs: Catalog[]): void {
    catalogs.sort((a, b) => a.description.localeCompare(b.description));
  }

  containsAttrInUrl(type: string, value: string) {
    const currentQueries = this.params[type] ? this.params[type].split(',') : [];
    return currentQueries && currentQueries.includes(value);
  }

  containsPriceInUrl(price: any): boolean {
    let flag = false;
    if (this.params['minPrice'] && this.params['minPrice'] === price.min) {
      flag = true;
    }
    else { return false; }

    if (price.max) {
      if (
        this.params['maxPrice'] &&
        this.params['maxPrice'] === price.max
      ) {
        flag = true;
      }
      else { return false; }
    }
    return true;
  }

  getUrlForAttrs(type: string, value: string) {
    let currentQueries = this.params[type] ? this.params[type].split(',') : [];
    currentQueries = this.containsAttrInUrl(type, value) ? currentQueries.filter(item => item !== value) : [...currentQueries, value];
    return currentQueries.join(',');
  }

  onAttrClick(attr: string, value: string): void {
    this.router.navigate([], { queryParams: { [attr]: this.getUrlForAttrs(attr, value), page: 1 }, queryParamsHandling: 'merge' });
  }

  onPriceChange(event: any, value: any): void {
    let queryParams: any;
    if (event.currentTarget.checked) {
      queryParams = { ...queryParams, minPrice: value.min, maxPrice: value.max, page: 1 };
    } else {
      queryParams = { ...queryParams, minPrice: 0, maxPrice: 9999, page: 1 };
    }

    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }
}
