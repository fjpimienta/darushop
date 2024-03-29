import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '@core/services/modal.service';
import { UtilsService } from '@core/services/utils.service';
import { CartService } from '@core/services/cart.service';
import { environment } from 'src/environments/environment';
import { ProductsService } from '@core/services/products.service';
import { Product } from '@core/models/product.models';
import { introSlider, brandSlider, reviewSlider } from '../data';
import demo30 from '@assets/demo30.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailService } from '@core/services/mail.service';
import { IMail } from '@core/interfaces/mail.interface';
import { infoEventAlert } from '@shared/alert/alerts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { OwlCarousel } from 'angular-owl-carousel';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  itemsProducts: any = demo30;
  formData: FormGroup;
  products = [];
  topProducts = [];
  newProducts = [];
  saleProducts = [];
  saleProducts3 = [];
  saleProductsExclusive = [];
  loaded = false;
  introSlider = introSlider;
  brandSlider = brandSlider;
  reviewSlider = reviewSlider;
  saleToday: Product;
  existSaleToday = false;
  index = 0;
  SERVER_URL = environment.SERVER_URL;
  pageTitle: string = '';
  previousPageUrl: string = '';
  previousPageTitle: string = '';
  queryParams: object = {};
  private unsubscribe$: Subject<void> = new Subject<void>();

  @ViewChild('singleSlider') singleSlider: any;
  @ViewChild('customDots') customDots: any;
  @ViewChild(OwlCarousel) owlCarousel: OwlCarousel;

  customOptions: any = {
    loop: true,
    margin: 10,
    nav: true, // Habilita los botones de navegación
    dots: false, // Deshabilita los puntos indicadores
    items: 1,
    autoplay: true, // Habilita el desplazamiento automático
    autoplayTimeout: 6000, // Establece el tiempo entre diapositivas (en milisegundos)
    autoplaySpeed: 1500,  // Velocidad de desplazamiento (en milisegundos)
  };
  bannerSlider = [
    {
      imageUrl: 'assets/images/home/banners/01.jpg',
      title1: 'Descubre todo',
      title2: 'lo que DARU',
      subtitle: 'tiene para ti',
    },
    {
      imageUrl: 'assets/images/home/banners/02.jpg',
      title1: '',
      title2: '',
      subtitle: '',
    },
    {
      imageUrl: 'assets/images/home/banners/03.jpg',
      title1: '',
      title2: '',
      subtitle: '',
    },
    {
      imageUrl: 'assets/images/home/banners/04.jpg',
      title1: '',
      title2: '',
      subtitle: '',
    },
    // Agrega más objetos de banner según sea necesario
  ];

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private mailService: MailService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public utilsService: UtilsService,
    public productService: ProductsService
  ) {
    // Mostrar el Newsletter
    this.modalService.openNewsletter();
    // Fin
    combineLatest([
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
      this.activeRoute.data
    ])
      .pipe(takeUntil(this.unsubscribe$)) // Unsubscribe cuando el componente se destruye
      .subscribe(([navigationEnd, data]: [NavigationEnd, { title: string }]) => {
        // Obtener el título de la página actual a través de activeRoute.data
        this.pageTitle = data.title || '';
        // Obtener el título de la página anterior del historial de navegación
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.previousNavigation) {
          const url = navigation.previousNavigation.finalUrl.toString();
          const firstSlashIndex = url.indexOf('/');
          const questionMarkIndex = url.indexOf('?');
          const secondSlashIndex = url.indexOf('/', firstSlashIndex + 1);
          if (firstSlashIndex !== -1 && secondSlashIndex !== -1) {
            const previousPageTitle = url.substring(firstSlashIndex + 1, secondSlashIndex);
            this.previousPageTitle = previousPageTitle;
          } else if (firstSlashIndex !== -1 && questionMarkIndex !== -1) {
            const previousPageTitle = url.substring(firstSlashIndex + 1, questionMarkIndex);
            this.previousPageTitle = previousPageTitle;
          } else if (firstSlashIndex !== -1) {
            this.previousPageTitle = url.substring(firstSlashIndex + 1);
          } else {
            this.previousPageTitle = url;
          }
          this.previousPageUrl = navigation.previousNavigation.finalUrl.toString();
          this.queryParams = navigation.previousNavigation.finalUrl.queryParams;
        }
      });
  }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]]
    });
    this.initializeProducts();
    this.activeRoute.data.subscribe((data: { title: string }) => {
      this.pageTitle = data.title || this.pageTitle;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeProducts(): void {
    this.productService.getProducts(1, -1).subscribe(result => {
      if (result && result.products && result.products.length > 0) {
        this.products = result.products;
        if (result.products.category) {
          this.products.forEach(p => {
            p.category.forEach(c => {
              // this.renameKey(c.pivot, 'product_category_id', 'product-category-id');
            });
          });
        }
        this.topProducts = this.utilsService.attrFilter(result.products, 'top');
        this.newProducts = this.utilsService.attrFilter(result.products, 'new');
        this.saleProducts = this.utilsService.attrFilter(result.products, 'sale');
        let i = 0;
        let j = 0;
        this.saleProducts.forEach(sale => {
          if (sale.top) {
            j += 1;
            if (j <= 2) {                                                     // Ofertas Top Exclusivas 2
              this.saleProductsExclusive.push(sale);
            }
          } else {
            i += 1;
            if (i <= 3) {                                                     // Ofertas de Inicio 3
              this.saleProducts3.push(sale);
            }
          }

          if (sale.until === this.today()) {                                  // Oferta del día
            this.existSaleToday = true;
            this.saleToday = sale;
          }
        });
        this.loaded = true;
      }
    });
  }

  customEmailValidator(control) {
    const email = control.value;
    if (!email) {
      return null;
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email) ? null : { invalidEmail: true };
  }

  today(): string {
    const fecha = new Date(Date.now());
    const añoActual = fecha.getFullYear();
    const mesActual = fecha.getMonth() + 1;
    const diaActual = fecha.getDate();
    return (añoActual + '/' + mesActual + '/' + diaActual);
  }

  addCart(event: Event): void {
    event.preventDefault();
    if ((event.currentTarget as HTMLElement).classList.contains('btn-disabled')) { return; }
    let newProduct = { ...this.products[0] };

    if (this.products[0].variants.length > 0) {
      newProduct = {
        ...this.products[0],
        name:
          this.products[0].name +
          ' - ' +
          this.products[0].variants[this.index].color_name,
        price: this.products[0].variants[this.index].price
      };
    }

    this.cartService.addToCart(
      newProduct, 1
    );
  }

  itemChange(e: any, self: any): void {
    this.customDots.nativeElement.querySelector('.custom-dot.active').classList.remove('active');
    this.customDots.nativeElement.querySelectorAll('.custom-dot')[e.item.index].classList.add('active');
    self.index = e.item.index;
  }

  changeImage($event: Event, i = 0): void {
    this.index = i;
    this.singleSlider.to(i);
    $event.preventDefault();
  }

  showModal(event: Event): void {
    event.preventDefault();
    this.modalService.showVideoModal();
  }

  onSubmit() {
    if (!this.formData.valid) {
      infoEventAlert('Es necesario un correo electrónico.', '');
      return;
    }

    const email = this.formData.controls.email.value;
    const receiptEmailInt = 'marketplace@daru.mx';
    const subjectInt = 'Dar de Alta a Usuario';
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contacto del Sitio DARU.MX</title>
      </head>
      <body>
        <div class="container">
          <h2>Correo Enviado desde el Home de DARU.MX</h2>
          <p>Nos ha contactado ${email}, para ser agregado a la lista de contactos.</p>
          <hr>
          <p>Favor de atender la solicitud.</p>
          <hr>
          <p class="foot">
          </p>
        </div>
      </body>
      </html>
      `;

    const mail: IMail = {
      to: receiptEmailInt,
      subject: subjectInt,
      html: html,
      from: email,
    };

    this.mailService.send(mail).subscribe(
      (response) => {
        infoEventAlert('Correo electrónico enviado con éxito:', '', TYPE_ALERT.SUCCESS);
        this.formData.controls.email.setValue('');
      },
      (error) => {
        infoEventAlert('Error al enviar el correo electrónico:', '', TYPE_ALERT.ERROR);
      }
    );
  }

  prevSlide() {
    this.owlCarousel.previous();
  }

  nextSlide() {
    this.owlCarousel.next();
  }
}
