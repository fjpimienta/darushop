export interface ICustomer {
  id: string;
  name: string;
  email: string;
  description?: string;
}

export interface IResultStripeCustomer {
  status: boolean;
  message: string;
  customer?: ICustomer;
}
