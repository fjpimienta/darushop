export class InvoiceConfigInput {
  factura: Boolean
  nombres: String
  apellidos: String
  nombreEmpresa: String
  rfc: String
  codigoPostal: String
  formaPago: FormaPago
  metodoPago: MetodoPago
  regimenFiscal: RegimenFiscal
  usoCFDI: UsoCFDI
}

export class InvoiceConfig {
  formaPago: FormaPago[];
  metodoPago: MetodoPago[]
  regimenFiscal: RegimenFiscal[];
  usoCFDI: UsoCFDI[];
}

export class FormaPago {
  id: string;
  descripcion: string;
}

export class MetodoPago {
  id: string;
  descripcion: string;
  fechaInicioDeVigencia: string;
  fechaFinDeVigencia: string;
}

export class RegimenFiscal {
  id: string;
  descripcion: string;
  fisica: string;
  moral: string;
}

export class UsoCFDI {
  id: string;
  descripcion: string;
  aplicaParaTipoPersonaFisica: string;
  aplicaParaTipoPersonaMoral: string;
}
