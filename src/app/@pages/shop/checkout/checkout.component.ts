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
import { AddressInput, UserBasicInput, UserInput } from '@core/models/user.models';
import { OrderInput } from '@core/models/order.models';
import { CartItem } from '@shared/classes/cart-item';
import { Warehouse } from '@core/models/warehouse.models';
import { Delivery } from '@core/models/delivery.models';
import { BranchOffices, SupplierProd } from '@core/models/product.models';
import { ExternalAuthService } from '@core/services/external-auth.service';
import { SuppliersService } from '@core/services/suppliers/supplier.service';
import { ISupplier } from '@core/interfaces/supplier.interface';
import { ProductShipment } from '@core/models/productShipment.models';
import { Shipment } from '@core/models/shipment.models';
import { ShippingsService } from '@core/services/shipping.service';
import { IShipping } from '@core/interfaces/shipping.interface';
import { FF, PAY_DEPOSIT, PAY_FREE, PAY_MERCADO_PAGO, PAY_OPENPAY, PAY_PAYPAL, PAY_PAYU, PAY_STRIPE, PAY_TRANSFER, SF } from '@core/constants/constants';
import { EnvioCt, GuiaConnect, OrderCt, OrderCtConfirm, ProductoCt } from '@core/models/suppliers/orderct.models';
import { EnvioCVA, OrderCva, ProductoCva } from '@core/models/suppliers/ordercva.models';
import { Apis, Supplier } from '@core/models/suppliers/supplier';
import { OrderCvaResponse } from '@core/models/suppliers/ordercvaresponse.models';
import { OrderCtConfirmResponse, OrderCtResponse } from '@core/models/suppliers/orderctresponse.models';
import { HttpClient } from '@angular/common/http';
import { DeliverysService } from '@core/services/deliverys.service';
import { IAddress } from '@core/interfaces/user.interface';
import { ChargeOpenpayService } from '@core/services/openpay/charges.service';
import { AddressOpenpayInput, CardOpenpayInput, ChargeOpenpayInput, CustomerOpenpayInput } from '@core/models/openpay/_openpay.models';
import * as crypto from 'crypto-js';

declare var $: any;

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy {

  formData: FormGroup;
  formDataCard: FormGroup;
  formDataSpei: FormGroup;
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
  totalEnvios: string;
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

  isSubmitting = false;

  deviceDataId: string = '';
  numeroTarjetaSinFormato: string = '';
  numeroTarjetaFormateado: string = '';

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
    public deliverysService: DeliverysService,
    public chargeOpenpayService: ChargeOpenpayService
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
                  // Recuperar siguiente id
                  const id = await this.deliverysService.next();
                  // Generar Orden de Compra con Proveedores
                  const OrderSupplier = await this.sendOrderSupplier(id);
                  console.log('OrderSupplier: ', OrderSupplier);
                  // Registrar Pedido en DARU.
                  const deliverySave = await this.deliverysService.add(OrderSupplier);
                  console.log('deliverySave: ', deliverySave);
                  const NewProperty = 'receipt_email';
                  let internalEmail = false;
                  let typeAlert = TYPE_ALERT.SUCCESS;
                  let sendEmail = OrderSupplier.user.email;
                  let messageDelivery = 'El Pedido se ha realizado correctamente';
                  if (OrderSupplier.statusError) {
                    internalEmail = true;
                    this.isSubmitting = false;
                    typeAlert = TYPE_ALERT.WARNING;
                    sendEmail = 'marketing@daru.mx';
                    messageDelivery = OrderSupplier.messageError;
                  } else {
                    this.cartService.clearCart(false);
                    this.router.navigate(['/shop/offers/list']);
                  }
                  // Si compra es OK, continua.
                  OrderSupplier[NewProperty] = sendEmail;
                  this.sendEmail(OrderSupplier, messageDelivery, '', internalEmail);
                  await infoEventAlert(messageDelivery, '', typeAlert);
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

    this.formDataSpei = this.formBuilder.group({
      bankName: ['', Validators.required],
      clabe: ['', Validators.required]
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
              for (const idU of Object.keys(this.session.user?.addresses)) {
                const direction: IAddress = this.session.user?.addresses[idU];
                if (direction.dir_delivery_main === true) {
                  this.formData.controls.codigoPostal.setValue(direction.d_codigo);
                  this.formData.controls.selectColonia.setValue(direction.d_asenta);
                  this.formData.controls.directions.setValue(direction.directions);
                  this.formData.controls.outdoorNumber.setValue(direction.outdoorNumber);
                  this.formData.controls.interiorNumber.setValue(direction.interiorNumber);
                  this.formData.controls.references.setValue(direction.references);
                  if (this.countrys.length > 0) {
                    for (const idC of Object.keys(this.countrys)) {
                      const country: Country = this.countrys[idC];
                      if (country.c_pais === direction.c_pais) {
                        this.estados = country.estados;
                        this.formData.controls.selectCountry.setValue(direction.c_pais);
                        this.selectCountry.c_pais = direction.c_pais;
                        this.selectCountry.d_pais = direction.d_pais;
                        for (const idE of Object.keys(country.estados)) {
                          const estado: Estado = country.estados[idE];
                          if (estado.c_estado === direction.c_estado) {
                            this.municipios = estado.municipios;
                            this.formData.controls.selectEstado.setValue(direction.c_estado);
                            this.selectEstado.c_estado = direction.c_estado;
                            this.selectEstado.d_estado = direction.d_estado;
                            for (const idM of Object.keys(estado.municipios)) {
                              const municipio: Municipio = estado.municipios[idM];
                              if (municipio.c_mnpio === direction.c_mnpio) {
                                this.formData.controls.selectMunicipio.setValue(direction.c_mnpio);
                                this.selectMunicipio.c_mnpio = direction.c_mnpio;
                                this.selectMunicipio.D_mnpio = direction.d_mnpio;
                              }
                            }
                          }
                        }
                      }
                    }
                    // Agregar las colonias del CP
                    this.colonias = [];
                    for (const idCp of Object.keys(this.cps)) {
                      const codigo: Codigopostal = this.cps[idCp];
                      if (codigo.d_asenta) {
                        this.colonias.push(codigo.d_asenta);
                      }
                    }
                  }
                }
              }
            });
        }
      }
    });
    this.loadOpenPayAsync();
  }

  private loadOpenPayAsync(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://js.openpay.mx/openpay-data.v1.min.js';
    script.async = false; // Carga de manera sincrónica
    console.log('1-loadOpenPayAsync');
    script.onload = () => {
      // La librería se ha cargado, ahora podemos acceder a OpenPay
      console.log('2-script.onload');
      this.setupOpenPayDeviceData();
    };
    console.log('3-loadOpenPayAsync');
    document.head.appendChild(script);
  }

  private setupOpenPayDeviceData(): void {
    const formId = this.formData; // Reemplaza con el ID de tu formulario
    this.deviceDataId = window['OpenPay']['deviceData']['setup'](formId);
    console.log('setupOpenPayDeviceData/deviceDataId: ', this.deviceDataId);
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
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      if (this.formData.valid) {
        // Enviar par obtener token de la tarjeta, para hacer uso de ese valor para el proceso del pago
        loadData('Realizando el pago', 'Esperar el procesamiento de pago.');
        if (this.existeMetodoPago) {
          switch (this.typePay) {
            case PAY_STRIPE:
              this.payStripe();
              break;
            case PAY_OPENPAY:
              // Recuperar siguiente id
              const id = await this.deliverysService.next();
              // Realizar Cargo con la Tarjeta
              const pagoOpenpay = await this.payOpenpay(id);
              if (pagoOpenpay.status === false) {
                this.isSubmitting = false;
                return await infoEventAlert(pagoOpenpay.message, TYPE_ALERT.ERROR);
              }
              console.log('pagoOpenpay: ', pagoOpenpay);
              // Generar Orden de Compra con Proveedores
              const OrderSupplier = await this.sendOrderSupplier(id);
              console.log('OrderSupplier: ', OrderSupplier);
              if (OrderSupplier.error) {
                this.isSubmitting = false;
                return await infoEventAlert(OrderSupplier.messageError, TYPE_ALERT.ERROR);
              }
              // Registrar Pedido en DARU.
              const deliverySave = await this.deliverysService.add(OrderSupplier);
              console.log('deliverySave: ', deliverySave);
              const NewProperty = 'receipt_email';
              let internalEmail = false;
              let typeAlert = TYPE_ALERT.SUCCESS;
              let sendEmail = OrderSupplier.user.email;
              let messageDelivery = 'El Pedido se ha realizado correctamente';
              if (OrderSupplier.statusError) {
                internalEmail = true;
                this.isSubmitting = false;
                typeAlert = TYPE_ALERT.WARNING;
                sendEmail = 'marketing@daru.mx';
                messageDelivery = OrderSupplier.messageError;
              } else {
                this.cartService.clearCart(false);
                this.router.navigate(['/shop/offers/list']);
              }
              // Si compra es OK, continua.
              OrderSupplier[NewProperty] = sendEmail;
              this.sendEmail(OrderSupplier, messageDelivery, '', internalEmail);
              await infoEventAlert(messageDelivery, '', typeAlert);
              break;
            case PAY_TRANSFER:
              break;
            case PAY_DEPOSIT:
              break;
            case PAY_PAYPAL:
              break;
            case PAY_MERCADO_PAGO:
              break;

          }
        } else {
          this.isSubmitting = false;
          return await infoEventAlert('Se requiere definir un Metodo de Pago.', '');
        }
      } else {
        this.isSubmitting = false;
        return await infoEventAlert('Verificar los campos requeridos.', '');
      }
    }
  }

  ngOnDestroy(): void {
    this.subscr.unsubscribe();
    document.querySelector('body').removeEventListener('click', () => this.clearOpacity());
  }
  //#endregion Metodos Componentes

  //#region Metodos
  onSetUser(formData: FormGroup, stripeCustomer: string): UserBasicInput {
    const register = new UserBasicInput();
    register.id = '';
    if (this.session.user) {
      register.id = this.session.user.id;
    }
    register.name = formData.controls.name.value;
    register.lastname = formData.controls.lastname.value;
    register.email = formData.controls.email.value;
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

  async onSetCps(event): Promise<void> {
    if (event) {
      const cp = $(event.target).val();
      if (cp !== '') {
        // Recuperar pais, estado y municipio con el CP
        const codigoPostal = await this.codigopostalsService.getCps(1, -1, cp).then(async result => {
          this.cps = result.codigopostals;
          if (this.cps.length > 0) {
            // Agregar Pais, Estados, Municipios del CP
            if (this.countrys.length > 0) {
              for (const idC of Object.keys(this.countrys)) {
                const country: Country = this.countrys[idC];
                if (country.c_pais === this.cps[0].c_pais) {
                  this.estados = country.estados;
                  this.formData.controls.selectCountry.setValue(country.c_pais);
                  this.selectCountry.c_pais = country.c_pais;
                  this.selectCountry.d_pais = country.d_pais;
                  for (const idE of Object.keys(country.estados)) {
                    const estado: Estado = country.estados[idE];
                    if (estado.c_estado === this.cps[0].c_estado) {
                      this.municipios = estado.municipios;
                      this.formData.controls.selectEstado.setValue(estado.c_estado);
                      this.selectEstado.c_estado = estado.c_estado;
                      this.selectEstado.d_estado = estado.d_estado;
                      for (const idM of Object.keys(estado.municipios)) {
                        const municipio: Municipio = estado.municipios[idM];
                        if (municipio.c_mnpio === this.cps[0].c_mnpio) {
                          this.formData.controls.selectMunicipio.setValue(municipio.c_mnpio);
                          this.selectMunicipio.c_mnpio = municipio.c_mnpio;
                          this.selectMunicipio.D_mnpio = municipio.D_mnpio;
                        }
                      }
                    }
                  }
                }
              }
              // Agregar las colonias del CP
              this.colonias = [];
              for (const idCp of Object.keys(this.cps)) {
                const codigo: Codigopostal = this.cps[idCp];
                if (codigo.d_asenta) {
                  this.colonias.push(codigo.d_asenta);
                }
              }
              return await this.colonias;
              // Cotizar con los proveedores el costo de envio de acuerdo al producto.
            }
            return await [];
          }
          return await [];
        });
        // Cotizar con los proveedores el costo de envio de acuerdo al producto.
        if (codigoPostal.length > 0) {
          this.shipments = await this.getCotizacionEnvios(cp, this.selectEstado.d_estado);
        }
      } else {
        infoEventAlert('No se ha especificado un código correcto.', '');
      }
    } else {

    }
  }

  async getCotizacionEnvios(cp, estado): Promise<any> {
    const cotizacionEnvios = await this.onCotizarEnvios(cp, estado);
    if (cotizacionEnvios[0].costo <= 0) {
      const externos = await this.onCotizarEnviosExternos(cp, estado);
      if (externos.length > 0) {
        let costShips = 0;
        for (const idS of Object.keys(cotizacionEnvios)) {
          const ship = cotizacionEnvios[idS];
          costShips += ship.costo;
        }
        this.totalEnvios = costShips.toFixed(2).toString();
        this.changeShipping(costShips);
        return await externos;
      }
    } else {
      let costShips = 0;
      for (const idS of Object.keys(cotizacionEnvios)) {
        const ship = cotizacionEnvios[idS];
        costShips += ship.costo;
      }
      this.totalEnvios = costShips.toFixed(2).toString();
      this.changeShipping(costShips);
      return await cotizacionEnvios;
      // // Habilitado para mostrar el mas economico.
      // cotizacionEnvios.sort((a, b) => a.costo - b.costo);
      // const objetoMinimo = cotizacionEnvios[0];
      // return [objetoMinimo];
    }
    // Verificar que todos los productos tengan su envio.
    for (const idW of Object.keys(this.warehouses)) {
      const warehouse = this.warehouses[idW];
      if (warehouse.shipments.length === 0) {
        basicAlert(TYPE_ALERT.ERROR, 'Hay un problema con las paqueterias para el envio. Intentar mas tarde.');
      }
    }

    return await [];
  }

  findCommonBranchOffice(products: CartItem[]): BranchOffices | null {
    if (products.length === 0) {
      return null;
    }
    const filteredProducts = products.filter(
      (product) => product.suppliersProd.branchOffices.some((office) => office.cantidad > product.qty)
    );
    if (filteredProducts.length === 0) {
      return null;
    }
    const officeMap: { [estado: string]: BranchOffices } = {};
    for (const product of filteredProducts) {
      for (const office of product.suppliersProd.branchOffices) {
        if (office.cantidad > product.qty) {
          if (officeMap[office.estado]) {
            officeMap[office.estado].cantidad += office.cantidad; // Acumulamos la cantidad
          } else {
            officeMap[office.estado] = { ...office, cantidad: office.cantidad }; // Inicializamos con la cantidad
          }
        }
      }
    }

    let maxOffice: BranchOffices | null = null;
    for (const estado in officeMap) {
      if (!maxOffice || officeMap[estado].cantidad > maxOffice.cantidad) {
        maxOffice = officeMap[estado];
      }
    }

    return maxOffice;
  }

  /**
   *
   * @param cpDestino Codigo Postal a donde llegara el pedido
   * @param estadoCp Codigo postal predeterminado.
   * @returns Datos de la(s) paqueteria(s) del proveedor
   */
  async onCotizarEnvios(cpDestino: string, estadoCp: string): Promise<any> {
    this.shipments = [];
    this.warehouses = [];
    this.warehouse = new Warehouse();
    this.warehouse.shipments = [];
    let shipmentsEnd = [];
    // Verificar productos por proveedor.
    const suppliers = await this.suppliersService.getSuppliers()                    // Recuperar la lista de Proveedores
      .then(async result => {
        return await result.suppliers;
      });
    this.suppliers = suppliers;
    if (suppliers.length > 0) {
      for (const supId of Object.keys(suppliers)) {
        let supplier = new Supplier();
        supplier = suppliers[supId];
        const shipmentsSupp = [];
        const supplierProd = new SupplierProd();
        const warehouseNacional = new Warehouse();
        const productsNacional: ProductShipment[] = [];
        const apiShipment = await this.suppliersService                             // Set Api para Envios
          .getApiSupplier(supplier.slug, 'envios', 'paqueterias')
          .then(async result => {
            if (result.status) {
              return await result.apiSupplier;
            }
          });
        if (apiShipment) {                                                          // Si hay Api para el Proveedor.
          const arreglo = this.cartItems;                                           // Agrupar Productos Por Proveedor
          const carItemsSupplier = arreglo.filter((item) => item.suppliersProd.idProveedor === supplier.slug);
          if (carItemsSupplier.length > 0) {                                        // Si el proveedor tiene productos en el carrito
            // START Filtrar almacenes que tengan todos los productos y recuperar el almacen que los tenga todos.
            const concatenatedBranchOffices: BranchOffices[][] = [];
            for (const idCI of Object.keys(carItemsSupplier)) {
              const cartItem: CartItem = carItemsSupplier[idCI];
              concatenatedBranchOffices.push(cartItem.suppliersProd.branchOffices);
            }
            const branchSupplier = this.findCommonBranchOffice(carItemsSupplier);
            // END
            for (const idCI of Object.keys(carItemsSupplier)) {                     // Set los productos y el almacen para enviar.
              const cartItem: CartItem = carItemsSupplier[idCI];
              const productShipment = new ProductShipment();
              productShipment.producto = cartItem.sku;
              productShipment.cantidad = cartItem.qty;
              productShipment.precio = cartItem.price;
              if (cartItem.promociones.disponible_en_promocion) {
                productShipment.priceSupplier = cartItem.promociones.disponible_en_promocion;
              } else {
                productShipment.priceSupplier = cartItem.suppliersProd.price;
              }
              productShipment.moneda = cartItem.suppliersProd.moneda;
              productShipment.almacen = branchSupplier.id;
              productShipment.cp = branchSupplier.cp;
              productShipment.name = cartItem.name;
              productShipment.total = cartItem.qty * cartItem.price;
              productsNacional.push(productShipment);
              warehouseNacional.id = branchSupplier.id;
              warehouseNacional.cp = branchSupplier.cp;
              warehouseNacional.name = branchSupplier.name;
              warehouseNacional.estado = branchSupplier.estado;
              warehouseNacional.latitud = branchSupplier.latitud;
              warehouseNacional.longitud = branchSupplier.longitud;
              this.warehouse = warehouseNacional;
              this.warehouse.productShipments = productsNacional;
            }
            this.warehouse.cp = cpDestino;
            this.warehouse.productShipments = productsNacional;
            const shipmentsCost = await this.externalAuthService.onShippingEstimate(    // Cotizar el envio de productos por proveedor
              supplier, apiShipment, this.warehouse, true)
              .then(async (resultShip) => {
                const shipments: Shipment[] = [];
                for (const key of Object.keys(resultShip)) {
                  const shipment = new Shipment();
                  shipment.empresa = resultShip[key].empresa.toString();
                  if (supplier.slug === 'ct') {
                    shipment.costo = resultShip[key].total;
                    shipment.metodoShipping = resultShip[key].metodo;
                    shipment.lugarEnvio = resultShip[key].lugarEnvio.toLocaleUpperCase();
                    shipment.lugarRecepcion = this.selectEstado.d_estado.toLocaleUpperCase();
                  } else if (supplier.slug === 'cva') {
                    shipment.costo = resultShip[key].costo;
                    shipment.metodoShipping = resultShip[key].metodoShipping;
                    shipment.lugarEnvio = resultShip[key].lugarEnvio.toLocaleUpperCase();
                    shipment.lugarRecepcion = this.selectEstado.d_estado.toLocaleUpperCase();
                  }
                  shipments.push(shipment);
                }
                return await shipments;
              });
            for (const shipId of Object.keys(shipmentsCost)) {
              shipmentsSupp.push(shipmentsCost[shipId]);
              shipmentsEnd.push(shipmentsCost[shipId]);
            }
            this.warehouse.shipments = shipmentsSupp;
            supplierProd.idProveedor = supplier.slug;
            this.warehouse.suppliersProd = supplierProd;
            this.warehouses.push(this.warehouse);
          }
        }
      }
    }
    return await shipmentsEnd;
    // Elaborar Pedido Previo a facturacion.
  }

  /**
   *
   * @param cpDestino Codigo Postal a donde llegara el pedido
   * @param estadoCp Codigo postal predeterminado.
   * @returns Datos de la(s) paqueteria(s) externa(s)
   */
  async onCotizarEnviosExternos(cpDestino: string, estadoCp: string): Promise<any> {
    // Inicializar Arreglo de Envios.
    this.shipments = [];
    this.warehouse = new Warehouse();
    this.warehouse.shipments = [];
    const shipmentsEnd = [];

    const shippings = await this.shippingsService.getShippings()          // Recuperar la lista de Paqueterias
      .then(async result => {
        return await result.shippings;
      });
    if (shippings.length > 0) {
      // Cotizar con las paqueterias Externas a Proveedores
      const shipmentsExt = await this.shippingsService.getShippings()
        .then(async result => {
          if (result.status && result.shippings.length > 0) {
            for (const supId of Object.keys(result.shippings)) {
              let shipping = new Supplier();
              shipping = result.shippings[supId];
              const apiSelectShip = shipping.apis.filter(api => api.operation === 'pricing')[0];
              const shippingsEstimate = await this.externalAuthService.onShippingEstimate(
                shipping, apiSelectShip, this.warehouse, false)
                .then(async (resultShipment) => {
                  const shipments: Shipment[] = [];
                  for (const key of Object.keys(resultShipment)) {
                    const shipment = new Shipment();
                    shipment.empresa = resultShipment[key].empresa;
                    shipment.costo = resultShipment[key].costo;
                    shipment.metodoShipping = '';
                    shipment.lugarEnvio = resultShipment[key].lugarEnvio.toLocaleUpperCase();
                    shipment.lugarRecepcion = resultShipment[key].lugarRecepcion.toLocaleUpperCase();
                    shipments.push(shipment);
                  }
                  return await shipments;
                }
                );
              for (const shipId of Object.keys(shippingsEstimate)) {
                shipmentsEnd.push(shippingsEstimate[shipId]);
              }
            }
            return await shipmentsEnd;
          }
          return await [];
        });
    }
    return await shipmentsEnd;
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

  removeAccents(text: string): string {
    const accents = 'ÁÉÍÓÚáéíóú';
    const accentsOut = 'AEIOUaeiou';
    const mapAccents: { [key: string]: string } = {};
    const textArray = text.split('');
    accents.split('').forEach((accent, index) => {
      mapAccents[accent] = accentsOut[index];
    });
    return textArray
      .map((char) => mapAccents[char] || char)
      .join('');
  }

  //#endregion Metodos

  //#region Cobros
  async payStripe(): Promise<any> {
    await this.stripePaymentService.takeCardToken(true);
    return await true;
  }

  generarNumeroAleatorioEncriptado(): string {
    // Paso 1: Generar un número aleatorio entre 0 y 999999
    const numeroAleatorio = Math.floor(Math.random() * 1000000);

    // Paso 2: Convertir el número en una cadena
    const numeroEnCadena = numeroAleatorio.toString();

    // Paso 3: Encriptar la cadena utilizando AES de crypto
    const claveEncriptacion = 'mi_clave_secreta'; // Reemplaza esto con una clave segura
    const iv = crypto.lib.WordArray.random(16); // Generar un vector de inicialización aleatorio
    const encrypted = crypto.AES.encrypt(numeroEnCadena, claveEncriptacion, { iv: iv });

    // Truncar o recortar el resultado del cifrado a 32 caracteres
    const resultadoEncriptado32 = encrypted.toString().slice(0, 32);
    return resultadoEncriptado32;
  }

  // Método para formatear el número de tarjeta de crédito
  formatearNumeroTarjeta(numeroTarjetaSinFormato: string) {
    // Remover los espacios en blanco y guiones del número sin formato
    const numeroSinEspacios = numeroTarjetaSinFormato.replace(/\s|-/g, '');

    // Aplicar el formato 4 dígitos - 4 dígitos - 4 dígitos - 4 dígitos
    const regex = /(\d{1,4})(\d{1,4})(\d{1,4})(\d{1,4})/;
    const grupos = regex.exec(numeroSinEspacios);
    if (grupos) {
      this.numeroTarjetaFormateado = `${grupos[1]}-${grupos[2]}-${grupos[3]}-${grupos[4]}`;
    } else {
      this.numeroTarjetaFormateado = '';
    }
  }

  bloquearLetras(event: KeyboardEvent) {
    // Obtener el valor actual del input
    const valorInput = (event.target as HTMLInputElement).value;

    // Obtener el código ASCII de la tecla presionada
    const charCode = event.which ? event.which : event.keyCode;

    // Verificar si el código corresponde a un número (entre 48 y 57 son números)
    if (charCode < 48 || charCode > 57) {
      // Bloquear la tecla presionada si no es un número
      event.preventDefault();
    }
  }

  async payOpenpay(id: string): Promise<any> {
    const card_numberF = document.querySelector<HTMLInputElement>('[data-openpay-card="card_number"]');
    const card_number = card_numberF.value.replace(/-/g, '');       // Remover los guiones del número de tarjeta antes de enviarlo
    const expiration_month = document.querySelector<HTMLInputElement>('[data-openpay-card="expiration_month"]');
    const expiration_year = document.querySelector<HTMLInputElement>('[data-openpay-card="expiration_year"]');
    const cvv2 = document.querySelector<HTMLInputElement>('[data-openpay-card="cvv2"]');
    const holder_name = this.formData.controls.name.value + ' ' + this.formData.controls.lastname.value;
    const card: CardOpenpayInput = new CardOpenpayInput();

    card.card_number = card_number;
    card.holder_name = holder_name;
    card.expiration_year = expiration_year.value;
    card.expiration_month = expiration_month.value;
    card.cvv2 = cvv2.value;
    const cardResponse = await this.chargeOpenpayService.addCard(card);

    if (cardResponse.status === false) {
      return { status: cardResponse.status, message: cardResponse.message };
    }

    const cardNew = cardResponse.createCardOpenpay;
    const totalCharge = parseFloat(this.totalPagar);
    this.deviceDataId = this.generarNumeroAleatorioEncriptado();

    const charge: ChargeOpenpayInput = new ChargeOpenpayInput();
    charge.method = "card";
    charge.source_id = cardNew.id;
    charge.amount = totalCharge;
    charge.currency = "MXN";
    charge.description = "Cargo de prueba";
    charge.order_id = this.deviceDataId;
    charge.device_session_id = this.deviceDataId;
    charge.capture = false;

    const customer: CustomerOpenpayInput = new CustomerOpenpayInput();
    customer.external_id = this.deviceDataId;
    customer.name = this.formData.controls.name.value;
    customer.last_name = this.formData.controls.lastname.value;
    customer.email = this.formData.controls.email.value;
    customer.phone_number = this.formData.controls.phone.value;
    customer.clabe = "";

    const address: AddressOpenpayInput = new AddressOpenpayInput();
    address.line1 = this.formData.controls.directions.value + ' ' + this.formData.controls.outdoorNumber.value;
    address.line2 = this.formData.controls.selectColonia.value;
    address.line3 = this.formData.controls.references.value;
    address.postal_code = this.formData.controls.codigoPostal.value;
    address.city = this.selectMunicipio.D_mnpio;
    address.state = this.selectEstado.d_estado;
    address.country_code = "MX";
    customer.address = address;

    charge.customer = customer;
    charge.payment_plan = null;
    charge.use_card_points = "NONE";
    charge.send_email = false;
    charge.redirect_url = "https://daru.mx/";
    charge.use_3d_secure = false;
    charge.confirm = true;

    const chargeResult = await this.chargeOpenpayService.createCharge(charge);
    if (chargeResult.status === false) {
      return { status: cardResponse.status, message: 'No se pudo cargar el pago. Intente mas tarde.' };
    }

    const idChargeOpenpay = chargeResult.createChargeOpenpay.id;
    const captureTransactionOpenpay = { amount: totalCharge }
    const createResult = await this.chargeOpenpayService.captureCharge(idChargeOpenpay, captureTransactionOpenpay);
    if (createResult.status === false) {
      return { status: createResult.status, message: 'No se pudo confirmar el pago. Intente mas tarde.' };
    }
    return await createResult;
  }
  //#endregion Cobros

  //#region Enviar Ordenes
  async setOrder(supplier: ISupplier, delivery: Delivery, warehouse: Warehouse, pedido: number): Promise<any> {
    const user = delivery.user;
    const dir = delivery.user.addresses[0];
    switch (supplier.slug) {
      case 'ct':
        const guiaConnect: GuiaConnect = new GuiaConnect();
        guiaConnect.generarGuia = true;
        guiaConnect.paqueteria = warehouse.shipments[0].empresa;
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
        envioCt.telefono = parseInt(dir.phone, 10);
        enviosCt.push(envioCt);
        const ProductosCt: ProductoCt[] = [];
        for (const idPS of Object.keys(warehouse.productShipments)) {
          const prod: ProductShipment = warehouse.productShipments[idPS];
          const productCt: ProductoCt = new ProductoCt();
          productCt.cantidad = prod.cantidad;
          productCt.clave = prod.producto;
          productCt.moneda = prod.moneda;
          productCt.precio = prod.priceSupplier;
          ProductosCt.push(productCt);
        }
        const orderCtSupplier: OrderCt = {
          idPedido: pedido,
          almacen: warehouse.productShipments[0].almacen,
          tipoPago: '99',
          guiaConnect: guiaConnect,
          envio: enviosCt,
          productoCt: ProductosCt,
          cfdi: 'G01'
        };
        return orderCtSupplier;
      case 'cva':
        const enviosCva: EnvioCVA[] = [];
        const envioCva: EnvioCVA = new EnvioCVA();
        envioCva.nombre = user.name + ' ' + user.lastname;
        envioCva.direccion = dir.directions;
        envioCva.entreCalles = dir.references !== '' ? dir.references : '.';
        envioCva.colonia = dir.d_asenta;
        envioCva.estado = dir.d_estado;
        envioCva.ciudad = dir.d_mnpio;
        envioCva.noExterior = dir.outdoorNumber;
        envioCva.noInterior = dir.interiorNumber !== '' ? dir.interiorNumber : '0';
        envioCva.codigoPostal = parseInt(dir.d_codigo, 10);
        envioCva.telefono = dir.phone;
        enviosCva.push(envioCva);
        const ProductosCva: ProductoCva[] = [];
        for (const idPS of Object.keys(warehouse.productShipments)) {
          const prod: ProductShipment = warehouse.productShipments[idPS];
          const productCva: ProductoCva = new ProductoCva();
          productCva.clave = prod.producto;
          productCva.cantidad = prod.cantidad;
          ProductosCva.push(productCva);
        }
        const ciudadesCVA = await this.externalAuthService.getCiudadesCva();
        const estado = ciudadesCVA.find(city => city.estado.toUpperCase() === dir.d_estado.toUpperCase()).id;
        const ciudad = ciudadesCVA.find(city => city.ciudad.toUpperCase() === dir.d_mnpio.toUpperCase()).clave;
        const orderCvaSupplier: OrderCva = {
          NumOC: 'DARU-' + pedido.toString().padStart(6, '0'),
          Paqueteria: '4',
          CodigoSucursal: warehouse.productShipments[0].almacen,
          PedidoBO: 'N',
          Observaciones: 'Pedido de Prueba',
          productos: ProductosCva,
          TipoFlete: FF,
          Calle: this.removeAccents(dir.directions),
          Numero: dir.outdoorNumber,
          NumeroInt: dir.interiorNumber,
          CP: warehouse.productShipments[0].cp,
          Colonia: this.removeAccents(dir.d_asenta),
          Estado: Math.round(estado).toString(),
          Ciudad: ciudad,
          Atencion: this.removeAccents(user.name + ' ' + user.lastname)
        };
        return orderCvaSupplier;
      case 'ingram':
        return '';
    }
    return '';
  }

  async sendOrderSupplier(id: string): Promise<any> {
    // Cuando la consulta externa no requiere token
    const delivery = new Delivery();
    delivery.id = id;
    delivery.deliveryId = id;
    delivery.statusError = false;
    delivery.messageError = '';
    delivery.user = this.onSetUser(this.formData, this.stripeCustomer);
    delivery.warehouses = this.warehouses;
    const ordersCt: OrderCt[] = [];
    let orderCtResponse: OrderCtResponse = new OrderCtResponse();
    orderCtResponse.pedidoWeb = 'DARU-' + id;
    orderCtResponse.fecha = '';
    orderCtResponse.tipoDeCambio = 0;
    orderCtResponse.estatus = '';
    orderCtResponse.errores = [];
    const ordersCva: OrderCva[] = [];
    let orderCvaResponse: OrderCvaResponse = new OrderCvaResponse();
    orderCvaResponse.pedido = 'DARU-' + id;
    orderCvaResponse.estado = '';
    orderCvaResponse.total = '';
    orderCvaResponse.error = '';
    orderCvaResponse.agentemail = '';
    orderCvaResponse.almacenmail = '';
    // Generar modelo de cada proveedor
    for (const idWar of Object.keys(this.warehouses)) {
      const warehouse: Warehouse = this.warehouses[idWar];
      const supplier = this.suppliers.find((item) => item.slug === warehouse.suppliersProd.idProveedor);
      const order = await this.setOrder(supplier, delivery, warehouse, parseInt(id, 10));
      switch (warehouse.suppliersProd.idProveedor) {
        case 'ct':
          // order.pedido = 'DARU-' + id.toString().padStart(6, '0');
          ordersCt.push(order);
          break;
        case 'cva':
          order.NumOC = 'DARU-' + id.toString().padStart(6, '0');
          ordersCva.push(order);
          break;
        case 'ingram':
          break;
      }
      const orderNew = await this.EfectuarPedidos(warehouse.suppliersProd.idProveedor, order)
        .then(async (result) => {
          return await result;
        });
      if (orderNew) {
        switch (warehouse.suppliersProd.idProveedor) {
          case 'ct':
            orderCtResponse = orderNew;
            delivery.ordersCt = ordersCt;
            delivery.orderCtResponse = orderCtResponse;

            const orderCtConfirm: OrderCtConfirm = new OrderCtConfirm();
            orderCtConfirm.folio = orderNew.pedidoWeb;

            const confirmarPedidoCt = await this.externalAuthService.confirmOrderCt(orderCtConfirm.folio);
            console.log('confirmarPedidoCt:', confirmarPedidoCt);

            const ctConfirmResponse: OrderCtConfirmResponse = {
              okCode: confirmarPedidoCt.confirmOrderCt.okCode.toString(),
              okMessage: confirmarPedidoCt.confirmOrderCt.okMessage,
              okReference: confirmarPedidoCt.confirmOrderCt.okReference
            };
            console.log('ctConfirmResponse:', ctConfirmResponse);



            delivery.orderCtConfirmResponse = ctConfirmResponse;
            break;
          case 'cva':
            if (orderNew.estado === 'ERROR') {
              delivery.statusError = true;
              delivery.messageError = orderNew.error;
              return await delivery;
            }
            orderCvaResponse = orderNew;
            delivery.ordersCva = ordersCva;
            delivery.orderCvaResponse = orderCvaResponse;
            const confirmarPedidoCva = [];
            break;
        }
        if (orderCtResponse.errores) {
          if (orderCtResponse.errores.length > 0) {
            delivery.statusError = true;
            delivery.messageError = orderCtResponse.errores[0].errorMessage;
          }
        }
        if (orderCvaResponse.error !== '') {
          delivery.statusError = true;
          delivery.messageError = orderCvaResponse.error;
        }
      }
    }
    // TODO::Confirmar Pedido
    return await delivery;
  }
  //#endregion Enviar Ordenes

  //#region Emails  //ICharge
  sendEmail(charge: any, issue: string = '', message: string = '', internal: boolean = false): void {
    const receiptEmail = charge.receipt_email + '; marketplace@daru.mx';
    const subject = issue !== '' ? issue : 'Confirmación del pedido';
    const productos: ProductShipment[] = [];
    let totalProd = 0.0;
    for (const idW of Object.keys(charge.warehouses)) {
      const warehouse = charge.warehouses[idW];
      for (const idP of Object.keys(warehouse.productShipments)) {
        const prod = warehouse.productShipments[idP];
        totalProd += (prod.precio * prod.cantidad);
        productos.push(prod);
      }
    }
    const total = totalProd + parseFloat(this.totalEnvios);

    // const productos = charge.warehouses[0].productShipments;

    const productRows = productos.map((producto: any) => `
        <tr>
          <td>${producto.name}</td>
          <td>${producto.cantidad}</td>
          <td>${producto.precio}</td>
          <td>${producto.total}</td>
        </tr>
      `).join('');
    const html = message !== '' ? message : `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nota de Compra</title>
        <style>
          /* Estilos generales */
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333333;
            margin-top: 0;
          }
          p {
            color: #666666;
            line-height: 1.5;
            font-size: 10px; /* Tamaño de letra de los párrafos */
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px; /* Tamaño de letra de los párrafos */
          }
          th, td {
            padding: 10px;
            border-bottom: 1px solid #dddddd;
          }
          th {
            text-align: left;
            font-weight: bold;
          }
          tfoot td {
            text-align: right;
            font-weight: bold;
          }
          foot {
            color: #666666;
            font-size: 8px; /* Tamaño de letra de los párrafos */
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nota de Compra</h1>
          <p>Estimado/a ${charge.user.name} ${charge.user.lastname},</p>
          <p>A continuación, adjuntamos la nota de compra correspondiente a su pedido:</p>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"><strong>Subtotal:</strong></td>
                <td colspan="2">$ ${totalProd.toFixed(2).toString()}</td>
              </tr>
              <tr>
                <td colspan="2"><strong>Costo Envio:</strong></td>
                <td colspan="2">$ ${this.totalEnvios}</td>
              </tr>
              <tr>
                <td colspan="2"><strong>Total:</strong></td>
                <td colspan="2">$ ${total.toFixed(2).toString()}</td>
              </tr>
            </tfoot>
          </table>
          <p>Gracias por su compra. Si tiene alguna pregunta o necesita ayuda adicional, no dude en ponerse en contacto con nuestro equipo de atención al cliente.</p>
          <p>Saludos cordiales,</p>
          <p>DARU</p>
          <hr>
          <hr>
          <p class="foot">
            Este mensaje contiene información de DARU, la cual es de carácter privilegiada, confidencial y de acceso restringido conforme a la ley aplicable. Si el lector de este mensaje no es el destinatario previsto, empleado o agente responsable de la transmisión del mensaje al destinatario, se le notifica por este medio que cualquier divulgación, difusión, distribución, retransmisión, reproducción, alteración y/o copiado, total o parcial, de este mensaje y su contenido está expresamente prohibido. Si usted ha recibido esta comunicación por error, notifique por favor inmediatamente al remitente del presente correo electrónico, y posteriormente elimine el mismo.
          </p>
        </div>
      </body>
      </html>
      `;
    // const subject
    const mail: IMail = {
      to: receiptEmail,
      subject,
      html
    };
    this.mailService.send(mail).pipe(first()).subscribe();                      // Envio de correo externo.
    if (internal) {                                                        // Correos internos
      const receiptEmailInt = charge.receipt_email + '; marketplace@daru.mx';
      const subjectInt = issue !== '' ? issue : 'Pedido solicitado al proveedor';
      let htmlInt = '';
      if (charge.orderCtResponse) {
        htmlInt = 'Pedido de CT';
      }
      if (charge.orderCvaResponse) {
        htmlInt = 'Pedido de CVA';
      }
      const mailInt: IMail = {
        to: receiptEmailInt,
        subject: subjectInt,
        html: htmlInt
      };
      this.mailService.send(mailInt).pipe(first()).subscribe();                      // Envio de correo externo.
    }
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
    for (const idC of Object.keys(this.countrys)) {
      const country: Country = this.countrys[idC];
      if (country.c_pais === estado[1].split(' ').join('')) {
        this.estados = country.estados;
        this.formData.controls.selectEstado.setValue('');
        this.formData.controls.selectMunicipio.setValue('');
        this.formData.controls.selectColonia.setValue('');
        this.formData.controls.directions.setValue('');
        this.formData.controls.outdoorNumber.setValue('');
        this.formData.controls.interiorNumber.setValue('');
      }
    }
  }

  onSetMunicipios(event): void {
    const municipio = event.value.split(':', 2);
    this.municipios = [];
    this.colonias = [];
    this.selectMunicipio = new Municipio();
    this.selectColonia = '';
    for (const idE of Object.keys(this.estados)) {
      const estado: Estado = this.estados[idE];
      if (estado.c_estado === municipio[1].split(' ').join('')) {
        this.municipios = estado.municipios;
        this.formData.controls.selectMunicipio.setValue('');
      }
    }
  }

  onSetColonias(event): void {
  }
  //#endregion Direccion

  //#region Pedidos
  async EfectuarPedidos(supplierName: string, order: any): Promise<any> {
    switch (supplierName) {
      case 'cva':
        const pedidosCva = await this.externalAuthService.setOrderCva(order)
          .then(async resultPedido => {
            try {
              const { orderCva } = resultPedido.orderCva;
              const cvaResponse: OrderCvaResponse = {
                agentemail: orderCva?.agentemail || '',
                almacenmail: orderCva?.almacenmail || '',
                error: orderCva?.error || '',
                estado: orderCva?.estado || '',
                pedido: orderCva?.pedido || '0',
                total: orderCva?.total || '0',
              };
              return await cvaResponse;
            } catch (error) {
              throw await error;
            }
          });
        return await pedidosCva;
      case 'ct':
        const pedidosCt = await this.externalAuthService.setOrderCt(
          order.idPedido,
          order.almacen,
          order.tipoPago,
          order.guiaConnect,
          order.envio,
          order.productoCt,
          order.cfdi
        )
          .then(async resultPedido => {
            try {
              const ctResponse: OrderCtResponse = new OrderCtResponse();
              ctResponse.estatus = resultPedido.orderCt.estatus;
              ctResponse.fecha = resultPedido.orderCt.fecha;
              ctResponse.pedidoWeb = resultPedido.orderCt.pedidoWeb;
              ctResponse.tipoDeCambio = resultPedido.orderCt.tipoDeCambio;
              ctResponse.errores = resultPedido.orderCt.errores;
              return await ctResponse;
            } catch (error) {
              throw await error;
            }
          });
        return await pedidosCt;
    }
    return await [];

    // get supplier
    const supplier = await this.suppliersService.getSupplierByName(supplierName)
      .then(async (result) => {
        return await result;
      });
    let apiOrder: Apis = new Apis();
    // Set Api Para Ordenes
    if (supplier.slug !== '') {
      for (const idA of Object.keys(supplier.apis)) {
        const api: Apis = supplier.apis[idA];
        if (api.type === 'order' && api.return === 'order') {
          apiOrder = api;
        }
      }
      switch (supplier.slug) {
        case 'cva':
          if (apiOrder) {
            const pedidosCva = await this.externalAuthService.getPedidosSOAP(supplier, apiOrder, '', order)
              .then(async resultPedido => {
                try {
                  const cvaResponse: OrderCvaResponse = new OrderCvaResponse();
                  cvaResponse.agentemail = resultPedido.agentemail._ ? resultPedido.agentemail._ : '';
                  cvaResponse.almacenmail = resultPedido.almacenmail._ ? resultPedido.almacenmail._ : '';
                  cvaResponse.error = resultPedido.error._ ? resultPedido.error._ : '';
                  cvaResponse.estado = resultPedido.estado._ ? resultPedido.estado._ : '';
                  cvaResponse.pedido = resultPedido.pedido._ ? resultPedido.pedido._ : '0';
                  cvaResponse.total = resultPedido.total._ ? resultPedido.total._ : '0';
                  return await cvaResponse;
                } catch (error) {
                  throw await error;
                }
              });
            return await pedidosCva;
          }
          break;
        case 'ct':
          const pedidosCt = await this.externalAuthService.getPedidosAPI(supplier, apiOrder, order)
            .then(async resultPedido => {
              try {
                const ctResponse: OrderCtResponse = new OrderCtResponse();
                if (resultPedido[0].respuestaCT) {
                  ctResponse.estatus = resultPedido[0].respuestaCT.estatus;
                  ctResponse.fecha = resultPedido[0].respuestaCT.fecha;
                  ctResponse.pedidoWeb = resultPedido[0].respuestaCT.pedidoWeb;
                  ctResponse.tipoDeCambio = resultPedido[0].respuestaCT.tipoDeCambio;
                  ctResponse.errores = resultPedido[0].respuestaCT.errores;
                } else {
                  ctResponse.estatus = resultPedido.estatus;
                  ctResponse.fecha = resultPedido.fecha;
                  ctResponse.pedidoWeb = resultPedido.pedidoWeb;
                  ctResponse.tipoDeCambio = resultPedido.tipoDeCambio;
                  ctResponse.errores = resultPedido.errores;
                }
                return await ctResponse;
              } catch (error) {
                throw await error;
              }
            });
          return await pedidosCt;
      }
    } else {
      // TODO Realizar el pedido manual.
    }
    return await [];
  }

  async ConfirmarPedidos(supplierName: string, order: any): Promise<any> {
    // Get supplier
    const supplier = await this.suppliersService.getSupplierByName(supplierName)
      .then(async (result) => {
        return await result;
      });
    if (supplier.slug !== '') {
      // Get Api Para Confirmar Pedidos
      const apiConfirmar = supplier.apis.find((item) => item.return === 'confirmar');
      if (apiConfirmar) {
        switch (supplier.slug) {
          case 'cva':
            // TODO
            return await [];
          case 'ct':
            const orderCtConfirm: OrderCtConfirm = new OrderCtConfirm();
            orderCtConfirm.folio = order.pedidoWeb;
            const pedidosCt = await this.externalAuthService.confirmOrderCt(orderCtConfirm.folio)
              .then(async resultConfirm => {
                try {
                  const ctConfirmResponse: OrderCtConfirmResponse = new OrderCtConfirmResponse();
                  ctConfirmResponse.okCode = resultConfirm.okCode;
                  ctConfirmResponse.okMessage = resultConfirm.okMessage;
                  ctConfirmResponse.okReference = resultConfirm.okReference;
                  return await ctConfirmResponse;
                } catch (error) {
                  throw await error;
                }
              });
            return await pedidosCt;
        }
      } else {
        // TODO Realizar la confirmacion manual.
      }
    } else {
      // TODO Realizar la confirmacion manual.
    }
    return await [];
  }
  //#endregion

  //#region Catalogos Externos por json

  //#endregion

  //#region Catalogos Generales
  //#endregion
}
