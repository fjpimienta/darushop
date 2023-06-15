/**
 * Clase de Respuesta de Ordenes para CT
 */
export class OrderCtResponse {
  pedidoWeb: string;
  tipoDeCambio: number;
  estatus: string;
  errores: ErroresCT[];
}

export class ErroresCT {
  errorCode: number;
  errorMessage: string;
  errorReference: string;
}
