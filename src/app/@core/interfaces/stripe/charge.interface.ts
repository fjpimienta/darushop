export interface ICharge {
   id: string;
   card: string;
   paid: boolean;
   customer: string;
   created: string;
   amount: number;
   status: string;
   receipt_url: string;
   receipt_email: string;
   typeOrder: string;
}
