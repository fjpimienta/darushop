import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICatalog } from '@core/interfaces/catalog.interface';
import { ILoginCTForm, ILoginSyscomForm } from '@core/interfaces/extern-login.interface';
import { IApis, ISupplier } from '@core/interfaces/supplier.interface';
import { Product } from '@core/models/product.models';
import { map } from 'rxjs/operators';
import axios, { isCancel, AxiosError } from 'axios';
import { Warehouse } from '@core/models/warehouse.models';
import { Shipment } from '@core/models/shipment.models';

declare const require;
const xml2js = require('xml2js');

@Injectable({
  providedIn: 'root'
})
export class ExternalAuthService {
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
    public http: HttpClient
  ) {
  }

  //#region Token
  async getToken(
    supplier: ISupplier,
    tokenJson: boolean = false
  ): Promise<any> {
    let headers = new HttpHeaders();
    let params = new HttpParams();
    switch (supplier.slug) {
      case 'ct':
        const contentType = tokenJson ? 'application/json' : 'application/x-www-form-urlencoded';
        headers = new HttpHeaders({
          'Content-Type': contentType
        });
        if (supplier.token.body_parameters.length > 0) {
          supplier.token.body_parameters.forEach(param => {
            params = params.set(param.name, param.value);
          });
        }
        return await this.http.post(supplier.token.url_base_token, params, { headers }).toPromise();
      case 'cva':
        const tokenBearer = '7ee694a5bae5098487a5a8b9d8392666';
        return tokenBearer;
      case '99minutos':
        const options = {
          method: 'POST',
          headers: { accept: 'application/json', 'content-type': 'application/json' },
          body: JSON.stringify({
            client_id: '18b99050-5cb7-4e67-928d-3f16d109b8c5',
            client_secret: 'gdKeiQVGBxRAY~ICpdnJ_7aKEd'
          })
        };
        return fetch('99minutos/api/v3/oauth/token', options)
          .then(response => response.json())
          .then(async response => {
            return await response;
          })
          .catch(err => console.error(err));
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
                'Content-type': 'application/json'
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
                'Content-type': 'application/json'
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
      case 'pedidos_ws_cva.php':                                                                  // SOAP CVA
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          // tslint:disable-next-line: no-string-literal
          .then(response => response['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:ListaPedidosResponse']['pedidos'])
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
              <PWD>nga4iCEDFswN</PWD>
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

    const searchParams = new axios.AxiosHeaders();
    const params = new axios.AxiosHeaders();
    searchParams.set('Content-Type', 'text/xml');
    if (supplier.token) {
      if (supplier.token.body_parameters.length > 0) {
        supplier.token.body_parameters.forEach(param => {
          params.set(param.name, param.value);
        });
      }
    }
    // Parámetros de url
    if (apiSelect.parameters) {
      apiSelect.parameters.forEach(param => {
        // params = params.set(param.name, param.value || search);
        params.set(param.name + '=' + param.value || search);
      });
    }

    return await new Promise((resolve, reject) => {
      const url = supplier.url_base_api_order + apiSelect.operation + '?wsdl=ListaPedidos';
      axios.post(url,
        body,
        {
          headers: searchParams,
          params
        }).then(async response => {
          const datos = await this.parseXmlToJson(response.data, apiSelect.operation);
          resolve(datos);
        }).catch(error => {
          reject(new Error(error.message));
        });
    });
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
          const fromObjectCT = {
            destino: warehouse.cp.padStart(5, '0'),
            productos: warehouse.productShipments
          };
          return await this.http.post(urlCT, JSON.stringify(fromObjectCT), { headers: headersCT }).toPromise();
        case 'cva':
          const urlCVA = supplier.url_base_api_shipments + apiSelect.operation;
          // const headersCVA = new HttpHeaders({
          //   authorization: 'Bearer ' + token,
          //   'Content-Type': 'application/json'
          // });
          // const fromObjectCVA = {
          //   paqueteria: 4,
          //   cp: warehouse.cp.padStart(5, '0'),
          //   colonia: 'Gil y Saenz',
          //   cp_sucursal: 44900,
          //   productos: warehouse.productShipments
          // };
          // return await this.http.post(urlCVA, JSON.stringify(fromObjectCVA), { headers: headersCVA }).toPromise();
          // Idem Exel
          const searchParams = new axios.AxiosHeaders();
          const params = new axios.AxiosHeaders();
          searchParams.set('Content-Type', 'text/xml');
          searchParams.set('Access-Control-Allow-Origin', '*');
          searchParams.set('Access-Control-Allow-Methods', '*');
          searchParams.set('authorization', 'Bearer ' + token);
          searchParams.set('Content-Type', 'application/json');
          const fromObjectCVA = {
            paqueteria: 4,
            cp: warehouse.cp.padStart(5, '0'),
            colonia: 'Gil y Saenz',
            cp_sucursal: 44900,
            productos: warehouse.productShipments
          };
          return new Promise((resolve, reject) => {
            axios.post(urlCVA,
              fromObjectCVA,
              {
                headers: searchParams,
                params
              }).then(async response => {
                // const datos = await this.parseXmlToJson(response.data, apiSelect.operation);
                const datos = response;
                console.log('response: ', response);
                resolve(datos);
              }).catch(error => {
                reject(new Error(error.message));
              });
          });
        case '99minutos':
          const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              authorization: 'Bearer ' + token
            },
            body: JSON.stringify({ country: 'MEX', deliveryType: 'NXD', size: 'xl' })
          };
          return fetch('99minutos/api/v3/pricing', options)
            .then(response => response.json())
            .then(async response => {
              return await response;
            })
            .catch(err => console.error(err));
        default:
          break;
      }
    }
  }

  async onShippingEstimate(
    supplier: ISupplier,
    apiSelect: IApis,
    warehouse: Warehouse,
    tokenJson: boolean
  ): Promise<any> {
    let token: string;
    let shipments: Shipment[] = [];
    if (!supplier.token) {
      switch (supplier.slug) {
        case 'exel':
          return await [];
        default:
          return await [];
      }
    } else {
      return await this.getToken(supplier, tokenJson)
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
                // tslint:disable-next-line: no-shadowed-variable
                .then(async result => {
                  try {
                    switch (supplier.slug) {
                      case 'ct':
                        if (result.codigo === '2000' && result.respuesta.cotizaciones.length > 0) {
                          shipments = result.respuesta.cotizaciones;
                          return shipments;
                        } else {
                          // TODO Enviar Costos Internos.
                          return await [];
                        }
                      case 'cva':
                        console.log('result: ', result);
                        return await [];
                      case 'syscom':
                        return await [];
                      case '99minutos':
                        const shipment = new Shipment();
                        shipment.empresa = supplier.slug;
                        shipment.costo = result.data.price;
                        shipment.metodoShipping = '';
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
  getPedidosSOAP(supplier: ISupplier, apiSelect: IApis, search: string = '', codigos: string = ''): Promise<any> {
    let soapBody = '';
    switch (apiSelect.operation) {
      case 'ListaPedidos':
        soapBody = 'ListaPedidos';
        break;
      case 'ConsultaPedido':
        soapBody = 'ConsultaPedido';
        break;
      case 'PedidoWeb':
        soapBody = 'PedidoWeb';
        break;
      default:
        break;
    }
    const body = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <${soapBody} xmlns="https://www.grupocva.com/pedidos_web/">
              <Usuario>admin73766</Usuario>
              <PWD>nga4iCEDFswN</PWD>
            </${soapBody}>
          </soap:Body>
        </soap:Envelope>`;
    const searchParams = new axios.AxiosHeaders();
    const params = new axios.AxiosHeaders();
    searchParams.set('Content-Type', 'text/xml');
    if (supplier.token) {
      if (supplier.token.body_parameters.length > 0) {
        supplier.token.body_parameters.forEach(param => {
          params.set(param.name, param.value);
        });
      }
    }
    // Parámetros de url
    if (apiSelect.parameters) {
      apiSelect.parameters.forEach(param => {
        // params = params.set(param.name, param.value || search);
        params.set(param.name + '=' + param.value || search);
      });
    }
    return new Promise((resolve, reject) => {
      axios.post(supplier.url_base_api,
        body,
        {
          headers: searchParams,
          params
        }).then(async response => {
          console.log('getPedidosSOAP/response: ', response);
          const datos = await this.parseXmlToJson(response.data, apiSelect.operation);
          resolve(datos);
        }).catch(error => {
          reject(new Error(error.message));
        });
    });
  }
  //#endregion Pedidos

  //#region Facturacion

  //#endregion Facturacion
}
