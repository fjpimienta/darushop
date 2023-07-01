/**
 * Clase para las sesiones de usuarios.
 */

export class User {
  id: number;
  username: string;
  password: string;
  firstName?: string;
  lastname?: string;
  token?: string;
  email: string;
  phone?: string;
}
