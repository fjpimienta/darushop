export class Supplier {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  large_description: string;
  addres: string;
  contact: string;
  phone: string;
  web: string;
  url_base_api: string;
  url_base_api_order: string;
  url_base_api_shipments: string;
  token: Token;
  apis: Apis[];
  active: boolean;
}

export class Token {
  type: string;
  method: string;
  url_base_token: string;
  header_parameters?: BodyParameters[];
  body_parameters: BodyParameters[];
  response_token: Responsetoken[];
}

export class BodyParameters {
  name: string;
  value: string;
  secuence: number;
  onlyUrl: boolean;
}

export class Responsetoken {
  name: string;
  es_token: boolean;
}

export class Apis {
  type: string;
  name: string;
  method: string;
  operation: string;
  suboperation: string;
  use: string;
  return: string;
  headers: Headers;
  parameters: Parameters[];
  requires_token: boolean;
}

export class Headers {
  authorization: boolean;
}

export class Parameters {
  name: string;
  value: string;
  secuence: number;
  onlyUrl: boolean;
}

export class ObtenerMarcasResponse {
  Obtener_MarcasResult: ObtenerMarcasResult[];
}

export class ObtenerMarcasResult {
  id_marca: string;
  descripcion: string;
}
