export class IOrderSyscom {
  tipo_entrega: string;
  direccion: IDireccionSyscom;
  metodo_pago: string;
  fletera: string;
  productos: IProductoSyscom[];
  moneda: string;
  uso_cfdi: string;
  tipo_pago: string;
  orden_compra: string;
  ordenar: boolean;
  iva_frontera: boolean;
  forzar: boolean;
  testmode: boolean;
  orderResponseSyscom: IOrderSyscomResponse;
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

export class IProductoSyscom {
  id: number;
  tipo: string;
  cantidad: number;
}

export class IOrderSyscomResponse {
  error: string;
  cliente: IClienteSyscom;
  resumen: IResumenSyscom;
  datos_entrega: IDireccionResponseSyscom;
  productos: [IProductoResponseSyscom];
  totales: ITotalesSyscom;
}

export class IClienteSyscom {
  num_cliente: string;
  rfc: string;
  whatsapp: string;
  email: string;
  telefono: string;
  direccion: IDireccionResponseSyscom;
}

export class IResumenSyscom {
  peso_total: number;
  peso_vol_total: number;
  moneda: string;
  forma_pago: number;
  tipo_cambio: string;
  plazo: string;
  codigo_pago: string;
  folio: string;
  folio_pedido: string;
  fecha_creacion: string;
  iva_aplicado: number;
}

export class IProductoResponseSyscom {
  id: number;
  cantidad: number;
  tipo: string;
  modelo: string;
  titulo: string;
  marca: string;
  link: string;
  imagen: string;
  precio_lista: string;
  precio_oferta: string;
  precio_unitario: string;
  importe: number;
  descuentos: IDescuentosSyscom;
}

export class ITotalesSyscom {
  subtotal: number;
  flete: number;
  iva: number;
  total: number;
}

export class IDireccionResponseSyscom {
  calle: string;
  num_exterior: string;
  num_interior: string;
  colonia: string;
  ciudad: string;
  estado: string;
  pais: string;
}

export class IDescuentosSyscom {
  distribucion: number;
  clasificacion: string;
  volumen: number;
  financiero: number;
}
