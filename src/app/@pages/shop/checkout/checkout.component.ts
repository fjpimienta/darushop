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
import { WarehousesService } from '@core/services/warehouses.service';
import { Warehouse } from '@core/models/warehouse.models';
import { Delivery } from '@core/models/delivery.models';
import { SupplierProd } from '@core/models/product.models';
import { ExternalAuthService } from '@core/services/external-auth.service';
import { SuppliersService } from '@core/services/suppliers/supplier.service';
import { IApis, ISupplier } from '@core/interfaces/supplier.interface';
import { ProductShipment } from '@core/models/productShipment.models';
import { Shipment } from '@core/models/shipment.models';
import { ShippingsService } from '@core/services/shipping.service';
import { IShipping } from '@core/interfaces/shipping.interface';

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
  stripeCustomer: string;
  errorSaveUser: boolean;
  warehouses: Warehouse[];
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

  constructor(
    private router: Router,
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
    private warehousesService: WarehousesService,
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
            // console.log('this.cartItems: ', this.cartItems);
            // console.log('order: ', order);
            // console.log('payment: ', payment);
            // Enviar la información y procesar el pago.
            this.chargeService.pay(payment, order).pipe(first())
              .subscribe(async (result: {
                status: boolean,
                message: string,
                charge: ICharge
              }) => {
                if (result.status) {
                  this.sendEmail(result.charge);
                  this.cartService.clearCart(false);
                  // Elaborar Pedido Proveedor
                  // console.log('this.suppliers: ', this.suppliers);
                  await this.sendOrderSupplier();
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

    this.authService.start();

    this.subscr = this.cartService.cartStream.subscribe(items => {
      this.cartItems = items;
    });

    this.suppliersService.getSuppliers().subscribe(result => {
      this.suppliers = result.suppliers;
    });

    this.shippingsService.getShippings().subscribe(result => {
      this.shippings = result.shippings;
    });

    this.warehouses = [];
    this.warehousesService.getWarehouses(1, -1).subscribe(result => {
      this.warehouses = result.warehouses;
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
      phone: ['', Validators.required],
      email: ['', Validators.required],
      crearcuenta: [false],
      references: [''],
      existeMetodoPago: [false]
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

  // tslint:disable-next-line: typedef
  async notAvailableProducts(withMessage: boolean = true) {
    if (withMessage) {
      await infoEventAlert(
        'Accion no disponible',
        'No puedes realizar el pago sin productos en el carritto de compras'
      );
    }
    this.router.navigate(['/']);
  }

  // tslint:disable-next-line: typedef
  async onSubmit() {
    if (this.formData.valid) {
      // Enviar par obtener token de la tarjeta, para hacer uso de ese valor para el proceso del pago
      if (this.existeMetodoPago) {
        return await this.stripePaymentService.takeCardToken(true);
      } else {
        return await infoEventAlert('Se requiere definir un método de pago.', '');
      }
    } else {
      return await infoEventAlert('Verificar los campos requeridos.', '');
    }
  }

  ngOnDestroy(): void {
    this.subscr.unsubscribe();
    document.querySelector('body').removeEventListener('click', () => this.clearOpacity());
  }

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

  onCotizarEnvios(cpDestino: string, estadoCp: string): void {
    // Inicializar Arreglo de Envios.
    const capitalCp = '2700';
    const capitalCpCva = '06820';
    const delivery = new Delivery();
    let warehouse = new Warehouse();
    let id = '1';
    delivery.id = id;
    delivery.user = this.onSetUser(this.formData, this.stripeCustomer);
    this.shipments = [];
    // Verificar productos por proveedor.
    let i = 0;
    let apiShipings: IApis;
    let apiOrders: IApis;
    this.suppliers.forEach(async supplier => {
      const supplierProd = new SupplierProd();                       // Revisar proveedors con apis
      const warehouseEstado = new Warehouse();
      const warehouseCapital = new Warehouse();
      const productsEstado: ProductShipment[] = [];
      const productsCapital: ProductShipment[] = [];
      // Set Api Para Ordenes
      this.suppliersService.getApiSupplier(supplier.slug, 'order', 'PedidoWeb').subscribe(result => {
        if (result.apiSupplier) {
          console.log('supplier.slug: ', supplier.slug);
          console.log('result: ', result);
          apiOrders = result.apiSupplier;
          console.log('apiOrders: ', apiOrders);
        }
      });
      // Set Api para Envios
      this.suppliersService.getApiSupplier(supplier.slug, 'envios', 'paqueterias').subscribe(result => {
        if (result.apiSupplier) {
          console.log('supplier.slug: ', supplier.slug);
          console.log('result: ', result);
          apiShipings = result.apiSupplier;
          console.log('apiShipings: ', apiShipings);
        }
      });
      if (apiShipings && supplier.slug === this.cartItems[0].suppliersProd.idProveedor) {
        this.cartItems.forEach(async cartItem => {                              // Revisar productos en el carrito
          if (cartItem.suppliersProd.idProveedor === supplier.slug) {           // Si el producto es del proveedor
            cartItem.suppliersProd.branchOffices.forEach(branchOffice => {      // Revisar productos en almacenes
              if (estadoCp === branchOffice.estado || capitalCp === branchOffice.cp
                || capitalCpCva === branchOffice.cp) {  // Almacenes estado|capital
                if (branchOffice.cantidad >= cartItem.qty) {                    // Revisar disponibilidad
                  if (estadoCp === branchOffice.estado) {                       // Verificar Existencias en su Estado
                    const productShipment = new ProductShipment();
                    productShipment.producto = cartItem.sku;
                    productShipment.cantidad = cartItem.qty.toString();
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
                  if (capitalCp === branchOffice.cp || capitalCpCva === branchOffice.cp) { // Verificar Existencias en Capital
                    const productShipment = new ProductShipment();
                    productShipment.producto = cartItem.sku;
                    productShipment.cantidad = cartItem.qty.toString();
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
              warehouse = warehouseEstado;
              warehouse.productShipments = productsEstado;
            } else if (productsCapital.length === this.cartItems.length) {
              i += 1;
              warehouse = warehouseCapital;
              warehouse.productShipments = productsCapital;
            }
            supplierProd.idProveedor = cartItem.suppliersProd.idProveedor;
            supplierProd.codigo = cartItem.suppliersProd.codigo;
            supplierProd.price = cartItem.suppliersProd.price;
            supplierProd.moneda = cartItem.suppliersProd.moneda;
            warehouse.suppliersProd = supplierProd;
            id += 1;
          }
        });
        // Cotizar envio
        warehouse.cp = cpDestino;
        if (productsEstado.length === this.cartItems.length) {              // Si hay disponibilidad en estado
          warehouse.productShipments = productsEstado;
          // console.log('warehouse.productShipments/estado: ', warehouse.productShipments);
        } else if (productsCapital.length <= this.cartItems.length) {      // Si hay disponibilidad en capital
          warehouse.productShipments = productsCapital;
          // console.log('warehouse.productShipments/capital: ', warehouse.productShipments);
        }
        // console.log('productsEstado: ', productsEstado);
        // console.log('productsCapital: ', productsCapital);
        // console.log('warehouseEstado: ', warehouseEstado);
        // console.log('warehouseCapital: ', warehouseCapital);
        const shipmentsCost = await this.externalAuthService.onShippingEstimate(supplier, apiShipings, warehouse, false)
          .then(
            async (result) => {
              console.log('this.externalAuthService.onShippingEstimate/result: ', result);
              const shipments: Shipment[] = [];
              // tslint:disable-next-line: forin
              for (const key in result) {
                const shipment = new Shipment();
                shipment.empresa = result[key].empresa.toString().toUpperCase();
                shipment.costo = result[key].total;
                shipment.metodoShipping = result[key].metodo;
                shipments.push(shipment);
              }
              return shipments;
            }
          );
        // this.shipments = shipmentsCost;
        shipmentsCost.forEach(ship => {
          this.shipments.push(ship);
        });
      }
    });
    // Cotizar con las paqueterias
    console.log('if (this.shipments) ');
    return;
    if (this.shipments) {
      if (this.shippings.length > 0) {
        this.shippings.forEach(async shipping => {
          const apiSelectShip = shipping.apis.filter(api => api.operation === 'pricing')[0];
          const shippingsCost = await this.externalAuthService.onShippingEstimate(
            shipping, apiSelectShip, warehouse, false)
            .then(
              async (result) => {
                const shipments: Shipment[] = [];
                for (const key in result) {
                  // tslint:disable-next-line: forin
                  const shipment = new Shipment();
                  shipment.empresa = '99MINUTOS';
                  shipment.costo = result[key].costo;
                  shipment.metodoShipping = '';
                  shipments.push(shipment);
                }
                return shipments;
              }
            );
          shippingsCost.forEach(ship => {
            this.shipments.push(ship);
          });
        });
      }
    }
  }

  changeShipping(costo: number): void {
    this.cartService.priceTotal.subscribe(total => {
      this.totalPagar = (total + costo).toFixed(2).toString();
    });
  }

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

  onHabilitaPago(): void {
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

  sendEmail(charge: ICharge): void {
    const receiptEmail = charge.receipt_email + '; hosting3m@gmail.com';
    const mail: IMail = {
      to: receiptEmail,
      subject: 'Confirmacion del pedido',
      html: `
        El pedido se ha realizado correctamente.
        Puedes consultarlo en <a href="${charge.receipt_url}" target="_blank"> esta url</a>
      `
    };
    this.mailService.send(mail).pipe(first()).subscribe();
  }

  async sendOrderSupplier(): Promise<any> {
    // Cuando la consulta externa no requiere token
    // if (!supplier.token) {
    //   let resultados;
    //   switch (supplier.slug) {
    //     case 'cva':
    //       resultados = [];
    //       console.log('productos/resultados: ', resultados);
    //       return await resultados;
    //     case 'exel':
    //       resultados = [];
    //       console.log('productos/resultados: ', resultados);
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
    //           console.log('productos/resultados: ', resultados);
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


    return await 'Resultado';
  }

  selectApiSupplier(typeApi: string, returnApi: string, slug: string): IApis {
    let apiSelect: IApis;
    this.suppliers.forEach(async supplier => {
      supplier.apis.forEach(async api => {
        if (api.type === typeApi) {
          switch (slug) {
            case 'ct':
              if (api.return === returnApi) {
                apiSelect = api;
              }
              break;
            case 'cva':
              if (api.return === returnApi) {
                apiSelect = api;
              }
              break;
          }
        }
      });
    });
    return apiSelect;
  }
}
