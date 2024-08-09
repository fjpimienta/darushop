import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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

  currentBannerImage1: string;
  currentBannerImage2: string;
  currentBannerImage3: string;
  currentBannerImage4: string;
  currentBannerImages: string[];

  // Definir las rutas de las imágenes para dispositivos móviles
  mobileBannerImages = [
    'assets/images/home/banners/mobile/01.jpg',
    'assets/images/home/banners/mobile/02.jpg',
    'assets/images/home/banners/mobile/03.jpg',
    'assets/images/home/banners/mobile/04.jpg'
  ];

  // Definir las rutas de las imágenes para pantallas de escritorio
  desktopBannerImages = [
    'assets/images/home/banners/01.jpg',
    'assets/images/home/banners/02.jpg',
    'assets/images/home/banners/03.jpg',
    'assets/images/home/banners/04.jpg'
  ];

  customOptions: any = {
    loop: true,
    margin: 10,
    nav: true,
    dots: true,
    items: 1,
    autoplay: true,
    autoplayTimeout: 10000,
    autoplaySpeed: 1000,
  };

  bannerSlider = [
    {
      imageUrl: 'assets/images/home/banners/mobile/01.jpg',
      title1: '',
      title2: '+10,000 artículos disponibles.',
      subtitle: 'Conoce nuestras ofertas',
      url: '/ofertas',
      urlTitle: 'Conoce las Ofertas Destacadas'
    },
    {
      imageUrl: 'assets/images/home/banners/mobile/02.jpg',
      title1: '',
      title2: 'Envíos a todo el País.',
      subtitle: '¿Ya tienes cuenta en Daru?',
      url: '/register',
      urlTitle: 'Regístrate en DARU'
    },
    {
      imageUrl: 'assets/images/home/banners/mobile/03.jpg',
      title1: '',
      title2: 'Atención Personalizada.',
      subtitle: '¿Tienes alguna duda? Estamos para ayudarte',
      url: '/comocomprar',
      urlTitle: '¿Cómo comprar?'
    },
    {
      imageUrl: 'assets/images/home/banners/mobile/04.jpg',
      title1: '',
      title2: 'Envíos a todo el País.',
      subtitle: '¿Ya tienes cuenta en Daru?',
      url: '/register',
      urlTitle: 'Regístrate en DARU'
    },
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
    this.modalService.openNewsletter();
    this.onResize = this.onResize.bind(this);
    combineLatest([
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
      this.activeRoute.data
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([navigationEnd, data]: [NavigationEnd, { title: string }]) => {
        this.pageTitle = data.title || '';
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
    this.onResize();
    window.addEventListener('resize', this.onResize);
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
    window.removeEventListener('resize', this.onResize);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 767;
    this.currentBannerImages = isMobile ? this.mobileBannerImages : this.desktopBannerImages;
    this.updateBannerSlider();
  }

  updateBannerSlider() {
    this.bannerSlider = this.currentBannerImages.map((imageUrl, index) => ({
      imageUrl,
      title1: this.bannerSlider[index]?.title1 || '',
      title2: this.bannerSlider[index]?.title2 || '',
      subtitle: this.bannerSlider[index]?.subtitle || '',
      url: this.bannerSlider[index]?.url || '',
      urlTitle: this.bannerSlider[index]?.urlTitle || ''
    }));
    setTimeout(() => {
      this.owlCarousel.refresh();
    }, 0);
  }

  initializeProducts(): void {
    this.productService.getProducts(1, -1, '', false, [], [], [], true).subscribe(result => {
      if (result && result.products && result.products.length > 0) {
        this.products = result.products;
        if (result.products.category) {
          this.products.forEach(p => {
            p.category.forEach(c => {
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
            if (j <= 2) {
              this.saleProductsExclusive.push(sale);
            }
          } else {
            i += 1;
            if (i <= 3) {
              this.saleProducts3.push(sale);
            }
          }
          if (sale.until === this.today()) {
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
      infoEventAlert('Para poder continuar es necesario que ingreses un correo electrónico.', '');
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
        infoEventAlert(`Gracias por contactarnos, para ser agregado a la lista de contactos correos, Pronto te contactaremos a tu correo: ${email}`, '', TYPE_ALERT.SUCCESS);
        this.formData.controls.email.setValue('');
      },
      (error) => {
        infoEventAlert('Lo sentimos hubo un error en el correo enviado para ser agregado a la lista de contactos. Por favor contacta con marketplace@daru.mx', '', TYPE_ALERT.ERROR);
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
