export class CardOpenpayInput {
  card_number: string;
  holder_name: string;
  expiration_year: string;
  expiration_month: string;
  cvv2: string;

  allows_charges?: boolean;
  allows_payouts?: boolean;
  bank_code?: string;
  bank_name?: string;
  creation_date?: string;
  customer_id?: string;
  id?: string;
  type?: string;
}

export class CustomerOpenpayInput {
  external_id: string;
  name: string;
  last_name: string;
  email: string;
  phone_number: string;
  requires_account: boolean;
  clabe: string;
  address: AddressOpenpayInput
  id?: string;
  balance?: string;
  bank_name?: string;
  creation_date?: string;
  status?: string;
  store?: string;
}

export class AddressOpenpayInput {
  line1: string;
  line2: string;
  line3: string;
  postal_code: string;
  state: string;
  city: string;
  country_code: string;
}

export class ChargeOpenpayInput {
  id?: string;
  method: string;
  source_id?: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  device_session_id: string;
  capture: boolean;
  customer: CustomerOpenpayInput;
  payment_plan: PaymentPlanOpenpayInput;
  payment_method: PaymentMethodOpenpayInput;
  use_card_points: string;
  send_email: boolean;
  redirect_url: string;
  use_3d_secure: boolean;
  card: CardOpenpayInput;
  confirm: boolean;
  status: string;
  authorization?: string;
  bank_account?: string;
  conciliated?: boolean;
  creation_date?: string;
  customer_id?: string;
  error_message?: string;
  operation_date?: string;
  operation_type?: string;
  transaction_type?: string;
}

export class PaymentPlanOpenpayInput {
  payments: number;
}

export interface PaymentMethodOpenpayInput {
  type?: string;
  url?: string;
  agreement?: string;
  bank?: string;
  clabe?: string;
  name?: string;
  url_spei?: string;
}

export class CaptureChargeOpenpayInput {
  amount: number;
}

export class RefundChargeOpenpayInput {
  description: string;
  amount: number;
}

export class BankAccountOpenpayInput {
  clabe: string;
  holder_name: string;
}
