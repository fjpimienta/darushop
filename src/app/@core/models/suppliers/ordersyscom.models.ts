export class OrderSyscom {
  error: string;
  cliente: ClienteSyscom;
  resumen: ResumenSyscom;
  datos_entrega: DatosEntregaSyscom;
  productos: ProductoSyscom[];
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

export class TotalesSyscom{
  subtotal: number;
  flete: number;
  iva: number;
  total: number;
}

export class ProductoSyscom{
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

export class DireccionSyscom {
  calle: string;
  num_exterior: string;
  num_interior: string;
  colonia: string;
  ciudad: string;
  estado: string;
  pais: string;
}

export class DescuentosSyscom {
  distribucion: number;
  clasificacion: string;
  volumen: number;
  financiero: number;
}
