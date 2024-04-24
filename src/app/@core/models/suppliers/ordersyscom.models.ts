export class OrderSyscom {
  tipo_entrega: string;
  direccion: DireccionSyscom;
  metodo_pago: string;
  fletera: string;
  productos: ProductoSyscom[];
  moneda: string;
  uso_cfdi: string;
  tipo_pago: string;
  orden_compra: string;
  ordenar: boolean;
  iva_frontera: boolean;
  forzar: boolean;
  testmode: boolean;
  orderResponseSyscom: OrderResponseSyscom;
}

export class DireccionSyscom {
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

export class ProductoSyscom{
  id: number;
  cantidad: number;
  tipo: string;
}

export class OrderResponseSyscom {
  error: string;
  cliente: ClienteSyscom;
  resumen: ResumenSyscom;
  datos_entrega: DatosEntregaSyscom;
  productos: ProductoResponseSyscom[];
  totales: TotalesSyscom;
}


export class ClienteSyscom {
  num_cliente: string;
  rfc: string;
  whatsapp: string;
  email: string;
  telefono: string;
  direccion: DireccionSyscom
}

export class DireccionResponseSyscom {
  calle: string;
  num_exterior: string;
  num_interior: string;
  colonia: string;
  ciudad: string;
  estado: string;
  pais: string;
  telefono: string;
}

export class ResumenSyscom {
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

export class DatosEntregaSyscom {
  calle: string;
  num_exterior: string;
  num_interior: string;
  colonia: string;
  ciudad: string;
  estado: string;
  pais: string;
}

export class ProductoResponseSyscom{
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
  descuentos: DescuentosSyscom
}

export class DescuentosSyscom {
  distribucion: number;
  clasificacion: string;
  volumen: number;
  financiero: number;
}

export class TotalesSyscom{
  subtotal: number;
  flete: number;
  iva: number;
  total: number;
}
