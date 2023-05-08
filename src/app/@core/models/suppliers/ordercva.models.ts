export class OrderCva {
  NumOC: string;
  Paqueteria: string;
  CodigoSucursal: string;
  PedidoBO: string;
  Observaciones: string;
  productos: ProductoCva[];
  TipoFlete: string;
  Calle: string;
  Numero: string;
  NumeroInt: string;
  Colonia: string;
  Estado: string;
  Ciudad: string;
  Atencion: string;
}

export class ProductoCva {
  clave: string;
  cantidad: string;
}
