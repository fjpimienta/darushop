import { Component, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CartService } from '@core/services/cart.service';
import { CountrysService } from '@core/services/countrys.service';
import { CodigopostalsService } from '@core/services/codigopostals.service';
import { Codigopostal } from '@core/models/codigopostal.models';
import { Country, Estado, Municipio } from '@core/models/country.models';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ICustomer, IResultStripeCustomer } from '@core/interfaces/stripe/customer.interface';
import { ChargeService } from '@core/services/stripe/charge.service';
import { IPayment } from '@core/interfaces/stripe/payment.interface';
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
import { FF, PAY_DEPOSIT, PAY_FREE, PAY_MERCADO_PAGO, PAY_OPENPAY, PAY_PAYPAL, PAY_PAYU, PAY_STRIPE, PAY_TRANSFER } from '@core/constants/constants';
import { EnvioCt, GuiaConnect, OrderCt, OrderCtConfirm, ProductoCt } from '@core/models/suppliers/orderct.models';
import { EnvioCVA, OrderCva, ProductoCva } from '@core/models/suppliers/ordercva.models';
import { Apis, Supplier } from '@core/models/suppliers/supplier';
import { OrderCvaResponse } from '@core/models/suppliers/ordercvaresponse.models';
import { ErroresCT, OrderCtConfirmResponse, OrderCtResponse } from '@core/models/suppliers/orderctresponse.models';
import { DeliverysService } from '@core/services/deliverys.service';
import { IAddress } from '@core/interfaces/user.interface';
import { ChargeOpenpayService } from '@core/services/openpay/charges.service';
import { AddressOpenpayInput, ChargeOpenpayInput, CustomerOpenpayInput } from '@core/models/openpay/_openpay.models';
import * as crypto from 'crypto-js';
import { CuponsService } from '@core/services/cupon.service';
import { InvoiceConfigsService } from '@core/services/invoiceconfig.service';
import { FormaPago, InvoiceConfig, InvoiceConfigInput, MetodoPago, RegimenFiscal, UsoCFDI } from '@core/models/invoiceConfig.models';
import { WelcomesService } from '@core/services/welcomes.service';
import { Cupon } from '@core/models/cupon.models';
import { IcommktsService } from '@core/services/suppliers/icommkts.service';
import { CheckoutExitConfirmationService } from '@core/services/navigationConfirmation.service';

declare var $: any;
declare var OpenPay: any

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy {

  private openpay: any;

  formData: FormGroup;
  formDataCard: FormGroup;
  formDataInvoice: FormGroup;
  cartItems: CartItem[] = [];
  cartItemsChanges: CartItem[] = [];
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
  cupon: Cupon;

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
  discountPorc: string = '0';
  discount: string = '0';
  discountImporte: string = '0';
  resultCustomer: IResultStripeCustomer;
  typeDiscount = '';

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
  isSubmittingCapture = false;

  deviceDataId: string = '';
  orderUniqueId: string = '';
  nombreTarjeta: string = '';
  numeroTarjetaFormateado: string = '';
  numeroClabeFormateada: string = '';
  nameCard: string = '';
  lastNameCard: string = '';
  bankName: string;

  loaded = false;
  idDelivery: string;
  idTransaction: string = '';

  commonBranchOffices: Set<string> = new Set<string>();

  isChecked: boolean = false; // Inicialmente desactivado

  showFacturacion: boolean = false;
  invoiceConfigs: InvoiceConfig[] = [];
  invoceConfigInput: InvoiceConfigInput = new InvoiceConfigInput();
  rfc: string = '';
  codigoPostalInvoice: string = '';
  nombres: string = '';
  nombreEmpresa: string = '';
  apellidos: string = '';
  formaPago: FormaPago;
  formaPagos: FormaPago[];
  metodoPago: MetodoPago;
  metodoPagos: MetodoPago[];
  regimenFiscal: RegimenFiscal;
  regimenFiscales: RegimenFiscal[];
  usoCFDI: UsoCFDI;
  usoCFDIs: UsoCFDI[];
  esPersonaMoral: Boolean = false;
  rfcLength: number = 13;

  cuponInput: string = '';

  constructor(
    private router: Router,
    private el: ElementRef,
    public activeRoute: ActivatedRoute,
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
    public chargeOpenpayService: ChargeOpenpayService,
    public cuponsService: CuponsService,
    public invoiceConfigsService: InvoiceConfigsService,
    public welcomesService: WelcomesService,
    private icommktsService: IcommktsService,
    private confirmationService: CheckoutExitConfirmationService
  ) {
    try {
      this.activeRoute.queryParams.subscribe(params => {
        if (params.id) {
          this.idTransaction = params.id;
        }
        if (params.idOrder) {
          this.idDelivery = params.idOrder;
        }
        this.loaded = true;
      });

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
                    this.router.navigate(['/cart']);
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
                    const deliveryId = this.generarNumeroAleatorioEncriptado();
                    // Generar Orden de Compra con Proveedores
                    const OrderSupplier = await this.sendOrderSupplier(id, deliveryId);
                    // Registrar Pedido en DARU.
                    OrderSupplier.cliente = OrderSupplier.user.email;
                    OrderSupplier.discount = parseFloat(this.discount);
                    OrderSupplier.importe = parseFloat(this.totalPagar);
                    const deliverySave = await this.deliverysService.add(OrderSupplier);
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
                      this.router.navigate(['/ofertas/list']);
                    }
                    // Si compra es OK, continua.
                    OrderSupplier[NewProperty] = sendEmail;
                    this.mailService.sendEmail(OrderSupplier, messageDelivery, '', internalEmail, this.totalEnvios, this.showFacturacion);
                    await infoEventAlert(messageDelivery, '', typeAlert);
                  } else {
                    await infoEventAlert('El Pedido no se ha realizado', result.message, TYPE_ALERT.WARNING);
                    this.router.navigate(['/cart']);
                  }
                });
            } else {
              this.router.navigate(['/cart']);
            }
          }, 3000);
        } else {
          basicAlert(TYPE_ALERT.ERROR, 'No hay datos de la tarjeta');
        }
      });
    } catch (error) {
      console.log('error: ', error);
    }
  }

  canDeactivate(): boolean {
    if (this.idDelivery !== undefined) {
      this.onSubmitCapture();
      return true;
    }
    this.confirmationService.setConfirmationStatus(true);
    return true;
  }

  //#region Metodos Componente
  ngOnInit(): void {
    try {
      console.clear();
      if (this.idDelivery) {                              // Validar si existe un delivery para recuperar
        const delivery = this.deliverysService.getDelivery(this.idDelivery).then(result => {
          if (result.delivery.delivery) {
            this.delivery = result.delivery.delivery;
            this.onSetDelivery(this.formData, result.delivery.delivery);
            const discount = parseFloat(result.delivery.delivery.discount);
            const totalEnvios = parseFloat(this.totalEnvios);
            this.cartService.priceTotal.subscribe(total => {
              this.totalPagar = (total - discount + totalEnvios).toFixed(2).toString();
            });
          }
          return result.delivery.delivery;
        });
      }
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

      this.formaPago = new FormaPago();
      this.metodoPago = new MetodoPago();
      this.regimenFiscal = new RegimenFiscal();
      this.usoCFDI = new UsoCFDI();

      this.authService.start();

      this.subscr = this.cartService.cartStream.subscribe(items => {
        this.cartItems = items;
      });

      document.querySelector('body').addEventListener('click', () => this.clearOpacity());

      this.formData = this.formBuilder.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        byCodigopostal: [false],
        codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{4,5}$/)]],
        selectCountry: ['', [Validators.required]],
        selectEstado: ['', [Validators.required]],
        selectMunicipio: ['', [Validators.required]],
        selectColonia: ['', Validators.required],
        directions: ['', Validators.required],
        outdoorNumber: ['', Validators.required],
        interiorNumber: [''],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        email: ['', [Validators.required, Validators.email]],
        crearcuenta: [false],
        references: [''],
        existeMetodoPago: [false],
        existePaqueteria: [false],
        token_id: ['']
      });

      this.formDataInvoice = this.formBuilder.group({
        factura: [false],
        rfc: ['', [Validators.required, this.validarLongitudRFC]],
        codigoPostalInvoice: ['', [Validators.required, Validators.pattern(/^\d{4,5}$/)]],
        nombresInvoice: ['', Validators.required],
        apellidos: ['', Validators.required],
        nombreEmpresa: ['', Validators.required],
        formaPago: ['04', Validators.required],
        metodoPago: ['PUE', Validators.required],
        regimenFiscal: ['612', Validators.required],
        usoCFDI: ['G03', Validators.required],
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

      // Para las facturas.
      this.invoiceConfigsService.getInvoiceConfig().then(async result => {
        this.formaPagos = result.formaPago;
        this.metodoPagos = result.metodoPago;
        this.regimenFiscales = result.regimenFiscal;
        this.usoCFDIs = result.usoCFDI;
        this.onChangeRegimenFiscal(null, '612');
        this.onChangeFormaPago(null, '04');
        this.onChangeMetodoPago(null, 'PUE');
        this.onChangeUsoCFDI(null, 'G03');
      });



      this.deviceDataId = OpenPay.deviceData.setup("formData", "token_id");
      OpenPay.setId('mbhvpztgt3rqse7zvxrc');
      OpenPay.setApiKey('pk_411efcdb08c148ceb97b36f146e42beb');
      OpenPay.setSandboxMode(true);

      // Observable para el cartItems
      this.cartService.cartItemsChanges$.subscribe((newValue) => {
        // Se ha producido un cambio en myVariable
        this.cartItems = newValue;
        this.onActiveCP(true);
      });

    } catch (error) {
      console.log('error: ', error);
    }
  }

  onAsignarNombres(event) {
    const nombres = $(event.target).val();
    const apellidos = this.formData.controls.lastname.value.toUpperCase();
    const holderName = document.getElementById('holder_name') as HTMLInputElement;
    if (holderName) {
      holderName.value = nombres + ' ' + apellidos;
      this.nameCard = nombres;
      this.lastNameCard = apellidos;
      this.formDataInvoice.controls.nombresInvoice.setValue(nombres);
      this.formDataInvoice.controls.apellidos.setValue(apellidos);
    }
  }

  onAsignarApellidos(event) {
    const nombres = this.formData.controls.name.value.toUpperCase();
    const apellidos = $(event.target).val();
    const holderName = document.getElementById('holder_name') as HTMLInputElement;
    if (holderName) {
      holderName.value = nombres + ' ' + apellidos;
      this.nameCard = nombres;
      this.lastNameCard = apellidos;
      this.formDataInvoice.controls.nombresInvoice.setValue(nombres);
      this.formDataInvoice.controls.apellidos.setValue(apellidos);
    }
  }

  onAsignarNombresCard(event) {
    const nombres = $(event.target).val();
    const holderName = document.getElementById('holder_name') as HTMLInputElement;
    if (holderName) {
      holderName.value = nombres + ' ' + this.lastNameCard;
      this.formDataInvoice.controls.nombresInvoice.setValue(nombres);
      this.formDataInvoice.controls.apellidos.setValue(this.lastNameCard);
    }
  }

  onAsignarApellidosCard(event) {
    const apellidos = $(event.target).val();
    const holderName = document.getElementById('holder_name') as HTMLInputElement;
    if (holderName) {
      holderName.value = this.nameCard + ' ' + apellidos;
      this.formDataInvoice.controls.nombresInvoice.setValue(this.nameCard);
      this.formDataInvoice.controls.apellidos.setValue(apellidos);
    }
  }

  validarLongitudRFC(control) {
    const rfc = control.value?.trim();
    if (rfc && (rfc.length === 12 || rfc.length === 13)) {
      return null;
    }
    return { longitudInvalida: true };
  }

  // Función de validación personalizada para la CLABE
  validateCLABE(control: AbstractControl): { [key: string]: boolean } | null {
    const clabeValue = control.value;
    // Remover espacios en blanco y guiones de la CLABE
    const clabeSinEspacios = clabeValue.replace(/\s|-/g, '');
    // Verificar si la CLABE tiene 18 dígitos
    if (clabeSinEspacios.length !== 18) {
      return { 'invalidCLABELength': true };
    }
    return null; // La validación es exitosa
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

  async tokenCardOpenpay(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      OpenPay.token.extractFormAndCreate(
        'payment-form',
        (response: any) => {
          this.isSubmitting = false;
          resolve(response);
        },
        (error: any) => {
          this.isSubmitting = false;
          const description = this.chargeOpenpayService.decodeError(error.data)
          infoEventAlert('No se puedo procesar el cargo.', description, TYPE_ALERT.ERROR);
          reject(error);
        }
      );
    });
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
              // Recuperar tokenCard
              if (this.numeroTarjetaFormateado === '') {
                this.isSubmitting = false;
                return await infoEventAlert('Verificar los datos de la Tarjeta de Credito.', '');
              }
              const tokenCard = await this.tokenCardOpenpay();
              if (!tokenCard) {
                this.isSubmitting = false;
                return await infoEventAlert('Error en la validacion de la Tarjeta. Intente mas tarde.', TYPE_ALERT.ERROR);
              }
              // Recuperar siguiente id
              const id = await this.deliverysService.next();
              const deliveryId = this.generarNumeroAleatorioEncriptado();
              if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                this.isSubmitting = false;
                return await infoEventAlert('Error en servicio interno (Next Id Delivery).', TYPE_ALERT.ERROR);
              }
              // Realizar Cargo con la Tarjeta
              const pagoOpenpay = await this.payOpenpay(tokenCard.data.id, deliveryId, this.formData);
              console.log('pagoOpenpay: ', pagoOpenpay);
              if (pagoOpenpay.status === false) {
                this.isSubmitting = false;
                return await infoEventAlert(pagoOpenpay.message, '', TYPE_ALERT.ERROR);
              }
              // Generar Orden de Compra con Proveedores
              const OrderSupplier = await this.sendOrderSupplier(id, deliveryId);
              console.log('OrderSupplier: ', OrderSupplier);
              if (OrderSupplier.statusError) {
                this.isSubmitting = false;
                return await infoEventAlert(OrderSupplier.messageError, '', TYPE_ALERT.ERROR);
              }
              // Registrar Pedido en DARU.
              OrderSupplier.cliente = OrderSupplier.user.email;
              OrderSupplier.discount = parseFloat(this.discount);
              OrderSupplier.importe = parseFloat(this.totalPagar);
              const deliverySave = await this.deliverysService.add(OrderSupplier);
              console.log('deliverySave: ', deliverySave);
              if (deliverySave.error) {
                this.isSubmitting = false;
                return await infoEventAlert(deliverySave.messageError, '', TYPE_ALERT.ERROR);
              }
              if (pagoOpenpay.createChargeOpenpay.payment_method.url) {
                window.location.href = pagoOpenpay.createChargeOpenpay.payment_method.url;
              }
              break;
            case PAY_TRANSFER:
              // Recuperar siguiente idT
              const idT = await this.deliverysService.next();
              if (!Number.isInteger(Number(idT)) || Number(idT) <= 0) {
                this.isSubmitting = false;
                return await infoEventAlert('Error en servicio interno (Next Id Delivery).', TYPE_ALERT.ERROR);
              }
              const deliveryIdT = this.generarNumeroAleatorioEncriptado();
              // Realizar Cargo con la Tarjeta
              const pagoOpenpayT = await this.payOpenpaySpei(deliveryIdT);
              if (pagoOpenpayT.status === false) {
                this.isSubmitting = false;
                return await infoEventAlert(pagoOpenpayT.message, '', TYPE_ALERT.ERROR);
              }
              // Generar Orden de Compra con Proveedores
              const OrderSupplierT = await this.sendOrderSupplier(idT, deliveryIdT);
              if (OrderSupplierT.error) {
                this.isSubmitting = false;
                return await infoEventAlert(OrderSupplierT.messageError, '', TYPE_ALERT.ERROR);
              }
              // Registrar Pedido en DARU.
              OrderSupplierT.cliente = OrderSupplierT.user.email;
              OrderSupplierT.discount = parseFloat(this.discount);
              OrderSupplierT.importe = parseFloat(this.totalPagar);
              const deliverySaveT = await this.deliverysService.add(OrderSupplierT);
              if (deliverySaveT.error) {
                this.isSubmitting = false;
                return await infoEventAlert(deliverySaveT.messageError, '', TYPE_ALERT.ERROR);
              }
              const NewPropertyT = 'receipt_email';
              let internalEmailT = false;
              let typeAlertT = TYPE_ALERT.SUCCESS;
              let sendEmailT = OrderSupplierT.user.email;
              let messageDeliveryT = 'El Pedido se ha realizado correctamente';
              if (OrderSupplierT.statusError) {
                internalEmailT = true;
                this.isSubmitting = false;
                typeAlertT = TYPE_ALERT.WARNING;
                sendEmailT = 'marketing@daru.mx';
                messageDeliveryT = OrderSupplierT.messageError;
              } else {
                this.cartService.clearCart(false);
                this.router.navigate(['/ofertas/list']);
              }
              // Si compra es OK, continua.
              OrderSupplierT[NewPropertyT] = sendEmailT;
              this.mailService.sendEmailSpei(OrderSupplierT, messageDeliveryT, '', internalEmailT, this.totalEnvios);
              await infoEventAlert(messageDeliveryT, '', typeAlertT);
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

  async onSubmitCapture(): Promise<any> {
    if (!this.isSubmittingCapture) {
      this.isSubmittingCapture = true;
      if (!this.idDelivery) {
        this.isSubmitting = false;
        return await infoEventAlert('No se encuentra el parametro: idOrder.', '');
      }
      if (!this.idTransaction) {
        this.isSubmitting = false;
        return await infoEventAlert('No se encuentra el parametro: id.', '');
      }

      const deliverySave = this.delivery;

      // Limpiar carrito de compras.
      this.cartService.clearCart(false);

      // Enviar correo
      const NewProperty = 'receipt_email';
      let internalEmail = false;
      let typeAlert = TYPE_ALERT.SUCCESS;
      let sendEmail = this.delivery.user.email;
      let messageDelivery = 'El Pedido se ha realizado correctamente';

      // Si compra es OK, continua.
      deliverySave[NewProperty] = sendEmail;
      this.mailService.sendEmail(deliverySave, messageDelivery, '', internalEmail, this.totalEnvios, this.showFacturacion);
      this.router.navigate(['/dashboard']);

      await infoEventAlert(messageDelivery, '', typeAlert);
    } else {
      console.log('onSubmitCapture/this.isSubmittingCapture');
    }
  }

  ngOnDestroy(): void {
    this.subscr.unsubscribe();
    document.querySelector('body').removeEventListener('click', () => this.clearOpacity());
    this.confirmationService.resetConfirmationStatus();
  }
  //#endregion Metodos Componentes

  //#region Metodos
  onSetDelivery(formData: FormGroup, delivery: Delivery) {
    this.formData.controls.name.setValue(delivery.user.name);
    this.formData.controls.lastname.setValue(delivery.user.lastname);
    this.formData.controls.phone.setValue(delivery.user.phone);
    this.formData.controls.email.setValue(delivery.user.email);
    this.formData.controls.codigoPostal.setValue(delivery.user.addresses[0].d_codigo);
    this.formData.controls.selectCountry.setValue(delivery.user.addresses[0].c_pais);
    this.selectCountry.c_pais = delivery.user.addresses[0].c_pais;
    this.selectCountry.d_pais = delivery.user.addresses[0].d_pais;
    this.formData.controls.selectEstado.setValue(delivery.user.addresses[0].c_estado);
    this.selectEstado.c_estado = delivery.user.addresses[0].c_estado;
    this.selectEstado.d_estado = delivery.user.addresses[0].d_estado;
    this.formData.controls.selectMunicipio.setValue(delivery.user.addresses[0].c_mnpio);
    this.selectMunicipio.c_mnpio = delivery.user.addresses[0].c_mnpio;
    this.selectMunicipio.D_mnpio = delivery.user.addresses[0].d_mnpio;
    this.formData.controls.selectColonia.setValue(delivery.user.addresses[0].d_asenta);
    this.selectColonia = delivery.user.addresses[0].d_asenta;
    this.formData.controls.directions.setValue(delivery.user.addresses[0].directions);
    this.formData.controls.outdoorNumber.setValue(delivery.user.addresses[0].outdoorNumber);
    this.formData.controls.interiorNumber.setValue(delivery.user.addresses[0].interiorNumber);
    this.formData.controls.references.setValue(delivery.user.addresses[0].references);
    if (!this.shipments || this.shipments.length <= 0) {
      this.shipments = [];
      for (const idS of Object.keys(delivery.warehouses[0].shipments)) {
        const ship: Shipment = delivery.warehouses[0].shipments[idS];
        ship.lugarRecepcion = this.selectEstado.d_estado.toLocaleUpperCase();
        this.shipments.push(ship);
      }
    }
    if (!this.cartItems || this.cartItems.length <= 0) {
      this.cartItems = [];
      for (const idC of Object.keys(delivery.warehouses[0].products)) {
        const cartItem: CartItem = delivery.warehouses[0].products[idC];
        this.cartItems.push(cartItem);
      }
    }
    let totalShips = 0.0;
    for (const idS of Object.keys(this.shipments)) {
      const ships: Shipment = this.shipments[idS];
      totalShips += ships.costo;
    }
    this.totalEnvios = totalShips.toFixed(2).toString();
    this.discount = delivery.discount.toString();
    this.changeShipping(totalShips);
  }

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

  onSetInvoiceConfig(formData: FormGroup): InvoiceConfigInput {
    const invoice = new InvoiceConfigInput();
    invoice.factura = this.showFacturacion;
    invoice.nombres = this.showFacturacion ? formData.controls.nombresInvoice.value : "";
    invoice.apellidos = this.showFacturacion ? formData.controls.apellidos.value : "";
    invoice.nombreEmpresa = this.showFacturacion ? formData.controls.nombreEmpresa.value : "";
    invoice.rfc = this.showFacturacion ? formData.controls.rfc.value : "";
    invoice.codigoPostal = this.showFacturacion ? formData.controls.codigoPostalInvoice.value : "";
    invoice.formaPago = this.showFacturacion ? this.formaPago : { id: '', descripcion: '' };
    invoice.metodoPago = this.showFacturacion ? this.metodoPago : { id: '', descripcion: '', fechaInicioDeVigencia: '', fechaFinDeVigencia: '' };
    invoice.regimenFiscal = this.showFacturacion ? this.regimenFiscal : { id: '', descripcion: '', fisica: "", moral: "" };
    invoice.usoCFDI = this.showFacturacion ? this.usoCFDI : { id: '', descripcion: '', aplicaParaTipoPersonaFisica: "", aplicaParaTipoPersonaMoral: "" };
    return invoice;
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
          if (this.shipments.length <= 0) {
            infoEventAlert('Hay un problema con las paqueterias para el envio. Intentar más tarde.', '');
          }
        } else {
          infoEventAlert('El código postal no es correcto.', '');
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

  // Define una función para encontrar sucursales que puedan surtir productos
  findBranchOfficesForProducts(products: CartItem[]): any[] {
    try {
      // Crear un objeto que mapee branchOffices a las cantidades disponibles
      const branchOfficeQtyMap = {};

      // Inicializar el mapeo de cantidades por sucursal
      products.forEach(product => {
        product.suppliersProd.branchOffices.forEach(branchOffice => {
          if (!branchOfficeQtyMap[branchOffice.id]) {
            branchOfficeQtyMap[branchOffice.id] = {};
          }
          branchOfficeQtyMap[branchOffice.id][product.sku] = branchOffice.cantidad;
        });
      });

      // Calcular las cantidades requeridas para cada SKU
      const requiredQuantities = {};
      products.forEach(product => {
        requiredQuantities[product.sku] = requiredQuantities[product.sku] || 0;
        requiredQuantities[product.sku] += product.qty;
      });

      // Encontrar sucursales que pueden surtir todos los productos
      const optimalBranchOffices = [];

      // Función auxiliar para verificar si una sucursal puede surtir todos los productos
      function canFulfill(branchId) {
        const branchQtyMap = branchOfficeQtyMap[branchId];
        for (const sku in requiredQuantities) {
          if (!branchQtyMap[sku] || branchQtyMap[sku] < requiredQuantities[sku]) {
            return false;
          }
        }
        return true;
      }

      // Buscar una sucursal que pueda surtir todos los productos
      for (const branchId in branchOfficeQtyMap) {
        if (canFulfill(branchId)) {
          optimalBranchOffices.push(branchId);
          return optimalBranchOffices;
        }
      }

      // Si no se encontró una sola sucursal que pueda surtir todo, buscar hasta cinco sucursales
      const allBranches = Object.keys(branchOfficeQtyMap);
      for (let i = 1; i <= 5; i++) {
        for (const branchCombination of this.getCombinations(allBranches, i)) {
          const canFulfillAll = branchCombination.every(branchId => canFulfill(branchId));
          if (canFulfillAll) {
            return branchCombination;
          }
        }
      }

      // Si no se encontraron cinco sucursales, separar el producto que no pueda surtirse
      return this.separateUnfulfilledProduct(products, branchOfficeQtyMap);
    } catch (error) {
      console.error('error: ', error);
      return [];
    }
  }

  // Función para obtener todas las combinaciones de una lista dada
  getCombinations(arr, k) {
    const result = [];
    function backtrack(start, current) {
      if (current.length === k) {
        result.push(current.slice());
        return;
      }
      for (let i = start; i < arr.length; i++) {
        current.push(arr[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    }
    backtrack(0, []);
    return result;
  }

  // Función para separar un producto que no pueda surtirse
  separateUnfulfilledProduct(products, branchOfficeQtyMap) {
    // Ordenar productos por cantidad requerida en orden descendente
    products.sort((a, b) => b.qty - a.qty);

    // Inicializar un arreglo para las sucursales que pueden surtir el producto
    const branchOfficesForUnfulfilledProduct = [];

    // Intentar separar el producto con mayor cantidad requerida
    for (const product of products) {
      const branchId = this.findBranchOfficeForProduct(product, branchOfficeQtyMap);
      if (branchId) {
        branchOfficesForUnfulfilledProduct.push(branchId);
      } else {
        // Si no se puede surtir el producto, devolver el SKU del producto
        return [product.sku];
      }
    }

    // Devolver las sucursales que pueden surtir el producto
    return branchOfficesForUnfulfilledProduct;
  }

  // Función para verificar si se puede separar un producto de las sucursales
  canSeparateProduct(product, branchOfficeQtyMap) {
    const requiredQuantity = product.qty;
    for (const branchId in branchOfficeQtyMap) {
      if (branchOfficeQtyMap[branchId][product.sku] >= requiredQuantity) {
        return true;
      }
    }
    return false;
  }

  // Función para encontrar una sucursal que pueda surtir un producto
  findBranchOfficeForProduct(product, branchOfficeQtyMap) {
    const requiredQuantity = product.qty;
    for (const branchId in branchOfficeQtyMap) {
      if (branchOfficeQtyMap[branchId][product.sku] >= requiredQuantity) {
        return branchId;
      }
    }
    return null; // Devolver null si no se puede surtir el producto
  }

  /**
   *
   * @param cpDestino Codigo Postal a donde llegara el pedido
   * @param estadoCp Codigo postal predeterminado.
   * @returns Datos de la(s) paqueteria(s) del proveedor
   */
  async onCotizarEnvios(cpDestino: string, estadoCp: string): Promise<any> {
    try {
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
            const cartItemsWithNull = arreglo.map(item => ({
              ...item,
              assignedBranchId: null
            }));
            const carItemsSupplier = cartItemsWithNull.filter((item) => item.suppliersProd.idProveedor === supplier.slug);
            if (carItemsSupplier.length > 0) {
              // Buscar todos los branchOffice de los productos.
              const branchOfficesCom = this.findBranchOfficesForProducts(carItemsSupplier);
              this.commonBranchOffices.clear();
              branchOfficesCom.forEach((sucursal) => this.commonBranchOffices.add(sucursal));
              // Se guardan las sucursales comunes para los envios.
              let branchOfficesTot: BranchOffices[] = [];
              let addedBranchOffices = new Set<string>(); // Conjunto para rastrear branchOffices agregados
              for (const cart of this.cartItems) {
                for (const bran of cart.suppliersProd.branchOffices) {
                  if (this.commonBranchOffices.has(bran.id) && !addedBranchOffices.has(bran.id)) {
                    branchOfficesTot.push(bran);
                    addedBranchOffices.add(bran.id); // Agregar el branchOffice al conjunto de seguimiento
                  }
                }
              }
              const commonBranchOffices = branchOfficesTot;
              for (const commonBranch of commonBranchOffices) {
                const carItemsWarehouse = [];
                const shipmentsSupp = [];
                // Filtrar los elementos que no han sido asignados
                const carItemsWithoutAssignedBranch = cartItemsWithNull.filter((item) => item.assignedBranchId !== true);
                // const carItemsWithoutAssignedBranch = arreglo.filter((item) => item.assignedBranchId !== true);
                const carItemsSupplierByBranchOffice = carItemsWithoutAssignedBranch.filter((item) =>
                  item.suppliersProd.branchOffices.some((branchOffice) => branchOffice.id === commonBranch.id)
                );
                const productsNacional: ProductShipment[] = [];
                const warehouseNacional = new Warehouse();

                for (const idCI of Object.keys(carItemsSupplierByBranchOffice)) {
                  const cartItem: CartItem = carItemsSupplierByBranchOffice[idCI];
                  // Marcar cartItem como asignado
                  const elementoEncontrado = cartItemsWithNull.find((item) => item.sku === cartItem.sku);
                  if (elementoEncontrado) {
                    // Cambia el valor de 'assignedBranchId' para el elemento encontrado
                    elementoEncontrado.assignedBranchId = true;
                  }

                  const productShipment = new ProductShipment();
                  productShipment.producto = cartItem.sku;
                  productShipment.cantidad = cartItem.qty;
                  productShipment.precio = cartItem.price;
                  if (cartItem.promociones && cartItem.promociones.disponible_en_promocion) {
                    productShipment.priceSupplier = cartItem.promociones.disponible_en_promocion;
                  } else {
                    productShipment.priceSupplier = cartItem.suppliersProd.price;
                  }
                  productShipment.moneda = cartItem.suppliersProd.moneda;
                  productShipment.almacen = commonBranch.id; // Utilizar el almacén común
                  productShipment.cp = commonBranch.cp;
                  productShipment.name = cartItem.name;
                  productShipment.total = cartItem.qty * cartItem.price;
                  productsNacional.push(productShipment);
                  warehouseNacional.id = commonBranch.id;
                  warehouseNacional.cp = commonBranch.cp;
                  warehouseNacional.name = commonBranch.name;
                  warehouseNacional.estado = commonBranch.estado;
                  warehouseNacional.latitud = commonBranch.latitud;
                  warehouseNacional.longitud = commonBranch.longitud;
                  this.warehouse = warehouseNacional;
                  this.warehouse.productShipments = productsNacional;
                  carItemsWarehouse.push(cartItem);
                }
                this.warehouse.cp = cpDestino;
                this.warehouse.productShipments = productsNacional;
                const shipmentsCost = await this.externalAuthService.onShippingEstimate(
                  supplier, apiShipment, this.warehouse, true
                ).then(async (resultShip) => {
                  if (!resultShip.status) {
                    console.log(`Error: ${resultShip.message}`);
                    infoEventAlert('Hoy no es tu dia, tengo problemas con el envio. Intenta mas tarde', '', TYPE_ALERT.ERROR);
                  }
                  let shipment = new Shipment();
                  for (const key of Object.keys(resultShip.data)) {
                    if (supplier.slug === 'ct') {
                      shipment.empresa = resultShip.data[key].empresa.toString();
                      shipment.costo = resultShip.data[key].total;
                      shipment.metodoShipping = resultShip.data[key].metodo;
                      shipment.lugarEnvio = resultShip.data[key].lugarEnvio.toLocaleUpperCase();
                      shipment.lugarRecepcion = this.selectEstado.d_estado.toLocaleUpperCase();
                    } else if (supplier.slug === 'cva') {
                      shipment.empresa = resultShip.data.empresa.toString();
                      shipment.costo = resultShip.data.costo;
                      shipment.metodoShipping = resultShip.data.metodoShipping;
                      shipment.lugarEnvio = resultShip.data.lugarEnvio.toLocaleUpperCase();
                      shipment.lugarRecepcion = this.selectEstado.d_estado.toLocaleUpperCase();
                    }
                  }
                  return await shipment;
                });
                shipmentsEnd.push(shipmentsCost);
                this.warehouse.shipments = shipmentsEnd;
                supplierProd.idProveedor = supplier.slug;
                this.warehouse.suppliersProd = supplierProd;
                this.warehouse.products = carItemsWarehouse;
                this.warehouses.push(this.warehouse);
              }
            }
          }
        }
      }
      return await shipmentsEnd;
    } catch (error) {
      console.error('error: ', error);
      return [];
    }
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
    let discountI = 0;
    let deliveryI = 0;
    this.existePaqueteria = true;
    if (this.cupon) {
      this.cartService.priceTotal.subscribe(total => {
        this.totalPagar = (total).toFixed(2).toString();
      });
      const discountPorc = this.cupon.amountDiscount;
      const discountImporte = this.cupon.amountDiscount;
      if (this.cupon.typeDiscount === 'importe') {
        discountI = discountImporte;
      } else {
        discountI = (parseFloat(this.totalPagar) * discountPorc / 100);
      }
      this.discount = discountI.toFixed(2).toString();
    }
    if (costo) {
      deliveryI = costo;
      this.totalEnvios = costo.toFixed(2).toString();
      this.cartService.priceTotal.subscribe(total => {
        this.totalPagar = (total - discountI + deliveryI).toFixed(2).toString();
      });
    }
  }

  changeDiscount(discountPorc: number): void {
    let discountI = 0;
    let deliveryI = 0;
    if (this.totalEnvios) {
      deliveryI = parseFloat(this.totalEnvios);
    }
    if (this.cupon) {
      if (this.cupon.typeDiscount === 'importe') {
        discountI = this.cupon.amountDiscount;
      } else {
        discountI = (parseFloat(this.totalPagar) * discountPorc / 100);
      }
      this.discount = discountI.toFixed(2).toString();
      this.cartService.priceTotal.subscribe(total => {
        this.totalPagar = (total - discountI + deliveryI).toFixed(2).toString();
      });
    }
  }

  convertToUppercase(event: any) {
    let inputValue = event.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    event.target.value = inputValue;
  }

  convertToUppercaseRFC(event: any) {
    let inputValue = event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    event.target.value = inputValue;
  }

  convertToUppercaseCupon(event: any) {
    let inputValue = event.target.value.toUpperCase();
    // Eliminar caracteres no válidos
    inputValue = inputValue.replace(/[^A-Z0-9]/g, '');
    // Limitar a 11 caracteres alfanuméricos
    if (inputValue.length > 15) {
      inputValue = inputValue.slice(0, 15);
    }
    event.target.value = inputValue;
  }

  async validateDiscount(event: any): Promise<void> {
    const inputValue = event.target.value.toUpperCase();
    const cupon = await this.cuponsService.getCupon(inputValue)  // Recuperar el descuento del cupon.
      .then(async result => {
        return await result.cupon;
      });
    let discountPorc = 0;
    this.discountPorc = "0";
    if (cupon) {
      cupon.active = false;
      this.cupon = cupon;
      const email = this.formData.controls.email.value;
      this.typeDiscount = cupon.typeDiscount;
      const totalCharge = parseFloat(this.totalPagar);
      if (this.cupon.minimumPurchase > totalCharge) {
        const msj = `Para que utilices tu cupon se requiere esta cantidad minima: ${this.cupon.minimumPurchase.toFixed(2).toString()}`
        infoEventAlert(msj, '');
        this.discount = '';
        this.cuponInput = '';
        this.cartService.priceTotal.subscribe(total => {
          this.totalPagar = (total).toFixed(2).toString();
        });
        this.cupon = new Cupon();
        return;
      }
      if (email === '') {
        infoEventAlert('Para que utilices tu cupon se requiere el correo electronico donde llego.', '');
        return;
      }
      const icommktContact = await this.icommktsService.getIcommktContact(email);
      if (icommktContact && icommktContact.icommktContact) {
        if (!icommktContact.status) {
          console.log('icommktContact.messaje: ', icommktContact.message);
          return;
        }
        const welcome = await this.welcomesService.getWelcome(email);
        console.log('welcome: ', welcome);
        if (!welcome.status) {
          console.log('welcome.messaje: ', welcome.message);
          return;
        }
        if (welcome && welcome.welcome && !welcome.welcome.active) {
          const mensaje = `El cupon: ${this.cupon.cupon} ya ha sido ocupado.`
          infoEventAlert(mensaje, '');
          this.discount = '';
          this.cuponInput = '';
          this.cartService.priceTotal.subscribe(total => {
            this.totalPagar = (total).toFixed(2).toString();
          });
          this.cupon = new Cupon();
          return;
        }
        discountPorc = discountPorc ? this.cupon.amountDiscount : 0;
        this.discountPorc = discountPorc.toString();
      } else {
        infoEventAlert('Lo siento este cupon ligado a este email no lo reconozco.', '');
        this.discount = '';
        this.cuponInput = '';
        this.cartService.priceTotal.subscribe(total => {
          this.totalPagar = (total).toFixed(2).toString();
        });
        this.cupon = new Cupon();
        return;
      }
    } else {
      if (inputValue !== '') {
        infoEventAlert('Lo siento este código no lo reconozco.', '');
        event.target.value = '';
        this.discount = '';
        this.cuponInput = '';
        this.cartService.priceTotal.subscribe(total => {
          this.totalPagar = (total).toFixed(2).toString();
        });
        this.cupon = new Cupon();
        return;
      }
    }
    this.changeDiscount(discountPorc);
  }

  async validateDiscountByEmail(event: any): Promise<void> {
    const cuponInput = this.cuponInput.toLocaleUpperCase();
    if (cuponInput !== '') {
      const cupon = await this.cuponsService.getCupon(cuponInput)  // Recuperar el descuento del cupon.
        .then(async result => {
          return await result.cupon;
        });
      let discountPorc = 0;
      this.discountPorc = "0";
      if (cupon) {
        cupon.active = false;
        const email = event.target.value;
        // Buscar contacto en icommkt
        const icommktContact = await this.icommktsService.getIcommktContact(email);
        if (icommktContact && icommktContact.icommktContact) {
          if (!icommktContact.status) {
            console.log('icommktContact.messaje: ', icommktContact.message);
            return;
          }
          // Buscar si ya se ocupo el cupon.
          const welcome = await this.welcomesService.getWelcome(email);
          if (welcome && welcome.status && !welcome.welcome.active) {
            const mensaje = `El cupon: ${this.cupon.cupon} ya ha sido ocupado.`
            infoEventAlert(mensaje, '');
            this.discount = '';
            this.cuponInput = '';
            this.cartService.priceTotal.subscribe(total => {
              this.totalPagar = (total).toFixed(2).toString();
            });
            this.cupon = new Cupon();
            return;
          }
          this.cupon = cupon;
          this.typeDiscount = cupon.typeDiscount;
          discountPorc = cupon.amountDiscount;
          this.discountPorc = cupon.amountDiscount.toString();
        } else {
          infoEventAlert('Lo siento este cupon ligado a este email no lo reconozco.', '');
          this.discount = '';
          this.cuponInput = '';
          this.cartService.priceTotal.subscribe(total => {
            this.totalPagar = (total).toFixed(2).toString();
          });
          this.cupon = new Cupon();
          return;
        }
      } else {
        infoEventAlert('Lo siento este cupon ligado a este email no lo reconozco.', '');
        this.discount = '';
        this.cuponInput = '';
        this.cartService.priceTotal.subscribe(total => {
          this.totalPagar = (total).toFixed(2).toString();
        });
        this.cupon = new Cupon();
        return;
      }
      this.changeDiscount(discountPorc);
    }
  }

  async onHabilitaPago(payMent: string): Promise<void> {
    this.typePay = payMent;
    this.existeMetodoPago = true;
  }

  onHabilitarFactura() {

  }

  onActiveCP(byCodigopostal: boolean = false): void {
    if (byCodigopostal) {
      this.byCodigopostal = false;
    } else {
      this.byCodigopostal = !this.byCodigopostal;
    }
    this.isChecked = this.byCodigopostal;
    this.selectCountry = new Country();
    this.selectEstado = new Estado();
    this.selectMunicipio = new Municipio();
    this.formData.controls.codigoPostal.setValue('');
    this.formData.controls.selectCountry.setValue('');
    this.formData.controls.selectEstado.setValue('');
    this.formData.controls.selectMunicipio.setValue('');
    this.shipments = [];
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
    const numeroAleatorio = Math.floor(Math.random() * 1000000);      // Paso 1: Generar un número aleatorio entre 0 y 999999
    const numeroEnCadena = numeroAleatorio.toString();                // Paso 2: Convertir el número en una cadena
    const claveEncriptacion = environment.KEY_SECRET;                 //          Reemplaza esto con una clave segura
    const iv = crypto.lib.WordArray.random(16);                       //          Generar un vector de inicialización aleatorio
    const encrypted = crypto.AES.encrypt(                             // Paso 3: Encriptar la cadena utilizando AES de crypto
      numeroEnCadena, claveEncriptacion, { iv: iv }
    );
    const resultadoEncriptado = encrypted.toString().slice(0, 32);    // Truncar o recortar el resultado del cifrado a 32 caracteres
    const resultadoEncriptado32 = resultadoEncriptado.replace(/[^a-zA-Z0-9]/g, '');   // Quitar cualquier carácter que no sea letra o número
    return resultadoEncriptado32;
  }

  // Método para formatear el número de tarjeta de crédito
  formatearNumeroTarjeta(numeroTarjetaSinFormato: string) {
    // Remover los espacios en blanco y guiones del número sin formato
    const numeroSinEspacios = numeroTarjetaSinFormato.replace(/\s|-/g, '');
    // Limitar la longitud a 16 caracteres
    const numeroLimitado = numeroSinEspacios.slice(0, 16);
    // Aplicar el formato "4444-4444-4444-4444"
    const regex = /(\d{4})(\d{4})(\d{4})(\d{4})/;
    const grupos = regex.exec(numeroLimitado);
    if (grupos) {
      // const numeroFormateado = `${grupos[1]}-${grupos[2]}-${grupos[3]}-${grupos[4]}`;
      const numeroFormateado = `${grupos[1]}${grupos[2]}${grupos[3]}${grupos[4]}`;
      // Actualizar el valor en el campo de entrada (si es necesario)
      const cardNumberInput = document.getElementById('card_number') as HTMLInputElement;
      if (cardNumberInput) {
        cardNumberInput.value = numeroFormateado;
      }
      // Almacenar el número formateado
      this.numeroTarjetaFormateado = numeroFormateado;
    } else {
      this.numeroTarjetaFormateado = '';
    }
  }

  // Método para formatear la CLABE bancaria
  formatearCLABE(clabeSinFormato: string) {
    // Remover los espacios en blanco y guiones de la CLABE sin formato
    const clabeSinEspacios = clabeSinFormato.replace(/\s|-/g, '');
    // Aplicar el formato 4 dígitos - 2 dígitos - 10 dígitos - 2 dígitos
    const regex = /(\d{4})(\d{2})(\d{10})(\d{2})/;
    const grupos = regex.exec(clabeSinEspacios);
    if (grupos) {
      this.numeroClabeFormateada = `${grupos[1]}-${grupos[2]}-${grupos[3]}-${grupos[4]}`;
    } else {
      this.numeroClabeFormateada = '';
    }
  }

  bloquearLetras(event: Event) {
    // Obtener el valor actual del input
    const valorInput = (event.target as HTMLInputElement).value;
    // Reemplazar cualquier caracter que no sea número con una cadena vacía
    const valorNumerico = valorInput.replace(/[^0-9]/g, '');
    // Asignar el valor numérico de vuelta al campo de entrada
    (event.target as HTMLInputElement).value = valorNumerico;
  }

  async payOpenpayCapture(idChargeOpenpay: string, amount: number): Promise<any> {
    const captureTransactionOpenpay = { amount }
    console.log(`idChargeOpenpay: ${idChargeOpenpay}, amount: ${amount}`)
    const createResult = await this.chargeOpenpayService.captureCharge(idChargeOpenpay, captureTransactionOpenpay);
    if (createResult.status === false) {
      return { status: createResult.status, message: createResult.message };
    }
    return await createResult;
  }

  async payOpenpay(token: string, orderUniqueId: string, formData: FormGroup): Promise<any> {
    const totalCharge = parseFloat(this.totalPagar);

    const charge: ChargeOpenpayInput = new ChargeOpenpayInput();
    charge.method = "card";
    charge.source_id = token;
    charge.amount = totalCharge;
    charge.currency = "MXN";
    charge.description = "Cargo de prueba";
    charge.order_id = orderUniqueId;
    charge.device_session_id = this.deviceDataId;
    charge.capture = true;

    const customer: CustomerOpenpayInput = new CustomerOpenpayInput();
    customer.external_id = orderUniqueId;
    customer.name = formData.controls.name.value;
    customer.last_name = formData.controls.lastname.value;
    customer.email = formData.controls.email.value;
    customer.phone_number = formData.controls.phone.value;
    customer.clabe = "";

    const address: AddressOpenpayInput = new AddressOpenpayInput();
    address.line1 = formData.controls.directions.value + ' ' + formData.controls.outdoorNumber.value;
    address.line2 = formData.controls.selectColonia.value;
    address.line3 = formData.controls.references.value;
    address.postal_code = formData.controls.codigoPostal.value.padStart(5, '0');
    address.city = this.selectMunicipio.D_mnpio;
    address.state = this.selectEstado.d_estado;
    address.country_code = "MX";
    customer.address = address;

    charge.customer = customer;
    charge.send_email = true;
    // =========================> OJO - Cambiar ruta al publicar <==============================
    charge.redirect_url = "https://qa.daru.mx/checkout?idOrder=" + orderUniqueId;
    charge.use_3d_secure = true;
    charge.confirm = true;

    const chargeResult = await this.chargeOpenpayService.createCharge(charge);
    if (chargeResult.status === false) {
      return { status: chargeResult.status, message: chargeResult.message };
    }

    return await chargeResult;
  }

  async payOpenpaySpei(orderUniqueId: string): Promise<any> {
    const totalCharge = parseFloat(this.totalPagar);

    const charge: ChargeOpenpayInput = new ChargeOpenpayInput();
    charge.method = "bank_account";
    charge.amount = totalCharge;
    charge.description = "Cargo de prueba";
    charge.order_id = orderUniqueId;
    charge.device_session_id = this.deviceDataId;

    const customer: CustomerOpenpayInput = new CustomerOpenpayInput();
    customer.external_id = orderUniqueId;
    customer.name = this.formData.controls.name.value;
    // customer.last_name = this.formData.controls.lastname.value;
    // customer.email = this.formData.controls.email.value;
    customer.phone_number = this.formData.controls.phone.value;
    customer.clabe = "";

    const address: AddressOpenpayInput = new AddressOpenpayInput();
    address.line1 = this.formData.controls.directions.value + ' ' + this.formData.controls.outdoorNumber.value;
    address.line2 = this.formData.controls.selectColonia.value;
    address.line3 = this.formData.controls.references.value;
    address.postal_code = this.formData.controls.codigoPostal.value.padStart(5, '0');
    address.city = this.selectMunicipio.D_mnpio;
    address.state = this.selectEstado.d_estado;
    address.country_code = "MX";
    customer.address = address;

    charge.customer = customer;

    const chargeResult = await this.chargeOpenpayService.createCharge(charge);
    if (chargeResult.status === false) {
      return { status: chargeResult.status, message: chargeResult.message };
    }
    return await chargeResult;
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
        envioCt.codigoPostal = dir.d_codigo.padStart(5, '0');
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
        envioCva.codigoPostal = dir.d_codigo.padStart(5, '0'),
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
        let estado;
        let ciudad;
        if (ciudadesCVA.length > 0) {
          estado = ciudadesCVA.find(
            result => this.quitarAcentos(result.estado.toUpperCase()) === this.quitarAcentos(dir.d_estado.toUpperCase())
          ).id;
          ciudad = ciudadesCVA.find(
            city => city.ciudad.toUpperCase() === dir.d_mnpio.toUpperCase()
          ).clave;
        }
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

  async sendOrderSupplier(id: string, deliveryId: string): Promise<any> {
    const delivery = new Delivery();
    delivery.id = id;
    delivery.deliveryId = deliveryId;
    delivery.cliente = '';
    delivery.discount = 0;
    delivery.importe = 0;
    delivery.statusError = false;
    delivery.messageError = '';
    delivery.user = this.onSetUser(this.formData, this.stripeCustomer);
    delivery.invoiceConfig = this.onSetInvoiceConfig(this.formDataInvoice);

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
    if (this.cupon) {
      delivery.cupon = this.cupon;
    }
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
            if (orderNew.estatus === 'Mal Pedido') {
              orderCtResponse = orderNew;
              delivery.ordersCt = [];
              delivery.orderCtResponse = orderCtResponse;
              const orderCtConfirm: OrderCtConfirm = new OrderCtConfirm();
              orderCtConfirm.folio = 'NA';
              break;
            }
            orderCtResponse = orderNew;
            delivery.ordersCt = ordersCt;
            delivery.orderCtResponse = orderCtResponse;
            const orderCtConfirm: OrderCtConfirm = new OrderCtConfirm();
            orderCtConfirm.folio = orderNew.pedidoWeb;
            const confirmarPedidoCt = await this.externalAuthService.confirmOrderCt(orderCtConfirm.folio);
            const ctConfirmResponse: OrderCtConfirmResponse = {
              okCode: confirmarPedidoCt.confirmOrderCt.okCode.toString(),
              okMessage: confirmarPedidoCt.confirmOrderCt.okMessage,
              okReference: confirmarPedidoCt.confirmOrderCt.okReference
            };
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
        // Agregar datos de facturas
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
              if (!resultPedido.orderCt) {                              // Hay error en el pedido.
                const ctResponse: OrderCtResponse = new OrderCtResponse();
                ctResponse.estatus = 'Mal Pedido';
                ctResponse.fecha = new Date(Date.now()).toString();
                ctResponse.pedidoWeb = '';
                ctResponse.tipoDeCambio = 0;
                let errorCT: ErroresCT = new ErroresCT();
                let erroresCT: ErroresCT[] = [];
                errorCT.errorCode = '999999';
                errorCT.errorMessage = resultPedido.message;
                errorCT.errorReference = '';
                erroresCT.push(errorCT);
                ctResponse.errores = erroresCT;
                return await ctResponse;
              }
              const ctResponse: OrderCtResponse = new OrderCtResponse();
              ctResponse.estatus = resultPedido.orderCt.estatus;
              ctResponse.fecha = resultPedido.orderCt.fecha;
              ctResponse.pedidoWeb = resultPedido.orderCt.pedidoWeb;
              ctResponse.tipoDeCambio = resultPedido.orderCt.tipoDeCambio;
              ctResponse.errores = resultPedido.orderCt.errores;
              return await ctResponse;
            } catch (error) {
              console.log('error: ', error);
              throw await error;
            }
          });
        return await pedidosCt;
    }

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
                  ctResponse.fecha = ''; // new Date(Date.now()).toString();
                  ctResponse.pedidoWeb = '';
                  ctResponse.tipoDeCambio = 0;
                  let errorCT: ErroresCT = new ErroresCT();
                  let erroresCT: ErroresCT[] = [];
                  errorCT.errorCode = '999999';
                  errorCT.errorMessage = resultPedido.message;
                  errorCT.errorReference = '';
                  erroresCT.push(errorCT);
                  ctResponse.errores = erroresCT;
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

  //#region Facturas
  onChangeRegimenFiscal(event: any = null, val: string = null) {
    const selectedValue = val || (event.target.value.split(':', 2)[1].trim() ?? '');
    const regimenFiscal = this.regimenFiscales.find(item => item.id === selectedValue);
    if (regimenFiscal) {
      this.regimenFiscal.id = regimenFiscal.id;
      this.regimenFiscal.descripcion = regimenFiscal.descripcion;
    }
    this.esPersonaMoral = regimenFiscal?.moral === 'Sí' ?? false;
    this.rfcLength = this.esPersonaMoral ? 12 : 13;
    this.formDataInvoice.controls.apellidos.setValue('');
    this.formDataInvoice.controls.nombresInvoice.setValue('');
    this.formDataInvoice.controls.nombreEmpresa.setValue('');
    this.formDataInvoice.controls.codigoPostalInvoice.setValue('');
    this.formDataInvoice.controls.rfc.setValue('');
  }

  onChangeFormaPago(event: any = null, val: string = null) {
    const selectedValue = val || (event.target.value.split(':', 2)[1].trim() ?? '');
    if (this.formaPagos && this.formaPagos.length > 0) {
      const formaPago = this.formaPagos.find(fp => fp.id === selectedValue);
      if (formaPago) {
        this.formaPago.id = formaPago.id;
        this.formaPago.descripcion = formaPago.descripcion;
      }
    }
  }

  onChangeMetodoPago(event: any = null, val: string = null) {
    const selectedValue = val || (event.target.value.split(':', 2)[1].trim() ?? '');
    if (this.metodoPagos && this.metodoPagos.length > 0) {
      const metodoPago = this.metodoPagos.find(fp => fp.id === selectedValue);
      if (metodoPago) {
        this.metodoPago.id = metodoPago.id;
        this.metodoPago.descripcion = metodoPago.descripcion;
      }
    }
  }

  onChangeUsoCFDI(event: any = null, val: string = null) {
    const selectedValue = val || (event.target.value.split(':', 2)[1].trim() ?? '');
    if (this.usoCFDIs && this.usoCFDIs.length > 0) {
      const usoCFDI = this.usoCFDIs.find(fp => fp.id === selectedValue);
      if (usoCFDI) {
        this.usoCFDI.id = usoCFDI.id;
        this.usoCFDI.descripcion = usoCFDI.descripcion;
      }
    }
  }
  //#endregion

  //#region Catalogos Externos por json

  //#endregion

  //#region Catalogos Generales
  quitarAcentos(cadena: string): string {
    return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  //#endregion
}
