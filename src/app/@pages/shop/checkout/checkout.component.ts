import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '@core/services/cart.service';
import { CountrysService } from '@core/services/countrys.service';
import { CodigopostalsService } from '@core/services/codigopostals.service';
import { Codigopostal } from '@core/models/codigopostal.models';
import { Country, Estado, Municipio } from '@core/models/country.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@core/services/auth.service';
import { IMeData } from '@core/interfaces/session.interface';
import { environment } from 'src/environments/environment';
import { StripePaymentService } from '@mugan86/stripe-payment-form';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { first } from 'rxjs/operators';
import { CURRENCIES_SYMBOL, CURRENCY_LIST } from '@mugan86/ng-shop-ui';
import { CURRENCY_CODE } from '@core/constants/config';
import { infoEventAlert, loadData } from '@shared/alert/alerts';
import { CustomersService } from '@core/services/stripe/customers.service';
import { Router } from '@angular/router';
import { ICustomer, IResultStripeCustomer } from '@core/interfaces/stripe/customer.interface';
import { ChargeService } from '@core/services/stripe/charge.service';
import { IPayment } from '@core/interfaces/stripe/payment.interface';
import { IMail } from '@core/interfaces/mail.interface';
import { MailService } from '@core/services/mail.service';
import { ICharge } from '@core/interfaces/stripe/charge.interface';
import { UsersService } from '@core/services/users.service';
import { AddressInput, UserInput } from '@core/models/user.models';
import { OrderInput } from '@core/models/order.models';
import { CartItem } from '@shared/classes/cart-item';
import { Warehouse } from '@core/models/warehouse.models';
import { Delivery } from '@core/models/delivery.models';
import { SupplierProd } from '@core/models/product.models';
import { ExternalAuthService } from '@core/services/external-auth.service';
import { SuppliersService } from '@core/services/suppliers/supplier.service';
import { ISupplier } from '@core/interfaces/supplier.interface';
import { ProductShipment } from '@core/models/productShipment.models';
import { Shipment } from '@core/models/shipment.models';
import { ShippingsService } from '@core/services/shipping.service';
import { IShipping } from '@core/interfaces/shipping.interface';
import { FF, PAY_DEPOSIT, PAY_FREE, PAY_MERCADO_PAGO, PAY_OPENPAY, PAY_PAYPAL, PAY_PAYU, PAY_STRIPE, PAY_TRANSFER } from '@core/constants/constants';
import { EnvioCt, OrderCt, ProductoCt } from '@core/models/suppliers/orderct.models';
import { EnvioCVA, OrderCva, ProductoCva } from '@core/models/suppliers/ordercva.models';
import { Apis, Supplier } from '@core/models/suppliers/supplier';
import { OrderCvaResponse } from '@core/models/suppliers/ordercvaresponse.models';
import { OrderCtResponse } from '@core/models/suppliers/orderctresponse.models';
import { HttpClient } from '@angular/common/http';


declare var $: any;

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy {

  formData: FormGroup;
  cartItems: CartItem[] = [];
  countrys: Country[];
  selectCountry: Country;
  estados: Estado[];
  selectEstado: Estado;
  municipios: Municipio[];
  selectMunicipio: Municipio;
  colonias: string[];
  selectColonia: string;
  cps: Codigopostal[];
  selectCp: Codigopostal;
  byCodigopostal: boolean;
  crearcuenta: boolean;
  habilitacrearcuenta: boolean;
  codigoPostal: string;
  referencias: string;
  codigosPostales: string[];
  existeMetodoPago: boolean;
  existePaqueteria: boolean;
  stripeCustomer: string;
  errorSaveUser: boolean;
  delivery: Delivery;
  deliverys: Delivery[];
  suppliers: [ISupplier];
  shippings: [IShipping];

  session: IMeData = {
    status: false
  };
  access = false;
  sistema = false;
  role: string;
  userName = '';
  moneda = 'MXN';

  key = environment.stripePublicKey;
  token: string;
  totalPagar: string;
  resultCustomer: IResultStripeCustomer;

  myCurrency = CURRENCIES_SYMBOL[CURRENCY_LIST.MEXICAN_PESO];

  private subscr: Subscription;

  register: UserInput = new UserInput();

  shipments: Shipment[] = [];
  warehouse: Warehouse = new Warehouse();
  warehouses: Warehouse[] = [];
  typePay: string;
  PAY_STRIPE: string = PAY_STRIPE;
  PAY_OPENPAY: string = PAY_OPENPAY;
  PAY_TRANSFER: string = PAY_TRANSFER;
  PAY_DEPOSIT: string = PAY_DEPOSIT;
  PAY_PAYPAL: string = PAY_PAYPAL;
  PAY_MERCADO_PAGO: string = PAY_MERCADO_PAGO;
  PAY_PAYU: string = PAY_PAYU;
  PAY_FREE: string = PAY_FREE;

  sucursalesCVA = [];
  paqueteriasCVA = [];
  ciudadesCVA = [];

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    public cartService: CartService,
    public countrysService: CountrysService,
    public codigopostalsService: CodigopostalsService,
    public authService: AuthenticationService,
    public suppliersService: SuppliersService,
    private stripePaymentService: StripePaymentService,
    private customersService: CustomersService,
    private chargeService: ChargeService,
    private mailService: MailService,
    public userService: UsersService,
    private externalAuthService: ExternalAuthService,
    public shippingsService: ShippingsService,
  ) {
    this.stripeCustomer = '';
    this.errorSaveUser = false;
    this.countrysService.getCountrys().subscribe(result => {
      this.countrys = result.countrys;
    });
    this.cartService.priceTotal.subscribe(total => {
      this.totalPagar = total.toFixed(2).toString();
    });
    // Observable para obtener el token
    this.stripePaymentService.cardTokenVar$.pipe(first()).subscribe((token: string) => {
      if (token.indexOf('tok_') > -1) {
        loadData('Realizando el pago', 'Esperar el procesamiento de pago.');
        // Enviar los datos.
        this.token = token;
        // Buscar el usuario por el correo en el stripe
        const newCustomer = this.customersService.getCustomerByEmail(this.formData.controls.email.value).subscribe(result => {
          if (result.customerByEmail.status === false) {           // Si el gmail ya se encuentra en stripe.
            this.stripeCustomer = result.customerByEmail.customer.id;
          } else {
            let stripeName = '';
            let email = '';
            if (this.session.user) {
              email = this.session.user.email;
              stripeName = `${this.session.user.name} ${this.session.user.lastname}`;
            } else {
              email = this.formData.controls.email.value;
              stripeName = `${this.formData.controls.name.value} ${this.formData.controls.lastname.value}`;
            }
            this.customersService.add(
              stripeName,
              email
            ).pipe(first())
              // tslint:disable-next-line: no-shadowed-variable
              .subscribe((result: { status: boolean, message: string, customer: ICustomer }) => {
                if (result.status) {
                  this.stripeCustomer = result.customer.id;
                  if (this.session.user) {
                    this.session.user.stripeCustomer = result.customer.id;
                  }
                } else {
                  infoEventAlert(result.message, '', TYPE_ALERT.WARNING);
                  this.router.navigate(['/shop/cart']);
                  this.errorSaveUser = true;
                }
              });
          }
        });

        setTimeout(() => {
          // Descripción del pedido (función en el carrito)
          if (!this.errorSaveUser) {
            // Total a Pagar
            this.cartService.priceTotal.subscribe(total => {
              this.totalPagar = total.toString();
            });

            // Almacenar información para guardar.
            const payment: IPayment = {
              token,
              amount: this.totalPagar,
              description: this.cartService.orderDescription(),
              customer: this.stripeCustomer,
              currency: CURRENCY_CODE
            };
            const order: OrderInput = {
              id: '',
              user: this.onSetUser(this.formData, this.stripeCustomer),
              cartitems: this.cartItems
            };
            // Enviar la información y procesar el pago.
            this.chargeService.pay(payment, order).pipe(first())
              .subscribe(async (result: {
                status: boolean,
                message: string,
                charge: ICharge
              }) => {
                if (result.status) {
                  this.sendEmail(result.charge, '', '');
                  this.cartService.clearCart(false);
                  // Elaborar Pedido Proveedor
                  const OrderSupplier = await this.sendOrderSupplier();
                  // Enviar correo electronico
                  await infoEventAlert('El Pedido se ha realizado correctamente', '', TYPE_ALERT.SUCCESS);
                  this.router.navigate(['/shop/dashboard']);
                } else {
                  await infoEventAlert('El Pedido no se ha realizado', result.message, TYPE_ALERT.WARNING);
                  this.router.navigate(['/shop/cart']);
                }
              });
          } else {
            this.router.navigate(['/shop/cart']);
          }
        }, 3000);
      } else {
        basicAlert(TYPE_ALERT.ERROR, 'No hay datos de la tarjeta');
      }
    });

  }

  //#region Metodos Componente
  ngOnInit(): void {
    console.clear();
    this.countrys = [];
    this.selectCountry = new Country();
    this.estados = [];
    this.selectEstado = new Estado();
    this.municipios = [];
    this.selectMunicipio = new Municipio();
    this.colonias = [];
    this.selectColonia = '';
    this.cps = [];
    this.selectCp = new Codigopostal();
    this.byCodigopostal = false;
    this.codigoPostal = '';
    this.crearcuenta = false;
    this.habilitacrearcuenta = true;
    this.referencias = '';
    this.codigosPostales = [];
    this.existeMetodoPago = false;
    this.existePaqueteria = false;

    this.authService.start();

    this.subscr = this.cartService.cartStream.subscribe(items => {
      this.cartItems = items;
    });

    document.querySelector('body').addEventListener('click', () => this.clearOpacity());

    this.formData = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      byCodigopostal: [false],
      codigoPostal: ['', Validators.required],
      selectCountry: ['', [Validators.required]],
      selectEstado: ['', [Validators.required]],
      selectMunicipio: ['', [Validators.required]],
      selectColonia: ['', Validators.required],
      directions: ['', Validators.required],
      outdoorNumber: ['', Validators.required],
      interiorNumber: [''],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      crearcuenta: [false],
      references: [''],
      existeMetodoPago: [false],
      existePaqueteria: [false]
    });

    // Obtiene los datos de la sesión
    this.authService.accessVar$.subscribe((result) => {
      this.session = result;
      this.access = this.session.status;
      this.role = this.session.user?.role;
      this.userName = `${this.session.user?.name} ${this.session.user?.lastname}`;
      // Si es usario DARU (administrador o vendedor) para acceso al sistema
      this.sistema = (this.role === 'ADMIN' || 'SELLER') ? true : false;
      this.habilitacrearcuenta = true;
      if (this.session) {
        this.habilitacrearcuenta = false;
        this.formData.controls.name.setValue(this.session.user?.name);
        this.formData.controls.lastname.setValue(this.session.user?.lastname);
        this.formData.controls.phone.setValue(this.session.user?.phone);
        this.formData.controls.email.setValue(this.session.user?.email);
        if (this.session.user?.addresses.length > 0) {
          this.countrysService.countrys$
            // tslint:disable-next-line: no-shadowed-variable
            .subscribe((result) => {
              this.countrys = result;
              this.session.user?.addresses.forEach(direction => {
                if (direction.dir_delivery_main === true) {
                  this.formData.controls.codigoPostal.setValue(direction.d_codigo);
                  this.formData.controls.selectColonia.setValue(direction.d_asenta);
                  this.formData.controls.directions.setValue(direction.directions);
                  this.formData.controls.outdoorNumber.setValue(direction.outdoorNumber);
                  this.formData.controls.interiorNumber.setValue(direction.interiorNumber);
                  this.formData.controls.references.setValue(direction.references);
                  if (this.countrys.length > 0) {
                    this.countrys.forEach(country => {
                      if (country.c_pais === direction.c_pais) {
                        this.estados = country.estados;
                        this.formData.controls.selectCountry.setValue(direction.c_pais);
                        this.selectCountry.c_pais = direction.c_pais;
                        this.selectCountry.d_pais = direction.d_pais;
                        country.estados.forEach(estado => {
                          if (estado.c_estado === direction.c_estado) {
                            this.municipios = estado.municipios;
                            this.formData.controls.selectEstado.setValue(direction.c_estado);
                            this.selectEstado.c_estado = direction.c_estado;
                            this.selectEstado.d_estado = direction.d_estado;
                            estado.municipios.forEach(municipio => {
                              if (municipio.c_mnpio === direction.c_mnpio) {
                                this.formData.controls.selectMunicipio.setValue(direction.c_mnpio);
                                this.selectMunicipio.c_mnpio = direction.c_mnpio;
                                this.selectMunicipio.D_mnpio = direction.d_mnpio;
                              }
                            });
                          }
                        });
                      }
                    });
                    // Agregar las colonias del CP
                    this.colonias = [];
                    this.cps.forEach(codigo => {
                      if (codigo.d_asenta) {
                        this.colonias.push(codigo.d_asenta);
                      }
                    });
                  }
                }
              });
            });
        }
      }
    });

  }

  async notAvailableProducts(withMessage: boolean = true): Promise<void> {
    if (withMessage) {
      await infoEventAlert(
        'Accion no disponible',
        'No puedes realizar el pago sin productos en el carritto de compras'
      );
    }
    this.router.navigate(['/']);
  }

  async onSubmit(): Promise<any> {
    if (this.formData.valid) {
      // Enviar par obtener token de la tarjeta, para hacer uso de ese valor para el proceso del pago
      if (this.existeMetodoPago && this.existePaqueteria) {
        switch (this.typePay) {
          case PAY_STRIPE:
            this.payStripe();
            break;
          case PAY_OPENPAY:
            break;
          case PAY_TRANSFER:
            break;
          case PAY_DEPOSIT:
            break;
          case PAY_PAYPAL:
            break;
          case PAY_MERCADO_PAGO:
            break;
          case PAY_FREE:
            const OrderSupplier = await this.sendOrderSupplier();
            const NewProperty = 'receipt_email';
            OrderSupplier[NewProperty] = 'fjpimienta@gmail.com';
            // this.sendEmail(OrderSupplier, 'Mensaje de Prueba', 'Hola Mundo');
            // this.cartService.clearCart(false);
            // await infoEventAlert('El Pedido se ha realizado correctamente', '', TYPE_ALERT.SUCCESS);
            // this.router.navigate(['/shop/dashboard']);
            break;
        }
      } else if (this.existePaqueteria) {
        return await infoEventAlert('Se requiere definir un Metodo de Pago.', '');
      } else {
        return await infoEventAlert('Se requiere definir una Paqueteria para el Env&iacute;o.', '');
      }
    } else {
      return await infoEventAlert('Verificar los campos requeridos.', '');
    }
  }

  ngOnDestroy(): void {
    this.subscr.unsubscribe();
    document.querySelector('body').removeEventListener('click', () => this.clearOpacity());
  }
  //#endregion Metodos Componentes

  //#region Metodos
  onSetUser(formData: FormGroup, stripeCustomer: string): UserInput {
    const register = new UserInput();
    register.id = '';
    if (this.session.user) {
      register.id = this.session.user.id;
    }
    register.name = formData.controls.name.value;
    register.lastname = formData.controls.lastname.value;
    register.email = formData.controls.email.value;
    register.role = 'CLIENT';
    register.stripeCustomer = stripeCustomer;
    register.phone = formData.controls.phone.value;

    const address = new AddressInput();
    if (formData.controls.name.value !== '') {
      address.c_pais = this.selectCountry.c_pais;
      address.d_pais = this.selectCountry.d_pais;
      address.c_estado = this.selectEstado.c_estado;
      address.d_estado = this.selectEstado.d_estado;
      address.c_mnpio = this.selectMunicipio.c_mnpio;
      address.d_mnpio = this.selectMunicipio.D_mnpio;
      address.d_asenta = formData.controls.selectColonia.value;
      address.directions = formData.controls.directions.value;
      address.outdoorNumber = formData.controls.outdoorNumber.value;
      address.interiorNumber = formData.controls.interiorNumber.value;
      address.phone = formData.controls.phone.value;
      address.references = formData.controls.references.value;
      address.d_codigo = formData.controls.codigoPostal.value;
    }
    register.addresses = [];
    register.addresses.push(address);
    return register;
  }

  onSetCps(event): void {
    if (event) {
      const cp = $(event.target).val();
      if (cp !== '') {
        // Recuperar pais, estado y municipio con el CP
        this.codigopostalsService.getCps(1, -1, cp).subscribe(result => {
          this.cps = result.codigopostals;
          if (this.cps.length > 0) {
            // Agregar Pais, Estados, Municipios del CP
            if (this.countrys.length > 0) {
              this.countrys.forEach(country => {
                if (country.c_pais === this.cps[0].c_pais) {
                  this.estados = country.estados;
                  this.formData.controls.selectCountry.setValue(country.c_pais);
                  this.selectCountry.c_pais = country.c_pais;
                  this.selectCountry.d_pais = country.d_pais;
                  country.estados.forEach(estado => {
                    if (estado.c_estado === this.cps[0].c_estado) {
                      this.municipios = estado.municipios;
                      this.formData.controls.selectEstado.setValue(estado.c_estado);
                      this.selectEstado.c_estado = estado.c_estado;
                      this.selectEstado.d_estado = estado.d_estado;
                      estado.municipios.forEach(municipio => {
                        if (municipio.c_mnpio === this.cps[0].c_mnpio) {
                          this.formData.controls.selectMunicipio.setValue(municipio.c_mnpio);
                          this.selectMunicipio.c_mnpio = municipio.c_mnpio;
                          this.selectMunicipio.D_mnpio = municipio.D_mnpio;
                        }
                      });
                    }
                  });
                }
              });
              // Agregar las colonias del CP
              this.colonias = [];
              this.cps.forEach(codigo => {
                if (codigo.d_asenta) {
                  this.colonias.push(codigo.d_asenta);
                }
              });
              // Cotizar con los proveedores el costo de envio de acuerdo al producto.
              this.onCotizarEnvios(cp, this.selectEstado.d_estado);
            }
          }
        });
      } else {
        infoEventAlert('No se ha especificado un código correcto.', '');
      }
    } else {

    }
  }

  async onCotizarEnvios(cpDestino: string, estadoCp: string): Promise<void> {
    // Inicializar Arreglo de Envios.
    this.sucursalesCVA = await this.externalAuthService.getSucursalesCva().then(result => {
      return result;
    });
    this.paqueteriasCVA = await this.externalAuthService.getPaqueteriasCva().then(result => {
      return result;
    });
    this.ciudadesCVA = await this.externalAuthService.getCiudadesCva().then(result => {
      return result;
    });
    const capitalCpCT = '2700';
    const capitalCpCva = '06820';
    // const capitalCpIng = '';
    this.shipments = [];
    this.warehouses = [];
    this.warehouse = new Warehouse();
    this.warehouse.shipments = [];

    // Verificar productos por proveedor.
    let i = 0;
    const suppliers = await this.suppliersService.getSuppliers()          // Recuperar la lista de Proveedores
      .then(async result => {
        return await result.suppliers;
      });
    this.suppliers = suppliers;
    const shippings = await this.shippingsService.getShippings()          // Recuperar la lista de Paqueterias
      .then(async result => {
        return await result.shippings;
      });

    if (suppliers.length > 1) {
      suppliers.forEach(async supplier => {
        const supplierProd = new SupplierProd();                          // Revisar proveedors con apis
        const warehouseEstado = new Warehouse();
        const warehouseCapital = new Warehouse();
        const productsEstado: ProductShipment[] = [];
        const productsCapital: ProductShipment[] = [];

        // Set Api para Envios
        const apiShipment = await this.suppliersService.getApiSupplier(supplier.slug, 'envios', 'paqueterias')
          .then(async result => {
            if (result.status) {
              return await result.apiSupplier;
            }
          });
        if (apiShipment) {                                                          // Si hay Api para el Proveedor.
          // Agrupar Productos Por Proveedor
          // ==> TODO
          if (supplier.slug === this.cartItems[0].suppliersProd.idProveedor) {
            this.cartItems.forEach(async cartItem => {                              // Revisar productos en el carrito
              if (cartItem.suppliersProd.idProveedor === supplier.slug) {           // Si el producto es del proveedor
                cartItem.suppliersProd.branchOffices.forEach(branchOffice => {      // Revisar productos en almacenes
                  if (estadoCp === branchOffice.estado || capitalCpCT === branchOffice.cp
                    || capitalCpCva === branchOffice.cp) {  // Almacenes estado|capital
                    if (branchOffice.cantidad >= cartItem.qty) {                    // Revisar disponibilidad
                      if (estadoCp === branchOffice.estado) {                       // Verificar Existencias en su Estado
                        const productShipment = new ProductShipment();
                        productShipment.producto = cartItem.sku;
                        productShipment.cantidad = cartItem.qty;
                        productShipment.precio = cartItem.price;
                        productShipment.moneda = cartItem.suppliersProd.moneda;
                        productShipment.almacen = branchOffice.id;
                        productsEstado.push(productShipment);
                        warehouseEstado.cp = branchOffice.cp;
                        warehouseEstado.name = branchOffice.name;
                        warehouseEstado.estado = branchOffice.estado;
                        warehouseEstado.latitud = branchOffice.latitud;
                        warehouseEstado.longitud = branchOffice.longitud;
                      }
                      if (capitalCpCT === branchOffice.cp || capitalCpCva === branchOffice.cp) { // Verificar Existencias en Capital
                        const productShipment = new ProductShipment();
                        productShipment.producto = cartItem.sku;
                        productShipment.cantidad = cartItem.qty;
                        productShipment.precio = cartItem.price;
                        productShipment.moneda = cartItem.suppliersProd.moneda;
                        productShipment.almacen = branchOffice.id;
                        productsCapital.push(productShipment);
                        warehouseCapital.cp = branchOffice.cp;
                        warehouseCapital.name = branchOffice.name;
                        warehouseCapital.estado = branchOffice.estado;
                        warehouseCapital.latitud = branchOffice.latitud;
                        warehouseCapital.longitud = branchOffice.longitud;
                      }
                    }
                  }
                });
                if (productsEstado.length === this.cartItems.length) {
                  i += 1;
                  this.warehouse = warehouseEstado;
                  this.warehouse.productShipments = productsEstado;
                } else if (productsCapital.length === this.cartItems.length) {
                  i += 1;
                  this.warehouse = warehouseCapital;
                  this.warehouse.productShipments = productsCapital;
                }
                supplierProd.idProveedor = cartItem.suppliersProd.idProveedor;
                supplierProd.codigo = cartItem.suppliersProd.codigo;
                supplierProd.price = cartItem.suppliersProd.price;
                supplierProd.moneda = cartItem.suppliersProd.moneda;
                this.warehouse.suppliersProd = supplierProd;
              }
            });
            // Cotizar envio
            this.warehouse.cp = cpDestino;
            if (productsEstado.length === this.cartItems.length) {                  // Si hay disponibilidad en estado
              this.warehouse.productShipments = productsEstado;
            } else if (productsCapital.length <= this.cartItems.length) {           // Si hay disponibilidad en capital
              this.warehouse.productShipments = productsCapital;
            }
            const shipmentsCost = await this.externalAuthService.onShippingEstimate(
              supplier, apiShipment, this.warehouse, false)
              .then(async (resultShip) => {
                const shipments: Shipment[] = [];
                // tslint:disable-next-line: forin
                for (const key in resultShip) {
                  const shipment = new Shipment();
                  shipment.empresa = resultShip[key].empresa.toString().toUpperCase();
                  shipment.costo = resultShip[key].total;
                  shipment.metodoShipping = resultShip[key].metodo;
                  shipments.push(shipment);
                }
                return shipments;
              }
              );
            const shipmentsTemp: Shipment[] = [];
            shipmentsCost.forEach(ship => {
              shipmentsTemp.push(ship);
            });
            this.warehouse.shipments = shipmentsTemp;
            this.shipments = this.warehouse.shipments;

            // Cotizar con las paqueterias Externas a Proveedores
            if (this.warehouse.shipments.length <= 0) {
              const shipmentsExt = await this.shippingsService.getShippings()
                .then(async result => {
                  if (result.status && result.shippings.length > 0) {
                    result.shippings.forEach(async shipping => {
                      const apiSelectShip = shipping.apis.filter(api => api.operation === 'pricing')[0];
                      const shippingsEstimate = await this.externalAuthService.onShippingEstimate(
                        shipping, apiSelectShip, this.warehouse, false)
                        .then(
                          async (resultShipment) => {
                            const shipments: Shipment[] = [];
                            // tslint:disable-next-line: forin
                            for (const key in resultShipment) {
                              const shipment = new Shipment();
                              shipment.empresa = resultShipment[key].empresa.toUpperCase();
                              shipment.costo = resultShipment[key].costo;
                              shipment.metodoShipping = '';
                              shipments.push(shipment);
                            }
                            return await shipments;
                          }
                        );
                      shippingsEstimate.forEach(ship => {
                        this.shipments.push(ship);
                      });
                    });
                  }
                  return await this.shipments;
                });
            }
            this.warehouses.push(this.warehouse);
          }
        }
      });
    }




    // Elaborar Pedido Previo a facturacion.
  }

  changeShipping(costo: number): void {
    this.existePaqueteria = true;
    this.cartService.priceTotal.subscribe(total => {
      this.totalPagar = (total + costo).toFixed(2).toString();
    });
  }

  onHabilitaPago(payMent: string): void {
    this.typePay = payMent;
    this.existeMetodoPago = true;
  }

  onActiveCP(): void {
    this.byCodigopostal = !this.byCodigopostal;
    this.selectCountry = new Country();
    this.selectEstado = new Estado();
    this.selectMunicipio = new Municipio();
    this.formData.controls.codigoPostal.setValue('');
    this.formData.controls.selectCountry.setValue('');
    this.formData.controls.selectEstado.setValue('');
    this.formData.controls.selectMunicipio.setValue('');
  }

  clearOpacity(): void {
    const input: any = document.querySelector('#checkout-discount-input');
    if (input && input.value === '') {
      const label: any = document.querySelector('#checkout-discount-form label');
      label.removeAttribute('style');
    }
  }

  addOpacity(event: any): void {
    event.target.parentElement.querySelector('label').setAttribute('style', 'opacity: 0');
    event.stopPropagation();

  }

  formToggle(event: any): void {
    const parent: HTMLElement = event.target.closest('.custom-control');
    const submenu: HTMLElement = parent.closest('.form-group').querySelector('.shipping-info');

    if (parent.classList.contains('open')) {
      $(submenu).slideUp(300, () => {
        parent.classList.remove('open');
      });
    }
    else {
      $(submenu).slideDown(300, () => {
        parent.classList.add('open');
      });
    }

    event.preventDefault();
    event.stopPropagation();
  }
  //#endregion Metodos

  //#region Cobros
  async payStripe(): Promise<any> {
    await this.stripePaymentService.takeCardToken(true);
    return await true;
  }
  //#endregion Cobros

  //#region  Enviar Ordenes

  setOrder(supplier: ISupplier, delivery: Delivery, warehouse: Warehouse): any {
    const user = delivery.user;
    const dir = delivery.user.addresses[0];
    switch (supplier.slug) {
      case 'ct':
        const enviosCt: EnvioCt[] = [];
        const envioCt: EnvioCt = new EnvioCt();
        envioCt.nombre = user.name + ' ' + user.lastname;
        envioCt.direccion = dir.directions;
        envioCt.entreCalles = dir.references;
        envioCt.colonia = dir.d_asenta;
        envioCt.estado = dir.d_estado;
        envioCt.ciudad = dir.d_mnpio;
        envioCt.noExterior = dir.outdoorNumber;
        envioCt.noInterior = dir.interiorNumber;
        envioCt.codigoPostal = parseInt(dir.d_codigo, 10);
        envioCt.telefono = dir.phone;
        enviosCt.push(envioCt);
        const ProductosCt: ProductoCt[] = [];
        warehouse.productShipments.forEach(prod => {
          const productCt: ProductoCt = new ProductoCt();
          productCt.cantidad = prod.cantidad;
          productCt.clave = prod.producto;
          productCt.moneda = prod.moneda;
          productCt.precio = prod.precio;
          ProductosCt.push(productCt);
        });
        const orderCtSupplier: OrderCt = {
          idPedido: 1,
          almacen: warehouse.productShipments[0].almacen,
          tipoPago: '04',
          envio: enviosCt,
          producto: ProductosCt
        };
        return orderCtSupplier;
      case 'cva':
        const enviosCva: EnvioCVA[] = [];
        const envioCva: EnvioCVA = new EnvioCVA();
        envioCva.nombre = user.name + ' ' + user.lastname;
        envioCva.direccion = dir.directions;
        envioCva.entreCalles = dir.references;
        envioCva.noExterior = dir.d_asenta;
        envioCva.colonia = dir.d_asenta;
        envioCva.estado = dir.d_estado;
        envioCva.ciudad = dir.d_mnpio;
        envioCt.noExterior = dir.outdoorNumber;
        envioCt.noInterior = dir.interiorNumber;
        envioCva.codigoPostal = parseInt(dir.d_codigo, 10);
        envioCva.telefono = dir.phone;
        enviosCva.push(envioCva);
        const ProductosCva: ProductoCva[] = [];
        warehouse.productShipments.forEach(prod => {
          const productCva: ProductoCva = new ProductoCva();
          productCva.clave = prod.producto;
          productCva.cantidad = prod.cantidad;
          ProductosCva.push(productCva);
        });
        const estado = this.ciudadesCVA.find(city => city.estado.toUpperCase() === dir.d_estado.toUpperCase()).clave;
        const ciudad = this.ciudadesCVA.find(city => city.ciudad.toUpperCase() === dir.d_mnpio.toUpperCase()).clave;
        const orderCvaSupplier: OrderCva = {
          NumOC: '1',
          Paqueteria: '6',
          CodigoSucursal: warehouse.productShipments[0].almacen,
          PedidoBO: 'N',
          Observaciones: 'Pedido de Prueba',
          productos: ProductosCva,
          TipoFlete: FF,
          Calle: dir.directions,
          Numero: dir.outdoorNumber,
          NumeroInt: dir.interiorNumber,
          Colonia: dir.d_asenta,
          Estado: estado,
          Ciudad: ciudad,
          Atencion: user.name + ' ' + user.lastname,
          CodigoPostal: dir.d_codigo
        };
        return orderCvaSupplier;
      case 'ingram':
        return '';
    }
    return '';
  }

  async sendOrderSupplier(): Promise<any> {
    // Cuando la consulta externa no requiere token
    const delivery = new Delivery();
    const id = '1';
    delivery.id = id;
    delivery.user = this.onSetUser(this.formData, this.stripeCustomer);
    delivery.warehouses = this.warehouses;
    const ordersCt: OrderCt[] = [];
    let orderCtResponse: OrderCtResponse = new OrderCtResponse();
    const ordersCva: OrderCva[] = [];
    let orderCvaResponse: OrderCvaResponse = new OrderCvaResponse();
    // Generar modelo de cada proveedor
    this.suppliers.forEach(supplier => {
      this.warehouses.forEach(async warehouse => {
        if (supplier.slug === warehouse.suppliersProd.idProveedor) {
          const order = this.setOrder(supplier, delivery, warehouse);
          switch (warehouse.suppliersProd.idProveedor) {
            case 'ct':
              ordersCt.push(order);
              break;
            case 'cva':
              ordersCva.push(order);
              break;
            case 'ingram':
              break;
          }
          console.log('EfectuarPedidos/order: ', order);
          const orderNew = await this.EfectuarPedidos(warehouse.suppliersProd.idProveedor, order)
            .then(async (result) => {
              console.log('EfectuarPedidos/result: ', result);
              return await result;
            });
          switch (warehouse.suppliersProd.idProveedor) {
            case 'ct':
              orderCtResponse = orderNew;
              break;
            case 'cva':
              orderCvaResponse = orderNew;
              break;
          }
        }
      });
    });
    delivery.ordersCt = ordersCt;
    delivery.ordersCva = ordersCva;
    delivery.orderCtResponse = orderCtResponse;
    delivery.orderCvaResponse = orderCvaResponse;
    console.log('delivery: ', delivery);
    // Levantar la Orden al Proveedor


    // Confirmar Pedido


    // if (!supplier.token) {
    //   let resultados;
    //   switch (supplier.slug) {
    //     case 'cva':
    //       resultados = [];
    //       return await resultados;
    //     case 'exel':
    //       resultados = [];
    //       return await resultados;
    //     default:
    //       break;
    //   }
    // } else {                                                                  // Syscom, CT
    //   return await this.externalAuthService.getToken(supplier, apiSelect)
    //     .then(
    //       async result => {
    //         switch (supplier.slug) {
    //           case 'ct':
    //             this.token = result.token;
    //             break;
    //           case 'syscom':
    //             this.token = result.access_token;
    //             break;
    //           default:
    //             break;
    //         }
    //         if (this.token) {
    //           let resultados;
    //           resultados = [];
    //           return await resultados;
    //         } else {
    //           basicAlert(TYPE_ALERT.WARNING, 'No se encontró el Token de Autorización.');
    //         }
    //       },
    //       error => {
    //         basicAlert(TYPE_ALERT.ERROR, error.message);
    //       }
    //     );
    // }
    return await delivery;
  }
  //#endregion Enviar Ordenes

  //#region Emails  //ICharge
  sendEmail(charge: any, issue: string = '', message: string = ''): void {
    const receiptEmail = charge.receipt_email + '; hosting3m@gmail.com';
    const subject = issue !== '' ? issue : 'Confirmacion del pedido';
    const html = message !== '' ? message : `El pedido se ha realizado correctamente.
            Puedes consultarlo en <a href="${charge.receipt_url}" target="_blank"> esta url</a>`;
    const mail: IMail = {
      to: receiptEmail,
      subject,
      html
    };
    this.mailService.send(mail).pipe(first()).subscribe();
  }
  //#endregion Emails

  //#region Direccion
  onSetEstados(event): void {
    const estado = event.value.split(':', 2);
    this.estados = [];
    this.municipios = [];
    this.selectEstado = new Estado();
    this.selectMunicipio = new Municipio();
    this.selectColonia = '';
    this.countrys.forEach(country => {
      if (country.c_pais === estado[1].split(' ').join('')) {
        this.estados = country.estados;
        this.formData.controls.selectEstado.setValue('');
        this.formData.controls.selectMunicipio.setValue('');
        this.formData.controls.selectColonia.setValue('');
        this.formData.controls.directions.setValue('');
      }
    });
  }

  onSetMunicipios(event): void {
    const municipio = event.value.split(':', 2);
    this.municipios = [];
    this.colonias = [];
    this.selectMunicipio = new Municipio();
    this.selectColonia = '';
    this.estados.forEach(estado => {
      if (estado.c_estado === municipio[1].split(' ').join('')) {
        this.municipios = estado.municipios;
        this.formData.controls.selectMunicipio.setValue('');
      }
    });
  }

  onSetColonias(event): void {
  }
  //#endregion Direccion

  //#region Pedidos
  async PedidosEjemplo(supplierName: string): Promise<any> {
    // get supplier
    const supplier = await this.suppliersService.getSupplierByName(supplierName)
      .then(async (result) => {
        return await result;
      });
    let apiOrder: Apis = new Apis();
    // Set Api Para Ordenes
    if (supplier.slug !== '') {
      supplier.apis.forEach(api => {
        if (api.type === 'order' && api.return === 'order') {
          apiOrder = api;
        }
      });
      if (apiOrder) {
        const pedidos = await this.externalAuthService.getCatalogSOAP(supplier, apiOrder, '')
          .then(async resultPedido => {
            try {
              return await resultPedido;
            } catch (error) {
              throw await new Error(error.message);
            }
          });
      }
    } else {
      // TODO Realizar el pedido manual.
    }
  }

  async EfectuarPedidos(supplierName: string, order: any): Promise<any> {
    // get supplier
    const supplier = await this.suppliersService.getSupplierByName(supplierName)
      .then(async (result) => {
        return await result;
      });
    let apiOrder: Apis = new Apis();
    // Set Api Para Ordenes
    if (supplier.slug !== '') {
      supplier.apis.forEach(api => {
        if (api.type === 'order' && api.return === 'order') {
          apiOrder = api;
        }
      });
      switch (supplier.slug) {
        case 'cva':
          if (apiOrder) {
            const pedidosCva = await this.externalAuthService.getPedidosSOAP(supplier, apiOrder, '', order)
              .then(async resultPedido => {
                try {
                  console.log('resultPedido: ', resultPedido);
                  return await resultPedido;
                } catch (error) {
                  throw await new Error(error.message);
                }
              });
            console.log('pedidosCva: ', pedidosCva);
          }
          break;
        case 'ct':
          const pedidosCt = await this.externalAuthService.getPedidosAPI(supplier, apiOrder, order)
            .then(async resultPedido => {
              try {
                console.log('resultPedido: ', resultPedido);
                return await resultPedido;
              } catch (error) {
                throw await new Error(error.message);
              }
            });
          console.log('pedidosCt: ', pedidosCt);
          break;
      }
    } else {
      // TODO Realizar el pedido manual.
    }
    return await 'Pedido Elaborado';
  }
  //#endregion

  //#region Catalogos Externos por json

  //#endregion

  //#region Ejemplos
  // Set Api Para Ordenes

  // const apiOrder = await this.suppliersService.getApiSupplier(supplierName, 'order', 'PedidoWeb')
  //   .then(async resultApiOrder => {
  //     // TODO - Solo prueba Listar Pedidos
  //     if (resultApiOrder.status) {
  //       return await resultApiOrder.apiSupplier;
  //     }
  //   })
  //   .catch(err => console.error(err));

  // const pedidos = await this.externalAuthService.getCatalogSOAP(supplier, apiOrder, '')
  //   .then(async resultPedido => {
  //     try {
  //       return await resultPedido;
  //     } catch (error) {
  //       throw await new Error(error.message);
  //     }
  //   });

  //#endregion
}
