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
}
