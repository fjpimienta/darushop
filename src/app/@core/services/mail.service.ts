import { Injectable } from '@angular/core';
import { IMail } from '@core/interfaces/mail.interface';
import { ProductShipment } from '@core/models/productShipment.models';
import { SEND_EMAIL_ACTION } from '@graphql/operations/mutation/mail';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MailService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  send(mail: IMail) {
    return this.set(
      SEND_EMAIL_ACTION,
      { mail }
    ).pipe(map((result: any) => {
      return result.sendEmail;
    }));
  }


  //#region Emails  //ICharge
  sendEmail(charge: any, issue: string = '', message: string = '', internal: boolean = false,
    totalEnvios: string = '0', esFacturable: boolean = false): void {
    const emailFrom = 'DARU Shop <marketplace@daru.mx>';
    const receiptEmail = charge.receipt_email + '; marketplace@daru.mx; ventas@daru.mx';
    const subject = issue !== '' ? issue : 'Confirmación del pedido';
    const productos: ProductShipment[] = [];
    let totalProd = 0.0;
    for (const idW of Object.keys(charge.warehouses)) {
      const warehouse = charge.warehouses[idW];
      for (const idP of Object.keys(warehouse.productShipments)) {
        const prod = warehouse.productShipments[idP];
        totalProd += (prod.precio * prod.cantidad);
        productos.push(prod);
      }
    }
    const discount = charge.discount;
    let rowDiscount = '';
    if (Number.isInteger(discount) && discount > 0) {
      rowDiscount = `
                      <tr>
                        <td colspan="2">&nbsp;</td>
                        <td colspan="2"><strong>Descuento:</strong></td>
                        <td colspan="4" class="number">$ ${discount.toFixed(2).toString()}</td>
                      </tr>
                    `
    }
    const total = totalProd + parseFloat(totalEnvios) - (Number.isNaN(discount) ? 0 : parseFloat(discount));
    let datosFactura = ''
    if (esFacturable) {
      const nombre = charge.invoiceConfig.nombreEmpresa !== '' ? charge.invoiceConfig.nombreEmpresa : charge.invoiceConfig.nombres + ' ' + charge.invoiceConfig.apellidos;
      datosFactura = `
      <tr>
        <td colspan="2">DATOS PARA FACTURAR: </td>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td colspan="2">Nombre</td>
        <td colspan="2">${nombre}</td>
      </tr>
      <tr>
        <td colspan="2">RFC</td>
        <td colspan="2">${charge.invoiceConfig.rfc}</td>
      </tr>
      <tr>
        <td colspan="2">Codigo Postal: </td>
        <td colspan="2">${charge.invoiceConfig.codigoPostal}</td>
      </tr>
      <tr>
        <td colspan="2">Forma de Pago: </td>
        <td colspan="2">${charge.invoiceConfig.formaPago.id}: ${charge.invoiceConfig.formaPago.descripcion}</td>
      </tr>
      <tr>
        <td colspan="2">Metodo de Pago: </td>
        <td colspan="2">${charge.invoiceConfig.metodoPago.id}: ${charge.invoiceConfig.metodoPago.descripcion}</td>
      </tr>
      <tr>
        <td colspan="2">Regimen Fiscal: </td>
        <td colspan="2">${charge.invoiceConfig.regimenFiscal.id}: ${charge.invoiceConfig.regimenFiscal.descripcion}</td>
      </tr>
      <tr>
        <td colspan="2">Uso de CFDI: </td>
        <td colspan="2">${charge.invoiceConfig.usoCFDI.id}: ${charge.invoiceConfig.usoCFDI.descripcion}</td>
      </tr>
    `;
    }
    const productRows = productos.map((producto: any) => `
        <tr>
          <td colspan="2">${producto.name}</td>
          <td colspan="2" class="number">${producto.cantidad}</td>
          <td colspan="2" class="number">${producto.precio.toFixed(2).toString()}</td>
          <td colspan="2" class="number">${producto.total.toFixed(2).toString()}</td>
        </tr>
      `).join('');
    const html = message !== '' ? message : `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nota de Compra</title>
        <style>
          /* Estilos generales */
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333333;
            margin-top: 0;
          }
          p {
            color: #666666;
            line-height: 1.5;
            font-size: 10px; /* Tamaño de letra de los párrafos */
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px; /* Tamaño de letra de los párrafos */
          }
          th, td {
            padding: 10px;
            border-bottom: 1px solid #dddddd;
          }
          th {
            text-align: left;
            font-weight: bold;
          }
          .number th {
            text-align: right;
            font-weight: bold;
          }
          tfoot td {
            text-align: right;
            font-weight: bold;
          }
          foot {
            color: #666666;
            font-size: 8px; /* Tamaño de letra de los párrafos */
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nota de Compra</h1>
          <p>Estimado/a ${charge.user.name} ${charge.user.lastname},</p>
          <p>A continuación, adjuntamos la nota de compra correspondiente a su pedido:</p>
          <table>
            <thead>
              <tr>
                <th colspan="2">Producto</th>
                <th colspan="2">Cantidad</th>
                <th colspan="2">Precio Unitario</th>
                <th colspan="2">Total</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">&nbsp;</td>
                <td colspan="2"><strong>Subtotal:</strong></td>
                <td colspan="4" class="number">$ ${totalProd.toFixed(2).toString()}</td>
              </tr>
              <tr>
                <td colspan="2">&nbsp;</td>
                <td colspan="2"><strong>Costo Envio:</strong></td>
                <td colspan="4" class="number">$ ${totalEnvios}</td>
              </tr>
              ${rowDiscount}
              <tr>
                <td colspan="2">&nbsp;</td>
                <td colspan="2"><strong>Total:</strong></td>
                <td colspan="4" class="number">$ ${total.toFixed(2).toString()}</td>
              </tr>
              ${datosFactura}
            </tfoot>
          </table>
          <p>Gracias por su compra. Si tiene alguna pregunta o necesita ayuda adicional, no dude en ponerse en contacto con nuestro equipo de atención al cliente.</p>
          <p>Saludos cordiales,</p>
          <p>DARU</p>
          <hr>
          <hr>
          <p class="foot">
            Este mensaje contiene información de DARU, la cual es de carácter privilegiada, confidencial y de acceso restringido conforme a la ley aplicable. Si el lector de este mensaje no es el destinatario previsto, empleado o agente responsable de la transmisión del mensaje al destinatario, se le notifica por este medio que cualquier divulgación, difusión, distribución, retransmisión, reproducción, alteración y/o copiado, total o parcial, de este mensaje y su contenido está expresamente prohibido. Si usted ha recibido esta comunicación por error, notifique por favor inmediatamente al remitente del presente correo electrónico, y posteriormente elimine el mismo.
          </p>
        </div>
      </body>
      </html>
      `;
    console.log('charge.invoceConfigInput: ', charge.invoceConfigInput);
    console.log('receiptEmail: ', receiptEmail);
    // const subject
    const mail: IMail = {
      to: receiptEmail,
      subject,
      html,
      from: emailFrom,
    };
    this.send(mail).pipe(first()).subscribe();                      // Envio de correo externo.
    if (internal) {                                                        // Correos internos
      const receiptEmailInt = charge.receipt_email + '; marketplace@daru.mx; ventas@daru.mx';
      const subjectInt = issue !== '' ? issue : 'Pedido solicitado al proveedor';
      let htmlInt = '';
      if (charge.orderCtResponse) {
        htmlInt = 'Pedido de CT';
      }
      if (charge.orderCvaResponse) {
        htmlInt = 'Pedido de CVA';
      }
      const mailInt: IMail = {
        to: receiptEmailInt,
        subject: subjectInt,
        html: htmlInt,
        from: emailFrom,
      };
      this.send(mailInt).pipe(first()).subscribe();                      // Envio de correo externo.
    }
  }

  sendEmailSpei(charge: any, issue: string = '', message: string = '', internal: boolean = false, totalEnvios: string = '0'): void {
    const emailFrom = 'DARU Shop <marketplace@daru.mx>';
    const receiptEmail = charge.receipt_email + '; marketplace@daru.mx; ventas@daru.mx';
    const subject = issue !== '' ? issue : 'Confirmación del pedido';
    const productos: ProductShipment[] = [];
    let totalProd = 0.0;
    for (const idW of Object.keys(charge.warehouses)) {
      const warehouse = charge.warehouses[idW];
      for (const idP of Object.keys(warehouse.productShipments)) {
        const prod = warehouse.productShipments[idP];
        totalProd += (prod.precio * prod.cantidad);
        productos.push(prod);
      }
    }
    const discount = charge.discount;
    let rowDiscount = '';
    if (Number.isInteger(discount) && discount > 0) {
      rowDiscount = `
                      <tr>
                        <td colspan="2">&nbsp;</td>
                        <td colspan="2"><strong>Descuento:</strong></td>
                        <td colspan="4" class="number">$ ${discount.toFixed(2).toString()}</td>
                      </tr>
                    `
    }
    const total = totalProd + parseFloat(totalEnvios) - (Number.isNaN(discount) ? 0 : parseFloat(discount));
    const productRows = productos.map((producto: any) => `
        <tr>
          <td>${producto.name}</td>
          <td class="number">${producto.cantidad}</td>
          <td class="number">${producto.precio.toFixed(2).toString()}</td>
          <td class="number">${producto.total.toFixed(2).toString()}</td>
        </tr>
      `).join('');
    const html = message !== '' ? message : `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nota de Compra</title>
        <style>
          /* Estilos generales */
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333333;
            margin-top: 0;
          }
          p {
            color: #666666;
            line-height: 1.5;
            font-size: 10px; /* Tamaño de letra de los párrafos */
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px; /* Tamaño de letra de los párrafos */
          }
          th, td {
            padding: 10px;
            border-bottom: 1px solid #dddddd;
          }
          th {
            text-align: left;
            font-weight: bold;
          }
          tfoot td {
            text-align: right;
            font-weight: bold;
          }
          foot {
            color: #666666;
            font-size: 8px; /* Tamaño de letra de los párrafos */
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nota de Compra</h1>
          <p>Estimado/a ${charge.user.name} ${charge.user.lastname},</p>
          <p>A continuación, adjuntamos la nota de compra correspondiente a su pedido:</p>
          <table>
            <thead>
              <tr>
                <th colspan="2">Producto</th>
                <th colspan="2">Cantidad</th>
                <th colspan="2">Precio Unitario</th>
                <th colspan="2">Total</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">&nbsp;</td>
                <td colspan="2"><strong>Subtotal:</strong></td>
                <td colspan="4" class="number">$ ${totalProd.toFixed(2).toString()}</td>
              </tr>
              <tr>
                <td colspan="2">&nbsp;</td>
                <td colspan="2"><strong>Costo Envio:</strong></td>
                <td colspan="4" class="number">$ ${totalEnvios}</td>
              </tr>
              ${rowDiscount}
              <tr>
                <td colspan="2">&nbsp;</td>
                <td colspan="2"><strong>Total:</strong></td>
                <td colspan="4" class="number">$ ${total.toFixed(2).toString()}</td>
              </tr>
              <tr>
                <td colspan="8"><strong>Realiza tu pago directamente en nuestra cuenta bancaria. Su pedido no se enviará hasta que los fondos se hayan liquidado en nuestra cuenta.</strong></td>
              </tr>
              <tr>
                <td colspan="4">&nbsp;</td>
                <td colspan="4">Datos de la Cuenta a Transferir</td>
              </tr>
              <tr>
                <td colspan="2">&nbsp;</td>
                <td colspan="2">Banco</td>
                <td colspan="4">BBVA Mexico (Pesos Mexicanos)</td>
              </tr>
              <tr>
                <td colspan="2">&nbsp;</td>
                <td colspan="2">Nombre</td>
                <td colspan="4">Daru Innovacion S de RL de CV</td>
              </tr>
              <tr>
                <td colspan="2">&nbsp;</td>
                <td colspan="2">Clabe</td>
                <td colspan="4">0121 80001201 4699 46</td>
              </tr>
              <tr>
                <td colspan="8">&nbsp;</td>
              </tr>
            </tfoot>
          </table>
          <p>Gracias por su compra. Si tiene alguna pregunta o necesita ayuda adicional, no dude en ponerse en contacto con nuestro equipo de atención al cliente.</p>
          <p>Saludos cordiales,</p>
          <p>DARU</p>
          <hr>
          <hr>
          <p class="foot">
            Este mensaje contiene información de DARU, la cual es de carácter privilegiada, confidencial y de acceso restringido conforme a la ley aplicable. Si el lector de este mensaje no es el destinatario previsto, empleado o agente responsable de la transmisión del mensaje al destinatario, se le notifica por este medio que cualquier divulgación, difusión, distribución, retransmisión, reproducción, alteración y/o copiado, total o parcial, de este mensaje y su contenido está expresamente prohibido. Si usted ha recibido esta comunicación por error, notifique por favor inmediatamente al remitente del presente correo electrónico, y posteriormente elimine el mismo.
          </p>
        </div>
      </body>
      </html>
      `;
    // const subject
    const mail: IMail = {
      to: receiptEmail,
      subject,
      html,
      from: emailFrom,
    };
    this.send(mail).pipe(first()).subscribe();                      // Envio de correo externo.
    if (internal) {                                                        // Correos internos
      const receiptEmailInt = charge.receipt_email + '; marketplace@daru.mx; ventas@daru.mx';
      const subjectInt = issue !== '' ? issue : 'Pedido solicitado al proveedor';
      let htmlInt = '';
      if (charge.orderCtResponse) {
        htmlInt = 'Pedido de CT';
      }
      if (charge.orderCvaResponse) {
        htmlInt = 'Pedido de CVA';
      }
      const mailInt: IMail = {
        to: receiptEmailInt,
        subject: subjectInt,
        html: htmlInt,
        from: emailFrom,
      };
      this.send(mailInt).pipe(first()).subscribe();                      // Envio de correo externo.
    }
  }
  //#endregion Emails


}
