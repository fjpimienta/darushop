import { Component, OnInit } from '@angular/core';
import Cookie from 'js-cookie';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from 'src/environments/environment';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { infoEventAlert } from '@shared/alert/alerts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { WelcomesService } from '@core/services/welcomes.service';
import { IcommktsService } from '@core/services/suppliers/icommkts.service';
import { IIcommktContact } from '@core/interfaces/suppliers/icommkt.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

const HUNTER_API_KEY = '550e992043c66925659ef73486f16a7db842cadb';

@Component({
  selector: 'app-newsletter-modal',
  templateUrl: './newsletter-modal.component.html',
  styleUrls: ['./newsletter-modal.component.scss']
})

export class NewsletterModalComponent implements OnInit {

  checkState = false;
  formData!: FormGroup;
  emailValid = false;

  constructor(
    private modalService: NgbActiveModal,
    private formBuilder: FormBuilder,
    private welcomesService: WelcomesService,
    private icommktsService: IcommktsService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      sexo: [''],
      fecha_de_nacimiento: ['', this.fechaValida]
    });
    if (this.formData) {
      const emailControl = this.formData.get('email');
      if (emailControl) {
        console.log('emailControl: ', emailControl);
        console.log('this.formData.get(email): ', this.formData.get('email'));
        if (emailControl.valid) {
          this.checkEmailValidity(emailControl.value);
        }
      } else {
        console.error('Control de correo electrónico no encontrado en el formulario.');
      }
    }
  }

  checkEmailValidity(email: string): void {
    const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${HUNTER_API_KEY}`;
    console.log('url: ', url);
    this.http.get(url).pipe(
      map((response: any) => {
        console.log('responseL: ', response);
        return response.data.result === 'deliverable';
      }),
      catchError(error => {
        console.error('Error al verificar el dominio:', error);
        return of(false);
      })
    ).subscribe((isValid: boolean) => {
      this.emailValid = isValid;
    });
  }

  fechaValida(control: AbstractControl) {
    const inputValue = control.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
      return { formatoInvalido: true };
    }
    const year = Number(inputValue.split('-')[0]);
    if (year.toString().length !== 4) {
      return { longitudInvalida: true };
    }
    return null;
  }

  changeCheck() {
    this.checkState = !this.checkState;
  }

  closeModal() {
    this.modalService.dismiss();
    this.checkState && Cookie.set(`hideNewsletter-${environment.demo}`, "true", { expires: 7 });
  }

  async onSubmit() {
    if (!this.formData.valid || !this.emailValid) {
      infoEventAlert('Revisar los campos requeridos o el correo electrónico.', '');
      return;
    }

    const nombre: string = this.formData.controls.nombre.value.toUpperCase();
    const apellido: string = this.formData.controls.apellido.value.toUpperCase();
    const sexo: string = this.formData.controls.sexo.value.toUpperCase();
    const fecha: string = this.formData.controls.fecha_de_nacimiento.value;
    const fecha_de_nacimiento = this.cambiarFormatoFecha(fecha);
    const email: string = this.formData.controls.email.value.toLowerCase();

    const icommktContact: IIcommktContact = {
      "Email": email,
      "CustomFields": [
        {
          "Key": "nombre",
          "Value": nombre
        },
        {
          "Key": "apellido",
          "Value": apellido
        },
        {
          "Key": "sexo",
          "Value": sexo
        },
        {
          "Key": "fecha_de_nacimiento",
          "Value": fecha_de_nacimiento
        }
      ]
    };

    const contacto = await this.icommktsService.add(icommktContact);

    if (!contacto.status) {
      infoEventAlert(contacto.message, '', TYPE_ALERT.WARNING);
      this.onCleanForm();
      return;
    }

    const name = nombre + ' ' + apellido;
    const cupon = 'BIENVENIDOADARU';

    const welcome = {
      'welcome': {
        email,
        name,
        cupon
      }
    }
    const respuesta = await this.welcomesService.add(welcome);
    console.log('respuesta: ', respuesta);
    if (!respuesta.status) {
      infoEventAlert(respuesta.message, '', TYPE_ALERT.WARNING);
      this.formData.controls.email.setValue('');
      return;
    }

    this.onCleanForm();
    infoEventAlert(respuesta.message, '', TYPE_ALERT.SUCCESS);
  }

  onCleanForm() {
    this.formData.controls.nombre.setValue('');
    this.formData.controls.apellido.setValue('');
    this.formData.controls.sexo.setValue('');
    this.formData.controls.fecha_de_nacimiento.setValue('');
    this.formData.controls.email.setValue('');
  }

  convertToUppercase(event: any) {
    let inputValue = event.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    event.target.value = inputValue;
  }

  validarFecha(event: any) {
    const inputValue = event.target.value;
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(inputValue)) {
      console.log('Formato de fecha no válido');
    }
  }

  cambiarFormatoFecha(fecha: string): string {
    const fechaObj = new Date(fecha + 'T00:00:00Z');
    const dia = fechaObj.getUTCDate();
    const mes = fechaObj.getUTCMonth() + 1;
    const anio = fechaObj.getUTCFullYear();
    const fechaFormateada = `${dia < 10 ? '0' : ''}${dia}-${mes < 10 ? '0' : ''}${mes}-${anio}`;
    return fechaFormateada;
  }
}
