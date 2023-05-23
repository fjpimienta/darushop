/**
 * Clase de Paises
 */
export class Country {
  id?: string;
  c_pais?: string;
  d_pais?: string;
  estados: Estado[];
}

/**
 * Clase de los Estados del Pais.
 */
export class Estado {
  c_estado: string;
  d_estado: string;
  municipios: Municipio[];
}

/**
 * Clase de los Municipios de los Estados.
 */
export class Municipio {
  c_mnpio: string;
  D_mnpio: string;
}
