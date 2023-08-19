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
import { first } from 'rxjs/operators';
import { infoEventAlert, loadData } from '@shared/alert/alerts';
import { TYPE_ALERT } from '@shared/alert/values.config';

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

  @ViewChild('singleSlider') singleSlider: any;
  @ViewChild('customDots') customDots: any;

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private mailService: MailService,
    public utilsService: UtilsService,
    public productService: ProductsService
  ) {
    // Mostrar el modal inicial
    this.productService.getProducts(1, -1).subscribe(result => {
      this.products = result.products;
      this.products.forEach(p => {
        p.category.forEach(c => {
          // this.renameKey(c.pivot, 'product_category_id', 'product-category_id');
        });
      });
      this.topProducts = utilsService.attrFilter(result.products, 'top');
      this.newProducts = utilsService.attrFilter(result.products, 'new');
      this.saleProducts = utilsService.attrFilter(result.products, 'sale');
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
    });

    this.formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]]
    });
  }

  // Función de validación personalizada para verificar el dominio del correo electrónico
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

  renameKey(obj, oldKey, newKey): void {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }

  ngOnInit(): void {
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
    const html = `Agregar este correo ${email} a la lista de contactos`;

    const mail: IMail = {
      to: receiptEmailInt,
      subject: subjectInt,
      html: html
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


  // onSubmit() {
  //   if (this.formData.valid) {
  //     loadData('Enviando el correo electronico', 'En unos minutos seras Team Daru');
  //     const email = this.formData.controls.email.value;
  //     const receiptEmailInt = 'marketplace@daru.mx';
  //     const subjectInt = 'Dar de Alta a Usuario';
  //     const html = `Agregar este correo ${email} a la lista de contactos`
  //     const mail: IMail = {
  //       to: receiptEmailInt,
  //       subject: subjectInt,
  //       html: html
  //     };
  //     this.mailService.send(mail).subscribe(
  //       (response) => {
  //         infoEventAlert('Correo electrónico enviado con éxito:', '', TYPE_ALERT.SUCCESS);
  //       },
  //       (error) => {
  //         infoEventAlert('Error al enviear el Correo electrónico:', '', TYPE_ALERT.ERROR);
  //       }
  //     );
  //   } else {
  //     infoEventAlert('Es necesario un correo electronico.', '');
  //   }
  // }

}
