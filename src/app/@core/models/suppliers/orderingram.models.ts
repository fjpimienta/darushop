export class IOrderIngramInput {
  orderNumberClient: string;
  company: string;
  note: string;
  nameClient: string;
  street: string;
  colony: string;
  phoneNumber: string;
  city: string;
  state: string;
  cp: string;
  email: string;
  branch: string;
  products: IProductOrderIngram[];
  carrier: string;
}

export class IProductOrderIngram {
  sku: string;
  qty: number;
}

export class IShippingBDIInput {
  street: string;
  colony: string;
  phoneNumber: string;
  city: string;
  state: string;
  cp: string;
  products: IProductShipmentIngram[];
}

export class IProductShipmentIngram {
  sku: string;
  qty: number;
  branch: string;
  carrier: string;
}
