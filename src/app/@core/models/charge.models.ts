/**
 * Clase de la entrada de los cargos
 */
export class ChargeInput {
  id: string;
  card: string;
  paid: boolean;
  description: string;
  customer: string;
  created: string;
  amount: number;
  status: string;
  receipt_url: string;
  receipt_email: string;
  typeOrder: string;
}
