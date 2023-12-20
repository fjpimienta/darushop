import { Component, OnInit } from '@angular/core';
import Cookie from 'js-cookie';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailService } from '@core/services/mail.service';
import { infoEventAlert } from '@shared/alert/alerts';
import { IMail } from '@core/interfaces/mail.interface';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { WelcomesService } from '@core/services/welcomes.service';
import { IcommktsService } from '@core/services/suppliers/icommkts.service';
import { IIcommktContact } from '@core/interfaces/suppliers/icommkt.interface';

@Component({
  selector: 'app-newsletter-modal',
  templateUrl: './newsletter-modal.component.html',
  styleUrls: ['./newsletter-modal.component.scss']
})

export class NewsletterModalComponent implements OnInit {

  checkState = false;
  formData: FormGroup;

  constructor(
    private modalService: NgbActiveModal,
    private formBuilder: FormBuilder,
    private mailService: MailService,
    private welcomesService: WelcomesService,
    private icommktsService: IcommktsService
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      sexo: [''],
      fecha_de_nacimiento: ['']
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


  changeCheck() {
    this.checkState = !this.checkState;
  }

  closeModal() {
    this.modalService.dismiss();
    this.checkState && Cookie.set(`hideNewsletter-${environment.demo}`, "true", { expires: 7 });
  }

  async onSubmit() {
    if (!this.formData.valid) {
      infoEventAlert('Revisar los campos requeridos.', '');
      return;
    }

    const contactos = await this.icommktsService.getIcommktContacts().then;
    console.log('contactos: ', contactos);

    const nombre: string = this.formData.controls.nombre.value;
    const apellido: string = this.formData.controls.apellido.value;
    const sexo: string = this.formData.controls.sexo.value;
    const fecha_de_nacimiento: string = this.formData.controls.fecha_de_nacimiento.value;
    const email: string = this.formData.controls.email.value;

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
    if (!respuesta.status) {
      infoEventAlert(respuesta.message, '', TYPE_ALERT.WARNING);
      this.formData.controls.email.setValue('');
      return;
    }

    this.onCleanForm();
    infoEventAlert('Cuenta agregada correctamente. Esperar correo de bienvenida', '', TYPE_ALERT.SUCCESS);
    this.closeModal();

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
}
