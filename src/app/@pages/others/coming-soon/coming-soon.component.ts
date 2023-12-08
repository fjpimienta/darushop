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
    const subjectInt2 = 'Felicidades tienes un cupon DARU';
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


    const html2 = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns:v="urn:schemas-microsoft-com:vml">

    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">

      <style type="text/css">
        v\:* {
          behavior: url(#default#VML);
          display: inline-block;
        }

        a {
          text-decoration: none;
        }

        .column {
          min-width: 0px !important;
        }

        .innerMultiTD,
        .innerTD {
          height: 1px;
        }

        /* iOS LINKS AZULES HEREDAN COLORES DEL HTML */
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }

        @media only screen and (max-width: 599px) {
          .mobileColumn {
            width: 100% !important;
            max-width: 100% !important;
          }

          .tdMobile {
            margin: 0px !important;
            padding: 0px !important;
          }

          img {
            max-width: 100% !important;
            width: 100% !important;
          }

          #newsTable {
            margin: 0;
            padding: 0;
            width: 100% !important;
          }
        }
      </style>

      <!--[if mso]>
        <style type="text/css">
          /* Estilos adicionales específicos de Outlook */
          /* ESTILOS PARA OUTLOOK */
          body,
          table,
          td,
          a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }

          table,
          td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }

          img {
            -ms-interpolation-mode: bicubic;
          }
          /* ... */
        </style>
      <![endif]-->
    </head>

    <body style="text-align: center;min-width:100%;color:#000000;">
      <div align="center" style="margin-left:auto;margin-right:auto;">
        <table border="0" cellpadding="0" cellspacing="0" bgcolor='#ffffff' width='100%' style='width:600px;'>
          <tr>
            <td align='center' valign='top' style='width:100%;'>
              <table cellpadding='0' cellspacing='0' border='0' width='600' style='width:600px;'>
                <tr>
                  <td align='center' valign='top' style='width:100%;'>
                    <center>
                      <a href="https://www.daru.mx/wellcome" target="_blank" data-label="Bienvenida">
                        Ir a la Version Web
                      </a>
                    </center>
                  </td>
                </tr>
                <tr>
                  <td align='center' valign='top' style='width:100%;'>
                    <center>
                      <div style='padding: 0px;'>
                        <div align="center">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td align="center" style="padding: 0px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="auto" align="center" style="z-index: 999;">
                                  <tr>
                                    <td valign="top" align="center" style="padding: 0px;">
                                      <table cellpadding="0" cellspacing="0" width="100%" align="center">
                                        <tr>
                                          <td style="padding: 0px;">
                                            <a href="https://www.daru.mx/ofertas" target="_blank" data-label="Ofertas">
                                              <img src="https://s3.amazonaws.com/imagesrepository.icommarketing.com/ImagesRepo/MjU0NC04MzQxLWRhcnVteF91c3I1/8382/NEWSLETTER_3+codigo+de+descuento.jpg"
                                                width="600" alt="Link Bienvenida" border="0"
                                                style="display: block; width: 600px; height: auto; max-width: 600px; position: relative; visibility: visible;"
                                              >
                                            </a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </center>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
    `
    const mail2: IMail = {
      to: email,
      subject: subjectInt2,
      html: html2
    };

    this.mailService.send(mail2).subscribe(
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
