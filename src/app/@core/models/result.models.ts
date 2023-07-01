/**
 * Clase de la respuesta de los servicios.
 */
export class Result {
  info: Info;
  status: boolean;
  message: string;
  data: any;
}

/**
 * Clase relacionada con la informacion de paginacion.
 */
export class Info {
  page: number;
  pages: number;
  itemsPage: number;
  total: number;
}
