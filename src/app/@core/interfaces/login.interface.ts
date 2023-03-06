export interface ILoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface IResultLogin {
  status: boolean;
  message: string;
  token?: string;
}
export interface IRegisterForm {
  name: string;
  lastname: string;
  email: string;
  password: string;
  stripeCustomer: string;
  policy: boolean;
}
