import { Product, SupplierProd } from './product.models';
import { ProductShipment } from './productShipment.models';
import { Shipment } from './shipment.models';

/**
 * Clase de los almacenes de envios.
 */
export class Warehouse {
  id?: string;
  cp: string;
  name: string;
  estado: string;
  latitud: string;
  longitud: string;
  suppliersProd: SupplierProd;
  products: Product[];
  productShipments: ProductShipment[];
  shipments: Shipment[];
}

