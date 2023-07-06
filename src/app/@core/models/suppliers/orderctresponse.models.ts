/**
 * Clase de Respuesta de Ordenes para CT
 */
export class OrderCtResponse {
  pedidoWeb: string;
  fecha: string;
  tipoDeCambio: number;
  estatus: string;
  errores: ErroresCT[];
}

export class ErroresCT {
  errorCode: string;
  errorMessage: string;
  errorReference: string;
}

export class OrderCtConfirmResponse {
  okCode: string;
  okMessage: string;
  okReference: string;
}
