import { Component, OnInit } from '@angular/core';
import Cookie from 'js-cookie';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailService } from '@core/services/mail.service';
import { infoEventAlert } from '@shared/alert/alerts';
import { IMail } from '@core/interfaces/mail.interface';
import { TYPE_ALERT } from '@shared/alert/values.config';

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
    private mailService: MailService
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]]
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
          <h2>Correo Enviado desde Proximamente</h2>
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
}
