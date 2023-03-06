import { IUser } from "./user.interface";
import { ICharge } from "./stripe/charge.interface";
import { ICartItem } from "./cartitem.interface";

export interface IOrder {
  id?: string;
  user: IUser;
  charge: ICharge;
  cartitems: ICartItem[];
}
