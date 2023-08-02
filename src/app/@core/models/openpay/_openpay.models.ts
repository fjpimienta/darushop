export class CardOpenpayInput {
  card_number: string;
  holder_name: string;
  expiration_year: string;
  expiration_month: string;
  cvv2: string;
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
  method: string;
  source_id: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  device_session_id: string;
  capture: boolean;
  customer: CustomerOpenpayInput;
  payment_plan: PaymentPlanOpenpayInput;
  use_card_points: string;
  send_email: boolean;
  redirect_url: string;
  use_3d_secure: boolean;
  card: CardOpenpayInput;
  confirm: boolean;
}

export class PaymentPlanOpenpayInput {
  payments: number;
}

export class CaptureChargeOpenpayInput {
  amount: number;
}

export class RefundChargeOpenpayInput {
  description: string;
  amount: number;
}
