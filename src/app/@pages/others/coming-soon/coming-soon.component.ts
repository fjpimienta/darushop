import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMail } from '@core/interfaces/mail.interface';
import { MailService } from '@core/services/mail.service';
import { infoEventAlert } from '@shared/alert/alerts';
import { TYPE_ALERT } from '@shared/alert/values.config';

@Component({
  selector: 'pages-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})

export class ComingSoonPageComponent implements OnInit {
  formData: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private mailService: MailService
  ) {

  }

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
}
