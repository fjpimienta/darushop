export class OrderCt {
  idPedido: number;
  almacen: string;
  tipoPago: string;
  envio: EnvioCt[];
  producto: ProductoCt[];
}

export class EnvioCt {
  nombre: string;
  direccion: string;
  entreCalles: string;
  noExterior: string;
  colonia: string;
  estado: string;
  ciudad: string;
  codigoPostal: number;
  telefono: string;
}

export class ProductoCt {
  cantidad: number;
  clave: string;
  precio: number;
  moneda: string;
}
