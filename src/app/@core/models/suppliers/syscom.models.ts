export class IOrderSyscom {
  tipo_entrega: string;
  direccion: IDireccionSyscom;
  metodo_pago: string;
  fletera: string;
  productos: IProductsSyscom[];
  moneda: string;
  uso_cfdi: string;
  tipo_pago: string;
  orden_compra: string;
  ordenar: boolean;
  iva_frontera: boolean;
  forzar: boolean;
  testmode: boolean;
}

export class IDireccionSyscom {
  atencion_a: string;
  calle: string;
  num_ext: string;
  num_int: string;
  colonia: string;
  codigo_postal: number;
  pais: string;
  estado: string;
  ciudad: string;
  telefono: string;
}

export class IProductsSyscom {
  id: number;
  tipo: string;
  cantidad: number;
}
