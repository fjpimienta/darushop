import { Injectable } from '@angular/core';
import { CaptureChargeOpenpayInput, CardOpenpayInput, ChargeOpenpayInput, CustomerOpenpayInput } from '@core/models/openpay/_openpay.models';
import { ADD_CARD_OPENPAY, LIST_CARDS_OPENPAY, ONE_CARD_OPENPAY } from '@graphql/operations/query/openpay/cards';
import { ADD_CHARGE_OPENPAY, CAPTURE_CHARGE_OPENPAY, LIST_CHARGES_OPENPAY, ONE_CHARGE_OPENPAY } from '@graphql/operations/query/openpay/charges';
import { ADD_CUSTOMER_OPENPAY, LIST_CUSTOMERS_OPENPAY, ONE_CUSTOMER_OPENPAY, UPDATE_CUSTOMER_OPENPAY } from '@graphql/operations/query/openpay/customers';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ChargeOpenpayService extends ApiService {

  constructor(apollo: Apollo) {
    super(apollo);
  }

  //#region Cards
  async listCards(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(LIST_CARDS_OPENPAY, {}).subscribe(
        (result: any) => {
          resolve(result.listCardsOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async oneCard(idCardOpenpay: String): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ONE_CARD_OPENPAY, { idCardOpenpay }).subscribe(
        (result: any) => {
          resolve(result.cardOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async addCard(cardOpenpay: CardOpenpayInput): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ADD_CARD_OPENPAY, { cardOpenpay }).subscribe(
        (result: any) => {
          resolve(result.createCardOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
  //#endregion


  //#region Customers
  async listCustomers(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(LIST_CUSTOMERS_OPENPAY, {}).subscribe(
        (result: any) => {
          resolve(result.listCustomersOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async oneCustomer(idCustomerOpenpay: String): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ONE_CUSTOMER_OPENPAY, { idCustomerOpenpay }).subscribe(
        (result: any) => {
          resolve(result.customerOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async createCustomer(customerOpenpay: CustomerOpenpayInput): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ADD_CUSTOMER_OPENPAY, { customerOpenpay }).subscribe(
        (result: any) => {
          resolve(result.customerOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async updateCustomer(idCustomerOpenpay: String): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(UPDATE_CUSTOMER_OPENPAY, { idCustomerOpenpay }).subscribe(
        (result: any) => {
          resolve(result.customerOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
  //#endregion


  //#region Charges
  async listCharges(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(LIST_CHARGES_OPENPAY, {}).subscribe(
        (result: any) => {
          resolve(result.listChargesOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async oneCharge(idChargeOpenpay: String): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ONE_CHARGE_OPENPAY, { idChargeOpenpay }).subscribe(
        (result: any) => {
          resolve(result.chargeOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async createCharge(chargeOpenpay: ChargeOpenpayInput): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ADD_CHARGE_OPENPAY, { chargeOpenpay }).subscribe(
        (result: any) => {
          resolve(result.createChargeOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async captureCharge(idChargeOpenpay: String,
    captureTransactionOpenpay: CaptureChargeOpenpayInput): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(CAPTURE_CHARGE_OPENPAY, { idChargeOpenpay, captureTransactionOpenpay }).subscribe(
        (result: any) => {
          resolve(result.captureChargeOpenpay);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  decodeError(error: any) {
    switch (error.error_code) {
      case 1000:
        return 'Ocurrió un error interno en el servidor de Openpay.';
      case 1001:
        if (error.description.includes('cvv2 length must be 3 digits')) {
          return 'El código de seguridad de la tarjeta (CVV2) debe ser de 3 digitos.';
        } else if (error.description.includes('expiration_year')) {
          return 'El año debe ser de 2 digitos.';
        } else if (error.description.includes('expiration_month')) {
          return 'El mes debe ser de 2 digitos. De 01 a 12';
        } else if (error.description.includes('expiration_month length must be 2 digits')) {
          return 'El mes debe ser de 2 digitos. De 01 a 12';
        } else {
          return `No es posible la asignacion de la tarjeta: ${error.error_code}`;
        }
      case 1002:
        return 'La llamada no esta autenticada o la autenticación es incorrecta.';
      case 1003:
        return 'La operación no se pudo completar por que el valor de uno o más de los parámetros no es correcto.';
      case 1004:
        return 'Un servicio necesario para el procesamiento de la transacción no se encuentra disponible.';
      case 1005:
        return 'Uno de los recursos requeridos no existe.';
      case 1006:
        return 'Ya existe una transacción con el mismo ID de orden.';
      case 1007:
        return 'La transferencia de fondos entre una cuenta de banco o tarjeta y la cuenta de Openpay no fue aceptada.';
      case 1008:
        return 'Una de las cuentas requeridas en la petición se encuentra desactivada.';
      case 1009:
        return 'El cuerpo de la petición es demasiado grande.';
      case 1010:
        return 'Se esta utilizando la llave pública para hacer una llamada que requiere la llave privada, o bien, se esta usando la llave privada desde JavaScript.';
      case 1011:
        return 'Se solicita un recurso que esta marcado como eliminado.';
      case 1012:
        return 'El monto transacción esta fuera de los limites permitidos.';
      case 1013:
        return 'La operación no esta permitida para el recurso.';
      case 1014:
        return 'La cuenta esta inactiva.';
      case 1015:
        return 'No se ha obtenido respuesta de la solicitud realizada al servicio.';
      case 1016:
        return 'El mail del comercio ya ha sido procesada.';
      case 1017:
        return 'El gateway no se encuentra disponible en ese momento.';
      case 1018:
        return 'El número de intentos de cargo es mayor al permitido.';
      case 1020:
        return 'El número de dígitos decimales es inválido para esta moneda.';
      case 1023:
        return 'Se han terminado las transacciones incluidas en tu paquete. Para contratar otro paquete contacta a soporte@openpay.mx.';
      case 1024:
        return 'El monto de la transacción excede su límite de transacciones permitido por TPV.';
      case 1025:
        return 'Se han bloqueado las transacciones CoDi contratadas en tu plan.';
      case 2001:
        return 'La cuenta de banco con esta CLABE ya se encuentra registrada en el cliente.';
      case 2003:
        return 'El cliente con este identificador externo (External ID) ya existe.';
      case 2004:
        return 'El número de tarjeta no es valido.';
      case 2005:
        return 'La fecha de expiración de la tarjeta es anterior a la fecha actual.';
      case 2006:
        return 'El código de seguridad de la tarjeta (CVV2) no fue proporcionado.';
      case 2007:
        return 'El número de tarjeta es de prueba, solamente puede usarse en Sandbox.';
      case 2008:
        return 'La tarjeta no es valida para pago con puntos.';
      case 2009:
        return 'El código de seguridad de la tarjeta (CVV2) es inválido.';
      case 2010:
        return 'Autenticación 3D Secure fallida.';
      case 2011:
        return 'Tipo de tarjeta no soportada.';
      case 3001:
        return 'La tarjeta fue declinada por el banco.';
      case 3002:
        return 'La tarjeta ha expirado.';
      case 3003:
        return 'La tarjeta no tiene fondos suficientes.';
      case 3004:
        return 'Tarjeta no válida para compra. (3004)'; // La tarjeta ha sido identificada como una tarjeta robada
      case 3005:
        return 'Tarjeta no válida para compra. (3005)'; // La tarjeta ha sido rechazada por el sistema antifraude
      case 3006:
        return 'La operación no esta permitida para este cliente o esta transacción.';
      case 3009:
        return 'Tarjeta no válida para compra. (3009)'; // La tarjeta fue reportada como perdida
      case 3010:
        return 'Tarjeta no válida para compra. (3010)'; // El banco ha restringido la tarjeta
      case 3011:
        return 'Tarjeta no válida para compra. (3011)'; // El banco ha restringido la tarjeta
      case 3012:
        return 'El banco ha solicitado que la tarjeta sea retenida. Contacte al banco.';
      case 3201:
        return 'Comercio no autorizado para procesar pago a meses sin intereses.';
      case 3203:
        return 'Promoción no valida para este tipo de tarjetas.';
      case 3204:
        return 'El monto de la transacción es menor al mínimo permitido para la promoción.';
      case 3205:
        return 'Promoción no permitida.';
      case 4001:
        return 'La cuenta de Openpay no tiene fondos suficientes.';
      case 4002:
        return 'La operación no puede ser completada hasta que sean pagadas las comisiones pendientes.';
      case 6001:
        return 'El webhook ya ha sido procesado.';
      case 6002:
        return 'No se ha podido conectar con el servicio de webhook.';
      case 6003:
        return 'El servicio respondió con errores.';
      default:
        return error.description;
    }
  }

  //#endregion
}
