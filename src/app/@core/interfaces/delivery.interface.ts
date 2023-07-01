import { IOrderCt } from './suppliers/orderct.interface';
import { IOrderCva } from './suppliers/ordercva.interface';
import { IOrderCtResponse } from './suppliers/orderctresponse.interface';
import { IOrderCvaResponse } from './suppliers/ordercvaresponse.interface';
import { IWarehouse } from './warehouses.interface';
import { IUser } from './user.interface';

export interface IDelivery {
  id: string;
  deliveryId: string;
  registerDate?: string;
  user: IUser;
  warehouses: IWarehouse[];
  ordersCt?: IOrderCt[];
  ordersCva?: IOrderCva[];
  orderCtResponse?: IOrderCtResponse;
  orderCvaResponse?: IOrderCvaResponse;
}
