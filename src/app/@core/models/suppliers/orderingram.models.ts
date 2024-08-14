export class OrderIngram {
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
  products: ProductOrder[];
  carrier: string;
}

export class ProductOrder {
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
