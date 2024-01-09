export class Cupon {
  id: string;
  cupon: string;
  description: string;
  typeDiscount?: string;
  amountDiscount?: number;
  minimumPurchase?: number;
  active?: boolean;
}
