export class Country {
  id?: string;
  c_pais?: string;
  d_pais?: string;
  estados: Estado[];
}

export class Estado {
  c_estado: string;
  d_estado: string;
  municipios: Municipio[];
}

export class Municipio {
  c_mnpio: string;
  D_mnpio: string;
}
