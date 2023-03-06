import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApis, IObtenerMarcasResult, ISupplier } from '@core/interfaces/supplier.interface';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

declare const require;
const xml2js = require('xml2js');
// const soapRequest = require('easy-soap-request');

@Injectable({
  providedIn: 'root'
})
export class ExternalAuthService {

  constructor(
    public http: HttpClient
  ) {
  }

  getSyscomToken(supplier: ISupplier, apiSelect: IApis): Observable<any> {
    // application/x-www-form-urlencoded
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

    let params = new HttpParams();
    if (supplier.token.body_parameters.length > 0) {
      supplier.token.body_parameters.forEach(param => {
        params = params.set(param.name, param.value);
      });
    }

    const options = { headers };

    return this.http.post(supplier.token.url_base_token, params, options);
  }

  getSyscomCatalog(supplier: ISupplier, apiSelect: IApis, token: string, search: string = ''): Observable<any> {
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

          return this.http.get(
            supplier.url_base_api + apiSelect.operation,
            {
              headers: { Authorization: 'Bearer ' + token },
              params,
            });
          break;
        case 'ct':
          return this.http.get(
            supplier.url_base_api + apiSelect.operation,
            {
              headers: {
                'x-auth': token,
                Accept: 'application/json',
                'Content-type': 'application/json'
              }
            });
        default:
          break;
      }
    }
  }

  getCatalogXML(supplier: ISupplier, apiSelect: IApis, search: string = ''): Observable<any> {
    if (supplier) {
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
        switchMap(async xml => await this.parseXmlToJson(xml, apiSelect.operation))
      );
    }
  }

  async parseXmlToJson(xml, catalog) {
    console.log('xml: ', xml);
    console.log('catalog: ', catalog);
    switch (catalog) {
      case 'marcas2.xml':
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response.marcas.marca);
      case 'grupos.xml':
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response.grupos.grupo);
      case 'grupos2.xml':
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response.grupos.grupo);
      case 'soluciones.xml':
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response.soluciones.solucion);
      case 'Obtener_Marcas':
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response.Obtener_MarcasResponse.Obtener_MarcasResult);
      case 'Obtener_Categorias':
        return await xml2js
          .parseStringPromise(xml, { explicitArray: false })
          .then(response => response.Obtener_Productos_HuellaLogisticaResponse.Obtener_Productos_HuellaLogisticaResult);
      default:
        break;
    }
  }
  getCatalogSOAP(supplier: ISupplier, apiSelect: IApis, search: string = ''): Observable<IObtenerMarcasResult> {
    if (supplier) {
      const body = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <Obtener_Marcas xmlns="http://ws.exel.com.mx:8181/">
              <Usuario>ws_prcom</Usuario>
              <Password>LEMD4#O</Password>
            </Obtener_Marcas>
          </soap:Body>
        </soap:Envelope>`;

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'text/xml; charset=utf-8');

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

      const repons = new Object({ responseType: 'text' });
      const options = { headers, params, repons };
      const result = this.http.post<any>(supplier.url_base_api, body, options)
        .pipe(
          switchMap(async xml => await this.parseXmlToJson(xml, apiSelect.operation))
        );
      console.log('result/services: ', result);

      return (result);

    }
  }

  getCatalogSOAP0(supplier: ISupplier, apiSelect: IApis, search: string = ''): Observable<IObtenerMarcasResult[]> {
    if (supplier) {
      const body = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <Obtener_Marcas xmlns="http://ws.exel.com.mx:8181/">
              <Usuario>ws_prcom</Usuario>
              <Password>LEMD4#O</Password>
            </Obtener_Marcas>
          </soap:Body>
        </soap:Envelope>`;

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'text/xml; charset=utf-8');
      headers = headers.set('user-agent', 'Obtener_Productos_HuellaLogisticaResponse');
      headers = headers.set('soapAction', '');
      // headers = headers.set('SOAPAction', 'Obtener_MarcasResult');

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

      const repons = new Object({ responseType: 'text' as 'text' });
      const options = { headers, params, repons };
      const result = this.http.post<any>(supplier.url_base_api, body, options)
      .pipe(
        switchMap(async xml => await this.parseXmlToJson(xml, apiSelect.operation))
      );;
      console.log('result/services: ', result);

      return (result);

      // const { response } = soapRequest({ url: supplier.url_base_api, headers: headers, xml: body, timeout: 1000 }); // Optional timeout parameter(milliseconds)
      // const { headers1, body1, statusCode } = response;
      // console.log(headers1);
      // console.log(body1);
      // console.log(statusCode);

      // return body1;

    }
  }



  getCatalogSOAP1(supplier: ISupplier, apiSelect: IApis, search: string = ''): Observable<any> {
    if (supplier) {
      const body = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <Obtener_Marcas xmlns="http://ws.exel.com.mx:8181/">
              <Usuario>ws_prcom</Usuario>
              <Password>LEMD4#O</Password>
            </Obtener_Marcas>
          </soap:Body>
        </soap:Envelope>`;

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'text/xml; charset=utf-8');

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

      const repons = new Object({ responseType: 'text' });
      const options = { headers, params, repons };
      const result = this.http.post<any>(supplier.url_base_api, body, options)
        .pipe(
          switchMap(async xml => await this.parseXmlToJson(xml, apiSelect.operation))
        );
      console.log('result/services: ', result);

      return (result);

    }
  }


  getCatalogSOAP2(supplier: ISupplier, apiSelect: IApis, search: string = ''): Observable<any> {
    if (supplier) {
      const body = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <Obtener_Marcas xmlns="http://ws.exel.com.mx:8181/">
            <Usuario>ws_prcom</Usuario>
            <Password>LEMD4#O</Password>
          </Obtener_Marcas>
        </soap:Body>
      </soap:Envelope>`;

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'text/xml; charset=utf-8');

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

      const repons = new Object({ responseType: 'document' });
      const options = { headers, params, repons };

      const result = this.http.post<any>(supplier.url_base_api, body, options)
        .pipe(
          switchMap(async xml => await this.parseXmlToJson(xml, apiSelect.operation))
        );
      console.log('result/services: ', result);

      return (result);

    }
  }
}
