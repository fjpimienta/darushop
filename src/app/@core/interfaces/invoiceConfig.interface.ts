export interface IInvoiceConfig {
  formaPago: IFormaPago[];
  metodoPago: [MetodoPago];
  regimenFiscal: IRegimenFiscal[];
  usoCFDI: IUsoCFDI[];
}

export interface IFormaPago {
  id: string;
  descripcion: string;
}

export interface MetodoPago {
  id: string;
  descripcion: string;
  fechaInicioDeVigencia: string;
  fechaFinDeVigencia: string;
}

export interface IRegimenFiscal {
  id: string;
  descripcion: string;
  fisica: string;
  moral: string;
}

export interface IUsoCFDI {
  id: string;
  descripcion: string;
  aplicaParaTipoPersonaFisica: string;
  aplicaParaTipoPersonaMoral: string;
}
