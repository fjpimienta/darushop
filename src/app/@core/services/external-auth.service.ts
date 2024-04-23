import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICatalog } from '@core/interfaces/catalog.interface';
import { ILoginCTForm, ILoginSyscomForm } from '@core/interfaces/extern-login.interface';
import { IApis, ISupplier } from '@core/interfaces/supplier.interface';
import { Product } from '@core/models/product.models';
import { map } from 'rxjs/operators';
import { Warehouse } from '@core/models/warehouse.models';
import { Shipment, ShipmentSyscom } from '@core/models/shipment.models';
import { ISupplierProd, ProductShipment, ProductShipmentCT, ProductShipmentCVA } from '@core/models/productShipment.models';
import { ErroresCT, OrderCtConfirmResponse, OrderCtResponse } from '@core/models/suppliers/orderctresponse.models';
import { ADD_ORDER_CT, CONFIRM_ORDER_CT, EXISTENCIAPRODUCTOSCT_LIST_QUERY, PRODUCTOSCT_LIST_QUERY, SHIPMENTS_CT_RATES_QUERY, STATUS_ORDER_CT } from '@graphql/operations/query/suppliers/ct';
import { ADD_ORDER_CVA, BRANDSCVA_LIST_QUERY, EXISTENCIAPRODUCTOSCVA_LIST_QUERY, GROUPSCVA_LIST_QUERY, PAQUETERIASCVA_LIST_QUERY, PRODUCTOSCVA_LIST_QUERY, SHIPMENTS_CVA_RATES_QUERY, SOLUCIONESCVA_LIST_QUERY, SUCURSALESCVA_LIST_QUERY } from '@graphql/operations/query/suppliers/cva';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { IOrderCva } from '@core/interfaces/suppliers/ordercva.interface';
import { IEnvioCt, IGuiaConnect, IProductoCt } from '@core/interfaces/suppliers/orderct.interface';
import { IOrderCvaResponse } from '@core/interfaces/suppliers/ordercvaresponse.interface';
import { Result } from '@core/models/result.models';
import { EXISTENCIAPRODUCTOSINGRAM_LIST_QUERY } from '@graphql/operations/query/suppliers/ingram';
import { EXISTENCIAPRODUCTOSSYSCOM_LIST_QUERY } from '@graphql/operations/query/suppliers/syscom';
import { IDireccionSyscom } from '@core/interfaces/suppliers/orderSyscom.interface';
import { ADD_ORDER_SYSCOM } from '@graphql/operations/mutation/suppliers/syscom';
import { FormGroup } from '@angular/forms';
import { OrderSyscom, ProductoSyscom } from '@core/models/suppliers/ordersyscom.models';

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
  async getSyscomCatalog(supplier: ISupplier, apiSelect: IApis, token: string, search: string = ''): Promise<any> {
    if (apiSelect.parameters) {
      switch (supplier.slug) {
        case 'syscom':
          let params = new HttpParams();
          // Parámetros del token
          if (supplier.token.body_parameters.length > 0) {
            supplier.token.body_parameters.forEach(param => {
              params = params.set(param.name, param.value);
            });
          }
          // Parámetros de url
          if (apiSelect.parameters.length > 0) {
            apiSelect.parameters.forEach(param => {
              params = params.set(param.name, search);
            });
          }

          return await this.http.get(
            supplier.url_base_api + apiSelect.operation,
            {
              headers: { Authorization: 'Bearer ' + token },
              params,
            }).toPromise();
          break;
        case 'ct':
          return await this.http.get(
            supplier.url_base_api + apiSelect.operation,
            {
              headers: {
                'x-auth': token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            }).toPromise();
        default:
          break;
      }
    }
  }

  async getSyscomCatalogAllBrands(supplier: ISupplier, apiSelect: IApis, token: string, catalogValues: ICatalog[]): Promise<any> {
    if (apiSelect.parameters) {
      switch (supplier.slug) {
        case 'syscom':
          const products: Product[] = [];
          const promises = [];
          catalogValues.forEach(async item => {
            let params = new HttpParams();
            // Parámetros del token
            if (supplier.token.body_parameters.length > 0) {
              supplier.token.body_parameters.forEach(param => {
                params = params.set(param.name, param.value);
              });
            }
            // Parámetros de url
            if (apiSelect.parameters.length > 0) {
              apiSelect.parameters.forEach(param => {
                params = params.set(param.name, item.slug);
              });
            }
            promises.push(
              this.http.get(
                supplier.url_base_api + apiSelect.operation,
                {
                  headers: { Authorization: 'Bearer ' + token },
                  params,
                }).toPromise()
            );
          });
          const getPromiseAll = () => {
            return Promise.all(promises)
              .then(async (responses) => {
                responses.forEach(response => {
                  response.productos.forEach(prod => {
                    products.push(prod);
                  });
                });
                return await products;
              });
          };
          return await getPromiseAll().then(async (res) => {
            return await res;
          });

        case 'ct':
          return await this.http.get(
            supplier.url_base_api + apiSelect.operation + '/' + apiSelect.suboperation,
            {
              headers: {
                'x-auth': token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            }).toPromise();
        default:
          break;
      }
    }
  }

  async getCatalogXMLAllBrands(supplier: ISupplier, apiSelect: IApis, search: string = '', catalogValues: ICatalog[]): Promise<any> {
    if (apiSelect.parameters) {
      switch (supplier.slug) {
        case 'cva':
          const products: Product[] = [];
          const promises = [];
          catalogValues.forEach(item => {
            const headers = new HttpHeaders();
            let params = new HttpParams();
            // Parámetros del token
            if (supplier.token) {
              if (supplier.token.body_parameters.length > 0) {
                supplier.token.body_parameters.forEach(param => {
                  params = params.set(param.name, param.value);
                });
              }
            }
            // Parámetros de url
            if (apiSelect.parameters) {
              apiSelect.parameters.forEach(param => {
                if (param.name === 'cliente') {
                  params = params.set(param.name, '23534');
                } else if (param.name === 'promos' || param.name === 'porcentajes') {
                  params = params.set(param.name, '1');
                } else {
                  params = params.set(param.name, item.slug.toUpperCase());
                }
              });
            }
            promises.push(
              this.http.get(
                supplier.url_base_api + apiSelect.operation,
                {
                  headers,
                  params,
                  responseType: 'text'
                })
                .pipe(map(async (xml: any) => {
                  return await this.parseXmlToJson(xml, apiSelect.operation);
                }))
                .toPromise()
            );
          });
          const getPromiseAll = () => {
            return Promise.all(promises)
              .then(async (responses) => {
                if (responses.length > 0) {
                  responses.forEach(response => {
                    if (response) {
                      if (response.length > 0) {
                        response.forEach(prod => {
                          products.push(prod);
                        });
                      } else {
                        return response;
                      }
                    }
                  });
                }
                if (products.length > 0) {
                  return await products;
                }
                return responses;
              })
              .catch(async (error) => {
                return await error;
              });
          };
          return await getPromiseAll()
            .then(async (res) => {
              return await res;
            }).catch(async (error) => {
              return await error;
            });
        default:
          break;
      }
    }
  }

  getCatalogXML(supplier: ISupplier, apiSelect: IApis, search: string = ''): Promise<any> {
    const headers = new HttpHeaders();
    let params = new HttpParams();
    // Parámetros del token
    if (supplier.token) {
      if (supplier.token.body_parameters.length > 0) {
        supplier.token.body_parameters.forEach(param => {
          params = params.set(param.name, param.value);
        });
      }
    }
    // Parámetros de url
    if (apiSelect.parameters) {
      apiSelect.parameters.forEach(param => {
        params = params.set(param.name, param.value || search);
      });
    }

    return this.http.get(
      supplier.url_base_api + apiSelect.operation,
      {
        headers,
        params,
        responseType: 'text'
      }
    ).pipe(
      map(async xml => await this.parseXmlToJson(xml, apiSelect.operation))
    ).toPromise();
  }

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

  async getCatalogSOAP(supplier: ISupplier, apiSelect: IApis, search: string = '', codigos: string = ''): Promise<any> {
    let soapBody = '';
    switch (apiSelect.operation) {
      case 'Obtener_Marcas':
        soapBody = 'Obtener_Marcas';
        break;
      case 'Obtener_Categorias':
        soapBody = 'Obtener_Productos_HuellaLogistica';
        break;
      case 'Obtener_Productos_Listado':
        soapBody = 'Obtener_Productos_Listado';
        break;
      case 'Obtener_Productos_PrecioYExistencia':
        soapBody = 'Obtener_Productos_PrecioYExistencia';
        break;
      case 'Obtener_GaleriaDeImagenes':
        soapBody = 'Obtener_GaleriaDeImagenes';
        break;
      case 'pedidos_ws_cva.php':
        soapBody = 'ListaPedidos';
        break;
      default:
        break;
    }
    let body: string;
    switch (supplier.slug) {
      case 'cva':
        body = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <${soapBody} xmlns="https://www.grupocva.com/pedidos_web/">
              <Usuario>admin73766</Usuario>
              <PWD>VCTRNZ1EFOmR</PWD>
            </${soapBody}>
          </soap:Body>
        </soap:Envelope>`;
        break;
      case 'exel':
        body = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <${soapBody} xmlns="http://ws.exel.com.mx:8181/">
              <Usuario>ws_prcom</Usuario>
              <Password>LEMD4#O</Password>
              ${codigos}
            </${soapBody}>
          </soap:Body>
        </soap:Envelope>`;
        break;
      default:
        break;
    }

    const searchParams = {
      'Content-Type': 'text/xml'
    };
    const params = {};
    if (supplier.token) {
      if (supplier.token.body_parameters.length > 0) {
        supplier.token.body_parameters.forEach(param => {
          params[param.name] = param.value;
        });
      }
    }
    // Parámetros de url
    if (apiSelect.parameters) {
      apiSelect.parameters.forEach(param => {
        params[param.name] = param.value || search;
      });
    }

    try {
      const url = supplier.url_base_api_order + apiSelect.operation + '?wsdl=ListaPedidos';

      const response = await axios.post(url, body, {
        headers: searchParams,
        params
      });
      const Content = he.decode(response.data.toString('utf-8'));
      const datos = await this.parseXmlToJson(Content, apiSelect.operation);
      return await datos;
    } catch (error) {
      throw new Error(error.message);
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
    colonia: string
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
          direccionSyscom.codigo_postal = parseInt(warehouse.cp);
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
          orderSyscomInput.uso_cfdi = 'G03';
          orderSyscomInput.tipo_pago = 'pue';
          orderSyscomInput.orden_compra = 'DARU-1002';
          orderSyscomInput.ordenar = false;
          orderSyscomInput.iva_frontera = false;
          orderSyscomInput.forzar = false;
          orderSyscomInput.testmode = true;
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

  async onShippingEstimateX(
    supplier: ISupplier,
    apiSelect: IApis,
    warehouse: Warehouse,
    tokenJson: boolean
  ): Promise<any> {
    let token: string;
    const shipments: Shipment[] = [];
    if (!supplier.token) {                                                                // Si la API no requiere token
      switch (supplier.slug) {
        case 'exel':
          return await [];
        case 'cva':
          token = '7ee694a5bae5098487a5a8b9d8392666';
          break;
        default:
          return await [];
      }
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
  }
  //#endregion

  //#region Pedidos
  async getPedidosSOAP(supplier: ISupplier, apiSelect: IApis, search: string = '', order: any): Promise<any> {
    let soapBody = '';
    let soapDetail = '';
    let soapProducts = '';
    switch (apiSelect.return) {
      case 'order':
        order.productos.forEach(product => {
          soapProducts += `&lt;productos&gt;
          &lt;producto&gt;
            &lt;clave&gt;${product.clave}&lt;/clave&gt;
            &lt;cantidad&gt;${product.cantidad}&lt;/cantidad&gt;
        &lt;/producto&gt;
        &lt;/productos&gt;`;
        });
        soapDetail = `<XMLOC xsi:type="xsd:string">
        &lt;PEDIDO&gt;
        &lt;NumOC&gt;${order.NumOC}&lt;/NumOC&gt;
        &lt;Paqueteria&gt;${order.Paqueteria}&lt;/Paqueteria&gt;
        &lt;CodigoSucursal&gt;${order.CodigoSucursal}&lt;/CodigoSucursal&gt;
        &lt;PedidoBO&gt;${order.PedidoBO}&lt;/PedidoBO&gt;
        &lt;Observaciones&gt;${order.Observaciones}&lt;/Observaciones&gt;
        ${soapProducts}
        &lt;TipoFlete&gt;${order.TipoFlete}&lt;/TipoFlete&gt;
        &lt;Calle&gt;${order.Calle}&lt;/Calle&gt;
        &lt;Numero&gt;${order.Numero}&lt;/Numero&gt;
        &lt;NumeroInt&gt;${order.NumeroInt}&lt;/NumeroInt&gt;
        &lt;CP&gt;${order.CP}&lt;/CP&gt;
        &lt;Colonia&gt;${order.Colonia}&lt;/Colonia&gt;
        &lt;Estado&gt;${order.Estado}&lt;/Estado&gt;
        &lt;Ciudad&gt;${order.Ciudad}&lt;/Ciudad&gt;
        &lt;Atencion&gt;${order.Atencion}&lt;/Atencion&gt;
        &lt;/PEDIDO&gt;
    </XMLOC>`;
        soapBody = 'PedidoWeb';
        break;
      default:
        break;
    }
    let body: string;
    switch (supplier.slug) {
      case 'cva':
        body = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <${soapBody} xmlns="urn:PedidoWebwsdl#PedidoWeb">
              <Usuario>admin73766</Usuario>
              <PWD>VCTRNZ1EFOmR</PWD>
              ${soapDetail}
            </${soapBody}>
          </soap:Body>
        </soap:Envelope>`;
        break;
    }
    const searchParams = {
      'Content-Type': 'text/xml'
    };
    const params = {};
    if (supplier.token) {
      if (supplier.token.body_parameters.length > 0) {
        supplier.token.body_parameters.forEach(param => {
          params[param.name] = param.value;
        });
      }
    }
    // Parámetros de url
    if (apiSelect.parameters) {
      apiSelect.parameters.forEach(param => {
        params[param.name] = param.value || search;
      });
    }

    try {
      const url = supplier.url_base_api_order + apiSelect.operation + '?wsdl=PedidoWeb';
      const response = await axios.post(url, body, {
        headers: searchParams,
        params
      });
      const Content = he.decode(response.data.toString('utf-8'));
      const datos = await this.parseXmlToJson(Content, apiSelect.operation);
      return await datos;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getPedidosAPI(supplier: ISupplier, apiSelect: IApis, order: any): Promise<any> {
    let token = '';
    switch (supplier.slug) {
      case 'ct':
        return await this.getToken(supplier, false)
          .then(
            async result => {
              switch (supplier.slug) {
                case 'ct':
                  token = result.token;
                  break;
                case 'syscom':
                  token = result.access_token;
                  break;
                default:
                  break;
              }
              if (token) {
                const url = supplier.url_base_api + apiSelect.operation + '/' + apiSelect.suboperation;
                try {
                  const response = await this.http.post(
                    url,
                    order,
                    {
                      headers: {
                        'x-auth': token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                      }
                    }).toPromise();
                  return await response;
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
              } else {
                return await null;
              }
            },
            async error => {
              return await null;
            }
          );
      default:
        break;
    }
    return await [];
  }
  //#endregion Pedidos

  //#region Confirmacion
  async getConfirmacionAPI(supplier: ISupplier, apiSelect: IApis, confirm: any): Promise<any> {
    let token = '';
    switch (supplier.slug) {
      case 'ct':
        return await this.getToken(supplier, false)
          .then(
            async result => {
              switch (supplier.slug) {
                case 'ct':
                  token = result.token;
                  break;
                case 'syscom':
                  token = result.access_token;
                  break;
                default:
                  break;
              }
              if (token) {
                const url = supplier.url_base_api + apiSelect.operation + '/' + apiSelect.suboperation;
                try {
                  const response = await this.http.post(
                    url,
                    confirm,
                    {
                      headers: {
                        'x-auth': token,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                      }
                    }).toPromise();
                  return await response;
                } catch (error) {
                  const ctConfirmResponse: OrderCtConfirmResponse = new OrderCtConfirmResponse();
                  ctConfirmResponse.okCode = error.error.errorCode;
                  ctConfirmResponse.okMessage = error.error.errorMessage;
                  ctConfirmResponse.okReference = error.error.errorReference;
                  return await ctConfirmResponse;
                }
              } else {
                return await null;
              }
            },
            async error => {
              return await null;
            }
          );
      default:
        break;
    }
    return await [];
  }
  //#endregion Confirmacion

  //#region Catalogos Externos por json
  // async getSucursalesCva(): Promise<any> {
  //   const productsCt = await this.getSucursalesCvaJson()
  //     .then(async (result) => {
  //       return await result;

  //     })
  //     .catch(async (error: Error) => {
  //       return await [];
  //     });
  //   return productsCt;
  // }

  // async getPaqueteriasCva(): Promise<any> {
  //   const productsCt = await this.getPaqueteriasCvaJson()
  //     .then(async (result) => {
  //       return await result;
  //     })
  //     .catch(async (error: Error) => {
  //       return await [];
  //     });
  //   return productsCt;
  // }

  async getCiudadesCva(): Promise<any> {
    const productsCt = await this.getCiudadesCvaJson()
      .then(async (result) => {
        return await result;
      })
      .catch(async (error: Error) => {
        return await [];
      });
    return productsCt;
  }
  // async getSucursalesCvaJson(): Promise<any> {
  //   return await this.hRCvaSucursales$.toPromise();
  // }
  // async getPaqueteriasCvaJson(): Promise<any> {
  //   return await this.hRCvaPaqueterias$.toPromise();
  // }
  async getCiudadesCvaJson(): Promise<any> {
    return await this.hRCvaCiudades$.toPromise();
  }
  //#endregion

  //#region CVA
  async getBrandsCva(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(BRANDSCVA_LIST_QUERY, {}, {}).subscribe(
        (result: any) => {
          resolve(result.listBrandsCva);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async getGroupsCva(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(GROUPSCVA_LIST_QUERY, {}, {}).subscribe(
        (result: any) => {
          resolve(result.listGroupsCva);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async getSolucionesCva(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(SOLUCIONESCVA_LIST_QUERY, {}, {}).subscribe(
        (result: any) => {
          resolve(result.listSolucionesCva);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async getSucursalesCva(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(SUCURSALESCVA_LIST_QUERY, {}, {}).subscribe(
        (result: any) => {
          resolve(result.listSucursalesCva);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async getPaqueteriasCva(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(PAQUETERIASCVA_LIST_QUERY, {}, {}).subscribe(
        (result: any) => {
          resolve(result.listPaqueteriasCva);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

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

  async getProductsCva(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(PRODUCTOSCVA_LIST_QUERY, {}, {}).subscribe(
        (result: any) => {
          resolve(result.listProductsCva);
        },
        (error: any) => {
          reject(error);
        });
    });
  }

  async setOrderCva(pedidoCva: IOrderCva): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ADD_ORDER_CVA, { pedidoCva }, {}).subscribe(
        (result: any) => {
          if (result.orderCva.estado === 'ERROR') {
            const orderCva: IOrderCvaResponse = {
              error: result.OrderCva.error,
              estado: result.OrderCva.estado,
              pedido: '',
              total: '',
              agentemail: '',
              almacenmail: ''
            };
            resolve(orderCva);
          }
          resolve(result);
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

  async getProductsCt(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(PRODUCTOSCT_LIST_QUERY, {}, {}).subscribe(
        (result: any) => {
          resolve(result.stockProductsCt);
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

  async setOrderCt(
    idPedido: number,
    almacen: string,
    tipoPago: string,
    guiaConnect: IGuiaConnect,
    envio: IEnvioCt,
    productoCt: IProductoCt,
    cfdi: string
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.get(ADD_ORDER_CT, {
        idPedido,
        almacen,
        tipoPago,
        guiaConnect,
        envio,
        productoCt,
        cfdi
      }, {}).subscribe(
        (result: any) => {
          resolve(result.orderCt);
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
          resolve(result.existenciaProductoIngram);
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

}
