import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, first, filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject, combineLatest } from 'rxjs';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailService } from '@core/services/mail.service';
import { IMail } from '@core/interfaces/mail.interface';
import { infoEventAlert, loadData } from '@shared/alert/alerts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'pages-contact-one',
  templateUrl: './contact-one.component.html',
  styleUrls: ['./contact-one.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ContactOnePageComponent implements OnInit {
  formData: FormGroup;
  apiLoaded: Observable<boolean>;
  isSubmitting = false;

  pageTitle: string = '';
  previousPageUrl: string = '';
  previousPageTitle: string = '';
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    httpClient: HttpClient,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private mailService: MailService
  ) {
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
        }
      });
    this.formData = this.formBuilder.group({
      cname: ['', Validators.required],
      cmail: ['', Validators.required],
      cphone: ['', Validators.required],
      csubject: ['', Validators.required],
      cmessage: ['', Validators.required]
    });
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw', 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  ngOnInit(): void {
    this.activeRoute.data.subscribe((data: { title: string }) => {
      this.pageTitle = data.title || this.pageTitle;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async onSubmit(): Promise<any> {
    if (this.formData.valid) {
      loadData('Enviando el correo', 'Esperar el envio del correo.');
      const contact = {
        cname: this.formData.controls.cname.value,
        cmail: this.formData.controls.cmail.value,
        cphone: this.formData.controls.cphone.value,
        csubject: this.formData.controls.csubject.value,
        cmessage: this.formData.controls.cmessage.value,
      }
      this.sendEmail(contact);
      this.isSubmitting = true;
      this.router.navigate(['/ofertas']);
    } else {
      this.isSubmitting = false;
      return await infoEventAlert('Los datos enviados no son correctos! Verificar.', '');
    }
  }

  //#region Emails  //ICharge
  async sendEmail(contact: any): Promise<any> {
    const receiptEmail = 'marketplace@daru.mx';
    const subject = contact.csubject;
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
          <h2>Correo Enviado desde Contacto</h2>
          <p>Nos ha escrito ${contact.cname}, con el siguiente mensaje: </p>
          <hr>
          <p>${contact.cmessage}</p>
          <br>
          <p>Favor de atender la solicitud.</p>
          <hr>
          <p class="foot">
          </p>
        </div>
      </body>
      </html>
      `;
    // const subject
    const mail: IMail = {
      to: receiptEmail,
      subject,
      html
    };
    this.mailService.send(mail).pipe(first()).subscribe();

    // Respuesta al cliente.
    const receiptEmailInt = contact.cmail;
    const subjectInt = contact.csubject;
    let htmlInt = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contacto del Sitio DARU.MX</title>
    </head>
    <body>
      <div class="container">
        <h2>Correo Enviado desde Contacto</h2>
        <hr>
        <p>Estimado ${contact.cname}, su correo ha sido enviado.</p>
        <p>Muy pronto lo contactaremos.</p>
        <hr>
        <p class="foot">
          Este mensaje contiene información de DARU, la cual es de carácter privilegiada, confidencial y de acceso restringido conforme a la ley aplicable. Si el lector de este mensaje no es el destinatario previsto, empleado o agente responsable de la transmisión del mensaje al destinatario, se le notifica por este medio que cualquier divulgación, difusión, distribución, retransmisión, reproducción, alteración y/o copiado, total o parcial, de este mensaje y su contenido está expresamente prohibido. Si usted ha recibido esta comunicación por error, notifique por favor inmediatamente al remitente del presente correo electrónico, y posteriormente elimine el mismo.
        </p>
      </div>
    </body>
    </html>
    `;
    ``;
    const mailInt: IMail = {
      to: receiptEmailInt,
      subject: subjectInt,
      html: htmlInt
    };
    this.mailService.send(mailInt).pipe(first()).subscribe();

    await infoEventAlert('El correo se ha enviado. Muy pronto te contactaremos.', '', TYPE_ALERT.SUCCESS);
  }
  //#endregion Emails
}
