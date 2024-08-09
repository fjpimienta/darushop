import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginCTForm, ILoginSyscomForm } from '@core/interfaces/extern-login.interface';
import { IApis, ISupplier } from '@core/interfaces/supplier.interface';
import { Warehouse } from '@core/models/warehouse.models';
import { Shipment, ShipmentSyscom } from '@core/models/shipment.models';
import { ISupplierProd, ProductShipment, ProductShipmentCT, ProductShipmentCVA } from '@core/models/productShipment.models';
import { ErroresCT, OrderCtResponse } from '@core/models/suppliers/orderctresponse.models';
import { CONFIRM_ORDER_CT, EXISTENCIAPRODUCTOSCT_LIST_QUERY, SHIPMENTS_CT_RATES_QUERY, STATUS_ORDER_CT } from '@graphql/operations/query/suppliers/ct';
import { EXISTENCIAPRODUCTOSCVA_LIST_QUERY, SHIPMENTS_CVA_RATES_QUERY } from '@graphql/operations/query/suppliers/cva';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { Result } from '@core/models/result.models';
import { EXISTENCIAPRODUCTOSINGRAM_LIST_QUERY } from '@graphql/operations/query/suppliers/ingram';
import { EXISTENCIAPRODUCTOSSYSCOM_LIST_QUERY } from '@graphql/operations/query/suppliers/syscom';
import { IDireccionSyscom } from '@core/interfaces/suppliers/orderSyscom.interface';
import { ADD_ORDER_SYSCOM } from '@graphql/operations/mutation/suppliers/syscom';
import { FormGroup } from '@angular/forms';
import { OrderSyscom, ProductoSyscom } from '@core/models/suppliers/ordersyscom.models';
import { EXISTENCIAPRODUCTOSDAISYTEK_LIST_QUERY } from '@graphql/operations/query/suppliers/daisytek';

declare const require;
const axios = require('axios');
const xml2js = require('xml2js');
const he = require('he');


@Injectable({
  providedIn: 'root'
})
export class ExternalAuthService extends ApiService {
  loginCTForm: ILoginCTForm = {
    email: '',
    cliente: '',
    rfc: ''
  };
  loginSyscomForm: ILoginSyscomForm = {
    client_id: '',
    client_secret: '',
    grant_type: ''
  };

  constructor(
    public http: HttpClient,
    apollo: Apollo
  ) {
    super(apollo);
  }
  // Define requests
  private hRCvaSucursales$ = this.http.get('assets/uploads/json/cva_sucursales.json');
  private hRCvaPaqueterias$ = this.http.get('assets/uploads/json/cva_paqueterias.json');
  private hRCvaCiudades$ = this.http.get('assets/uploads/json/cva_ciudades.json');

  //#region Token
  async getToken(
    supplier: ISupplier,
    tokenJson: boolean = false
  ): Promise<any> {
    const headers = new Headers();
    const params = new HttpParams();
    switch (supplier.slug) {
      case 'ct':
        const optionsCT = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'david.silva@daru.mx',
            cliente: 'VHA2391',
            rfc: 'DIN2206222D3'
          })
        };
        return await fetch('http://connect.ctonline.mx:3001/cliente/token', optionsCT)
          .then(response => response.json())
          .then(async response => {
            return await response;
          })
          .catch(err => console.error(err));
      case 'cva':
        const tokenBearer = '7ee694a5bae5098487a5a8b9d8392666';
        return await tokenBearer;
      case '99minutos':
        // const options = {
        //   method: 'POST',
        //   headers: { accept: 'application/json', 'content-type': 'application/json' },
        //   body: JSON.stringify({
        //     client_id: '18b99050-5cb7-4e67-928d-3f16d109b8c5',
        //     client_secret: 'gdKeiQVGBxRAY~ICpdnJ_7aKEd'
        //   })
        // };

        // return await fetch('https://delivery.99minutos.com/api/v3/oauth/token', options)
        //   .then(response => response.json())
        //   .then(response => console.log(response))
        //   .catch(err => console.error(err));


        const options = {
          method: 'POST',
          mode: 'cors' as RequestMode,
          credentials: 'include' as RequestCredentials,
          referrerPolicy: 'origin' as ReferrerPolicy,
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            client_id: '18b99050-5cb7-4e67-928d-3f16d109b8c5',
            client_secret: 'gdKeiQVGBxRAY~ICpdnJ_7aKEd'
          })
        };

        return await fetch('https://sandbox.99minutos.com/api/v3/oauth/token', options)
          .then(response => response.json())
          .then(async response => {
            return await response;
          })
          .catch(err => console.error(err));


      // const body = {
      //   client_id: '18b99050-5cb7-4e67-928d-3f16d109b8c5',
      //   client_secret: 'gdKeiQVGBxRAY~ICpdnJ_7aKEd'
      // };
      // const headers = { accept: 'application/json', 'content-type': 'application/json' };

      // try {
      //   const url = '99minutos/api/v3/oauth/token';
      //   const response = await axios.post(url, body, headers);
      //   console.log('response: ', response);
      //   return response;
      // } catch (error) {
      //   throw new Error(error.message);
      // }
    }
  }
  //#endregion Token

  //#region Catalogos

  // tslint:disable-next-line: typedef
  async parseXmlToJson(xml, catalog) {
    switch (catalog) {
      case 'lista_precios.xml':
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response.articulos.item)
          .catch(err => err);
      case 'marcas2.xml':
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response.marcas.marca)
          .catch(err => err);
      case 'grupos.xml':
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response.grupos.grupo)
          .catch(err => err);
      case 'grupos2.xml':
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response.grupos.grupo)
          .catch(err => err);
      case 'soluciones.xml':
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response.soluciones.solucion)
          .catch(err => err);
      case 'Obtener_Marcas':                                                                // SOAP Exel
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          // tslint:disable-next-line: no-string-literal
          .then(response => JSON.parse(response['soap:Envelope']['soap:Body']['Obtener_MarcasResponse']['Obtener_MarcasResult']))
          .catch(err => new Error(err.message));
      case 'Obtener_Categorias':                                                            // SOAP Exel
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          // tslint:disable-next-line: no-string-literal
          .then(response => JSON.parse(response['soap:Envelope']['soap:Body']['Obtener_Productos_HuellaLogisticaResponse']['Obtener_Productos_HuellaLogisticaResult']))
          .catch(err => new Error(err.message));
      case 'Obtener_Productos_Listado':                                                     // SOAP Exel
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          // tslint:disable-next-line: no-string-literal
          .then(response => JSON.parse(response['soap:Envelope']['soap:Body']['Obtener_Productos_ListadoResponse']['Obtener_Productos_ListadoResult']))
          .catch(err => new Error(err.message));
      case 'Obtener_Productos_PrecioYExistencia':                                           // SOAP Exel
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          // tslint:disable-next-line: no-string-literal
          .then(response => JSON.parse(response['soap:Envelope']['soap:Body']['Obtener_Productos_PrecioYExistenciaResponse']['Obtener_Productos_PrecioYExistenciaResult']))
          .catch(err => new Error(err.message));
      case 'Obtener_GaleriaDeImagenes':                                                     // SOAP Exel
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          // tslint:disable-next-line: no-string-literal
          .then(response => JSON.parse(response['soap:Envelope']['soap:Body']['Obtener_GaleriaDeImagenesResponse']['Obtener_GaleriaDeImagenesResult']))
          .catch(err => new Error(err.message));
      case 'pedidos':                                                                  // SOAP CVA
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          // tslint:disable-next-line: no-string-literal
          .then(response => response['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:ListaPedidosResponse']['pedidos']['PEDIDOS'])
          .catch(err => new Error(err.message));
      case 'pedidos_ws_cva.php':                                                                  // SOAP CVA
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:PedidoWebResponse'])
          .catch(err => new Error(err.message));
      case 'pedidos_ws_cva.php':                                                                  // SOAP CVA
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:PedidoOrdenCompraResponse'])
          .catch(err => new Error(err.message));
      default:
        break;
    }
  }
  //#endregion Catalogos

  //#region Envios
  async getShipments(supplier: ISupplier, apiSelect: IApis, token: string, warehouse: Warehouse): Promise<any> {
    if (apiSelect.parameters) {
      switch (supplier.slug) {
        case 'ct':
          const urlCT = supplier.url_base_api + apiSelect.operation + '/' + apiSelect.suboperation;
          const headersCT = new HttpHeaders({
            'x-auth': token,
            'Content-Type': 'application/json'
          });
          // Solo enviar el formato de productos para cotizar.
          const productosCT: ProductShipmentCT[] = [];
          for (const id of Object.keys(warehouse.productShipments)) {
            const pS: ProductShipment = warehouse.productShipments[id];
            const newPS: ProductShipmentCT = new ProductShipmentCT();
            newPS.producto = pS.producto;
            newPS.cantidad = pS.cantidad;
            newPS.precio = pS.priceSupplier;
            newPS.moneda = pS.moneda;
            newPS.almacen = pS.almacen;
            productosCT.push(newPS);
          }
          const fromObjectCT = {
            destino: warehouse.cp.padStart(5, '0'),
            productos: productosCT
          };
          try {
            return await this.http.post(urlCT, JSON.stringify(fromObjectCT), { headers: headersCT }).toPromise();
          } catch (error) {
            const ctResponse: OrderCtResponse = new OrderCtResponse();
            ctResponse.estatus = 'false';
            ctResponse.fecha = new Date().toISOString();
            ctResponse.pedidoWeb = '';
            ctResponse.tipoDeCambio = 0;
            ctResponse.errores = [];
            const errorCt: ErroresCT = new ErroresCT();
            errorCt.errorCode = error.error.errorCode;
            errorCt.errorMessage = error.error.errorMessage;
            errorCt.errorReference = error.error.errorReference;
            ctResponse.errores.push(errorCt);
            return await ctResponse;
          }
        case 'cva':
          // TODO Correccion de la peticion.
          let urlCVA = supplier.url_base_api_shipments + apiSelect.operation + '/';
          const productShipmentCVA: ProductShipmentCVA[] = [];
          for (const idPS of Object.keys(warehouse.productShipments)) {
            const pS: ProductShipment = warehouse.productShipments[idPS];
            const newPS: ProductShipmentCVA = new ProductShipmentCVA();
            newPS.clave = pS.producto;
            newPS.cantidad = pS.cantidad;
            productShipmentCVA.push(newPS);
          }
          const fromObjectCVA = {
            paqueteria: 4,
            cp: warehouse.cp.padStart(5, '0'),
            cp_sucursal: warehouse.productShipments[0].cp.padStart(5, '0'),
            productos: productShipmentCVA
          };
          const optionsCva = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              authorization: 'Bearer ' + token
            },
            body: JSON.stringify(fromObjectCVA),
            redirect: 'manual' as RequestRedirect,
            credentials: 'include' as RequestCredentials
          };
          urlCVA = 'https://www.grupocva.com/api/paqueteria/';
          return fetch(urlCVA, optionsCva)
            .then(response => response.json())
            .then(async response => {
              return await response.cotizacion;
            })
            .catch(err => console.error(err));

        case '99minutos':
          const options = {
            method: 'POST',
            mode: 'cors' as RequestMode,
            credentials: 'include' as RequestCredentials,
            referrerPolicy: 'origin' as ReferrerPolicy,
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              client_id: '18b99050-5cb7-4e67-928d-3f16d109b8c5',
              client_secret: 'gdKeiQVGBxRAY~ICpdnJ_7aKEd'
            })
          };

          return await fetch('https://sandbox.99minutos.com/api/v3/oauth/token', options)
            .then(response => response.json())
            .then(async response => {
              return await response;
            })
            .catch(err => console.error(err));
        // const options = {
        //   method: 'POST',
        //   headers: {
        //     accept: 'application/json',
        //     'Content-Type': 'application/json',
        //     authorization: 'Bearer ' + token
        //   },
        //   body: JSON.stringify({ country: 'MEX', deliveryType: 'NXD', size: 'xl' })
        // };
        // return fetch('https://delivery.99minutos.com/99minutos/api/v3/pricing', options)
        //   .then(response => response.json())
        //   .then(async response => {
        //     return await response;
        //   })
        //   .catch(err => console.error(err));
        default:
          break;
      }
    }
  }

  async onShippingEstimate(
    supplier: ISupplier,
    apiSelect: IApis,
    warehouse: Warehouse,
    tokenJson: boolean,
    formData: FormGroup,
    pais: string,
    estado: string,
    ciudad: string,
    colonia: string = ''
  ): Promise<any> {
    try {
      let token: string;
      const shipments: Shipment[] = [];
      switch (supplier.slug) {
        case 'ct':
          const productosCt: ProductShipmentCT[] = [];
          for (const id of Object.keys(warehouse.productShipments)) {
            const pS: ProductShipment = warehouse.productShipments[id];
            const newPS: ProductShipmentCT = new ProductShipmentCT();
            newPS.producto = pS.producto;
            newPS.cantidad = pS.cantidad;
            newPS.precio = pS.priceSupplier;
            newPS.moneda = pS.moneda;
            newPS.almacen = pS.almacen;
            productosCt.push(newPS);
          }
          const destino = warehouse.cp.padStart(5, '0');
          const shippmentsCt = await this.getShippingCtRates(destino, productosCt);
          const result: Result = new Result();
          if (!shippmentsCt.status) {
            const startIndex = shippmentsCt.message.indexOf('{');
            if (startIndex !== -1) {
              const message = shippmentsCt.message.substring(startIndex);
              const errorMessage = JSON.parse(message);
              result.message = `Codigo: ${errorMessage.codigo} - ${errorMessage.mensaje}`
            }
            result.status = shippmentsCt.status
            result.data = shippmentsCt.shippingCtRates
            return await result;
          }
          let envioMasEconomico = null;
          let costoMasBajo = shippmentsCt.shippingCtRates.respuesta.cotizaciones[0].total;
          for (const envio of shippmentsCt.shippingCtRates.respuesta.cotizaciones) {            // Recuperar el envio mas economico
            envio.lugarEnvio = (warehouse.estado).toLocaleUpperCase();
            if (envio.total <= costoMasBajo) {
              envioMasEconomico = envio;
              costoMasBajo = envio.total;
            }
          }
          if (envioMasEconomico) {
            shipments.push(envioMasEconomico);
          }
          result.status = shippmentsCt.status
          result.message = shippmentsCt.message
          result.data = shipments
          return await result;
        case 'cva':
          const productShipmentCVA: ProductShipmentCVA[] = [];
          for (const idPS of Object.keys(warehouse.productShipments)) {
            const pS: ProductShipment = warehouse.productShipments[idPS];
            const newPS: ProductShipmentCVA = new ProductShipmentCVA();
            newPS.clave = pS.producto;
            newPS.cantidad = pS.cantidad;
            productShipmentCVA.push(newPS);
          }
          const paqueteria = 4;
          const cp = warehouse.cp.padStart(5, '0');
          const cp_sucursal = warehouse.productShipments[0].cp.padStart(5, '0');
          const productosCva = productShipmentCVA;
          const shippmentsCva = await this.getShippingCvaRates(paqueteria, cp, cp_sucursal, productosCva);
          const resultCva: Result = new Result();
          if (shippmentsCva && shippmentsCva.status && shippmentsCva.shippingCvaRates) {
            const shipmentCva = new Shipment();
            shipmentCva.empresa = 'PAQUETEXPRESS';
            shipmentCva.costo = shippmentsCva.shippingCvaRates.cotizacion.montoTotal;
            shipmentCva.metodoShipping = '';
            shipmentCva.lugarEnvio = (warehouse.estado).toLocaleUpperCase();
            resultCva.status = shippmentsCva.status;
            resultCva.message = shippmentsCva.message;
            resultCva.data = shipmentCva;
            return await resultCva;
          }
          resultCva.status = shippmentsCva.status;
          resultCva.message = shippmentsCva.message;
          console.log('resultCva.Error: ', resultCva);
          return await resultCva;
        case 'syscom':
          const productosSyscom: ProductoSyscom[] = [];
          for (const id of Object.keys(warehouse.productShipments)) {
            const pS: ProductShipment = warehouse.productShipments[id];
            const newPSS: ProductoSyscom = new ProductoSyscom();
            newPSS.id = parseInt(pS.producto);
            newPSS.tipo = 'nuevo';
            newPSS.cantidad = pS.cantidad;
            productosSyscom.push(newPSS);
          }
          const direccionSyscom: IDireccionSyscom = new IDireccionSyscom();
          direccionSyscom.atencion_a = formData && formData.controls.name.value !== '' ? formData.controls.name.value + ' ' + formData.controls.lastname.value : 'Cotizacion DARU';
          direccionSyscom.calle = formData && formData.controls.directions ? formData.controls.directions.value : '';
          direccionSyscom.num_ext = formData && formData.controls.outdoorNumber.value !== '' ? formData.controls.outdoorNumber.value : '';
          direccionSyscom.num_int = formData && formData.controls.interiorNumber.value !== '' ? formData.controls.interiorNumber.value : '';
          direccionSyscom.colonia = formData && formData.controls.selectColonia ? formData.controls.selectColonia.value : '';
          direccionSyscom.codigo_postal = warehouse.cp.padStart(5, '0');
          direccionSyscom.pais = pais;
          direccionSyscom.estado = estado;
          direccionSyscom.ciudad = ciudad;
          direccionSyscom.telefono = formData && formData.controls.phone.value !== '' ? formData.controls.phone.value : '';
          const orderSyscomInput: OrderSyscom = new OrderSyscom();
          orderSyscomInput.tipo_entrega = 'domicilio';
          orderSyscomInput.direccion = direccionSyscom;
          orderSyscomInput.metodo_pago = 'transferencia';
          orderSyscomInput.fletera = 'estafeta';
          orderSyscomInput.productos = productosSyscom;
          orderSyscomInput.moneda = 'mxn';
          orderSyscomInput.uso_cfdi = 'G01';
          orderSyscomInput.tipo_pago = 'pue';
          orderSyscomInput.orden_compra = 'DARU-COTIZACION';
          orderSyscomInput.ordenar = false;
          orderSyscomInput.iva_frontera = false;
          orderSyscomInput.forzar = false;
          orderSyscomInput.testmode = colonia === '' ? true : false;
          const orderSyscom = await this.getOrderSyscom(orderSyscomInput);
          orderSyscomInput.orderResponseSyscom = orderSyscom.saveOrderSyscom;
          const resultSyscom: Result = new Result();
          if (orderSyscom && orderSyscom.status && orderSyscom.saveOrderSyscom) {
            const shipmentSyscom = new ShipmentSyscom();
            shipmentSyscom.empresa = 'estafeta';
            shipmentSyscom.costo = orderSyscom.saveOrderSyscom.totales.flete;
            shipmentSyscom.metodoShipping = '';
            shipmentSyscom.lugarEnvio = (warehouse.estado).toLocaleUpperCase();
            shipmentSyscom.orderSyscom = orderSyscom.saveOrderSyscom;
            resultSyscom.status = orderSyscom.status;
            resultSyscom.message = orderSyscom.message;
            resultSyscom.data = shipmentSyscom;
            warehouse.ordersSyscom = orderSyscomInput;
            return await resultSyscom;
          }
          resultSyscom.status = orderSyscom.status;
          resultSyscom.message = orderSyscom.message;
          return await resultSyscom;
        case '99minutos':
          break;
        default:
          return await [];
      }
      if (!supplier.token) {                                                                // Si la API no requiere token
        const resultados = await this.getShipments(supplier, apiSelect, token, warehouse)
          .then(async result => {
            try {
              switch (supplier.slug) {
                case 'cva':
                  const shipmentCva = new Shipment();
                  shipmentCva.empresa = 'PAQUETEXPRESS';
                  shipmentCva.costo = result.montoTotal;
                  shipmentCva.metodoShipping = '';
                  shipmentCva.lugarEnvio = (warehouse.estado).toLocaleUpperCase();
                  shipments.push(shipmentCva);
                  return await shipments;
                default:
                  return await [];
              }
            } catch (error) {
              // TODO Enviar Costos Internos.
              return await [];
            }
          });
        return await resultados;
      } else {
        tokenJson = true;
        return await this.getToken(supplier, tokenJson)                                     // Recupera el token
          .then(
            async result => {
              switch (supplier.slug) {
                case 'ct':
                  token = result.token;
                  break;
                case 'cva':
                  token = result;
                  break;
                case 'syscom':
                  token = result.access_token;
                  break;
                case 'daisytek':
                  token = result.token;
                  break;
                case '99minutos':
                  token = result.access_token;
                  break;
                default:
                  break;
              }
              if (token) {
                const resultados = await this.getShipments(supplier, apiSelect, token, warehouse)
                  .then(async result => {
                    try {
                      switch (supplier.slug) {
                        case 'ct':
                          if (result.codigo === '2000' && result.respuesta.cotizaciones.length > 0) {
                            let envioMasEconomico = null;
                            let costoMasBajo = result.respuesta.cotizaciones[0].total;
                            for (const envio of result.respuesta.cotizaciones) {            // Recuperar el envio mas economico
                              envio.lugarEnvio = (warehouse.estado).toLocaleUpperCase();
                              if (envio.total <= costoMasBajo) {
                                envioMasEconomico = envio;
                                costoMasBajo = envio.total;
                              }
                            }
                            if (envioMasEconomico) {
                              shipments.push(envioMasEconomico);
                            }
                            return shipments;
                          } else {
                            // TODO Enviar Costos Internos.
                            return await [];
                          }
                        case 'syscom':
                          return await [];
                        case 'daisytek':
                          return await [];
                        case '99minutos':
                          const shipment = new Shipment();
                          shipment.empresa = supplier.slug;
                          shipment.costo = result.data.price;
                          shipment.metodoShipping = '';
                          shipment.lugarEnvio = (warehouse.estado).toLocaleUpperCase();
                          shipments.push(shipment);
                          return await shipments;
                        default:
                          return await [];
                      }
                    } catch (error) {
                      // TODO Enviar Costos Internos.
                      return await [];
                    }
                  });
                return await resultados;
              } else {
                console.log('No se encontró el Token de Autorización.');
                // TODO Enviar Costos Internos.
                return await [];
              }
            },
            error => {
              console.log('error.message: ', error.message);
            }
          );
      }
    } catch (error) {
      console.error('error: ', error);
    }
  }
  //#endregion

  //#region CVA
  async getShippingCvaRates(
    paqueteria: number,
    cp: string,
    cp_sucursal: string,
    productosCva: ProductShipmentCVA[]
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(SHIPMENTS_CVA_RATES_QUERY, {
        paqueteria,
        cp,
        cp_sucursal,
        productosCva
      }, {}).subscribe(
        (result: any) => {
          resolve(result.shippingCvaRates);
        },
        (error: any) => {
          console.log('async.getShippingCvaRates.error: ', error);
          reject(error);
        });
    });
  }

  async getOrderSyscom(
    orderSyscomInput: OrderSyscom
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ADD_ORDER_SYSCOM, {
        orderSyscomInput
      }, {}).subscribe(
        (result: any) => {
          resolve(result.saveOrderSyscom);
        },
        (error: any) => {
          console.log('async.getShippingSyscomRates.error: ', error);
          reject(error);
        });
    });
  }

  async getPricesCvaProduct(suppliersProd: ISupplierProd): Promise<any> {
    const existenciaProducto = {
      "existenciaProducto": suppliersProd
    }
    return new Promise<any>((resolve, reject) => {
      this.get(EXISTENCIAPRODUCTOSCVA_LIST_QUERY, existenciaProducto, {}).subscribe(
        (result: any) => {
          resolve(result.existenciaProductoCva);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
  //#endregion

  //#region CT
  async getShippingCtRates(destinoCt: String, productosCt: ProductShipmentCT[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(SHIPMENTS_CT_RATES_QUERY, {
        destinoCt,
        productosCt
      }, {}).subscribe(
        (result: any) => {
          resolve(result.shippingCtRates);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async getExistenciaProductoCt(suppliersProd: ISupplierProd): Promise<any> {
    const existenciaProducto = {
      "existenciaProducto": suppliersProd
    }
    return new Promise<any>((resolve, reject) => {
      this.get(EXISTENCIAPRODUCTOSCT_LIST_QUERY, existenciaProducto, {}).subscribe(
        (result: any) => {
          resolve(result.existenciaProductoCt);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async confirmOrderCt(folio: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(CONFIRM_ORDER_CT, {
        folio
      }, {}).subscribe(
        (result: any) => {
          resolve(result.confirmOrderCt);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async statusOrdersCt(folio: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(STATUS_ORDER_CT, {
        folio
      }, {}).subscribe(
        (result: any) => {
          resolve(result.statusOrdersCt);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
  //#endregion

  //#region Ingram
  async getExistenciaProductoIngram(suppliersProd: ISupplierProd): Promise<any> {
    const existenciaProducto = {
      "existenciaProducto": suppliersProd
    }
    return new Promise<any>((resolve, reject) => {
      this.get(EXISTENCIAPRODUCTOSINGRAM_LIST_QUERY, existenciaProducto, {}).subscribe(
        (result: any) => {
          resolve(result.existenciaProductoBDI);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
  //#endregion

  //#region Syscom
  async getExistenciaProductoSyscom(suppliersProd: ISupplierProd): Promise<any> {
    const existenciaProducto = {
      "existenciaProducto": suppliersProd
    }
    return new Promise<any>((resolve, reject) => {
      this.get(EXISTENCIAPRODUCTOSSYSCOM_LIST_QUERY, existenciaProducto, {}).subscribe(
        (result: any) => {
          resolve(result.existenciaProductoSyscom);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
  //#endregion

  //#region Daistytek
  async getExistenciaProductoDaisytek(suppliersProd: ISupplierProd): Promise<any> {
    const existenciaProducto = {
      "existenciaProducto": suppliersProd
    }
    return new Promise<any>((resolve, reject) => {
      this.get(EXISTENCIAPRODUCTOSDAISYTEK_LIST_QUERY, existenciaProducto, {}).subscribe(
        (result: any) => {
          resolve(result.existenciaProductoDaisytek);
        },
        (error: any) => {
          reject(error);
        });
    });
  }
  //#endregion

}
