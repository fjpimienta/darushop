export class UserBasicInput {
  id: string;
  name: string;
  lastname: string;
  email: string;
  stripeCustomer?: string;
  phone?: string;
  addresses?: AddressInput[];
  policy?: boolean;
}

/**
 * Clase de los datos de entrada del usuario.
 */
export class UserInput extends UserBasicInput {
  registerdate?: string;
  role?: string;
}

/**
 * Clase de las direcciones del usuario.
 */
export class AddressInput {
  c_pais: string;
  d_pais: string;
  c_estado: string;
  d_estado: string;
  c_mnpio: string;
  d_mnpio: string;
  c_ciudad: string;
  d_ciudad: string;
  d_asenta: string;
  directions: string;
  phone: string;
  references: string;
  d_codigo: string;
  dir_invoice: boolean;
  dir_delivery: boolean;
  dir_delivery_main: boolean;
  outdoorNumber: string;
  interiorNumber: string;
}
