import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IMeData } from '@core/interfaces/session.interface';
import { Codigopostal } from '@core/models/codigopostal.models';
import { Country, Estado, Municipio } from '@core/models/country.models';
import { Delivery } from '@core/models/delivery.models';
import { OrderInput } from '@core/models/order.models';
import { AddressInput, UserInput } from '@core/models/user.models';
import { AuthenticationService } from '@core/services/auth.service';
import { CodigopostalsService } from '@core/services/codigopostals.service';
import { CountrysService } from '@core/services/countrys.service';
import { DeliverysService } from '@core/services/deliverys.service';
import { ExternalAuthService } from '@core/services/external-auth.service';
import { ChargeService } from '@core/services/stripe/charge.service';
import { UsersService } from '@core/services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { closeAlert, infoEventAlert, loadData } from '@shared/alert/alerts';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import jwtDecode from 'jwt-decode';
import { Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'shop-dashboard-page',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

  session: IMeData = {
    status: false
  };
  type: '';
  access = false;
  sistema = false;
  role: string;
  userName = '';
  user: UserInput;
  orders: OrderInput[] = [];
  charges: Delivery[] = [];

  byCodigopostal: boolean;
  codigoPostal: string;
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
  referencias: string;
  codigosPostales: string[];

  formDataMain: FormGroup;
  formDataAddress: FormGroup;
  pageTitle: string = '';
  previousPageUrl: string = '';
  previousPageTitle: string = '';
  queryParams: object = {};
  private unsubscribe$: Subject<void> = new Subject<void>();

  data: any;
  guias: any;
  productos = [];
  totalProd = 0.0;
  totalEnvios = 0;
  discount = 0;
  total = 0.0;

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    public authService: AuthenticationService,
    public deliverysService: DeliverysService,
    public chargeService: ChargeService,
    public codigopostalsService: CodigopostalsService,
    public countrysService: CountrysService,
    private modalService: NgbModal,
    private externalAuthService: ExternalAuthService,
    private usersService: UsersService,
    private sanitizer: DomSanitizer
  ) {
    combineLatest([
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)),
      this.activeRoute.data
    ])
      .pipe(takeUntil(this.unsubscribe$)) // Unsubscribe cuando el componente se destruye
      .subscribe(([navigationEnd, data]: [NavigationEnd, { title: string }]) => {
        // Obtener el título de la página actual a través de activeRoute.data
        this.pageTitle = data.title || '';
        // Obtener el título de la página anterior del historial de navegación
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.previousNavigation) {
          const url = navigation.previousNavigation.extractedUrl.toString();
          const firstSlashIndex = url.indexOf('/');
          const questionMarkIndex = url.indexOf('?');
          const secondSlashIndex = url.indexOf('/', firstSlashIndex + 1);
          if (firstSlashIndex !== -1 && secondSlashIndex !== -1) {
            const previousPageTitle = url.substring(firstSlashIndex + 1, secondSlashIndex);
            this.previousPageTitle = previousPageTitle;
          } else if (firstSlashIndex !== -1 && questionMarkIndex !== -1) {
            const previousPageTitle = url.substring(firstSlashIndex + 1, questionMarkIndex);
            this.previousPageTitle = previousPageTitle;
            this.previousPageTitle = this.previousPageTitle.charAt(0).toUpperCase() + this.previousPageTitle.slice(1).toLowerCase();
          } else if (firstSlashIndex !== -1) {
            this.previousPageTitle = url.substring(firstSlashIndex + 1);
          } else {
            this.previousPageTitle = url;
          }
          this.previousPageUrl = navigation.previousNavigation.finalUrl.toString();
          this.queryParams = navigation.previousNavigation.finalUrl.queryParams;
        }
      });
    this.activeRoute.params.subscribe(params => {
      this.type = params.type || '4cols';
    });
    this.countrysService.getCountrys().subscribe(result => {
      this.countrys = result.countrys;
    });
  }

  ngOnInit(): void {
    this.authService.start();
    this.activeRoute.data.subscribe((data: { title: string }) => {
      this.pageTitle = data.title || this.pageTitle;
    });
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
    this.codigoPostal = '';
    this.referencias = '';
    this.codigosPostales = [];
    this.byCodigopostal = false;

    this.formDataMain = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.formDataAddress = this.formBuilder.group({
      byCodigopostal: [false],
      codigoPostal: ['', Validators.required],
      selectCountry: ['', [Validators.required]],
      selectEstado: ['', [Validators.required]],
      selectMunicipio: ['', [Validators.required]],
      selectColonia: ['', Validators.required],
      directions: ['', Validators.required],
      outdoorNumber: ['', Validators.required],
      interiorNumber: [''],
      references: ['', Validators.required],
    });
    if (this.authService.getSession() !== null) {
      if (this.verificarUsuario()) {
        this.userName = 'No es un usuario de Daru!';
      }
    }
    // Obtiene los datos de la sesión
    this.authService.accessVar$.subscribe((result) => {
      this.session = result;
      this.access = this.session.status;
      this.role = this.session.user?.role;
      this.userName = `${this.session.user?.name} ${this.session.user?.lastname}`;

      // Obtener Direcciones
      if (result.user) {
        this.user = result.user;

        // Obtener Pedidos
        const deliverys = this.deliverysService.getDeliverys(1, 0, this.session.user?.email).then(async (res) => {
          this.charges = res.deliverys;
        });

        // Datos Principales
        this.formDataMain.controls.name.setValue(this.user.name);
        this.formDataMain.controls.lastname.setValue(this.user.lastname);
        this.formDataMain.controls.phone.setValue(this.user.phone);
        this.formDataMain.controls.email.setValue(this.user.email);

        // Direccion de Entrega
        if (this.session.user?.addresses.length > 0) {
          this.countrysService.countrys$.subscribe((result) => {
            this.countrys = result;
            this.session.user?.addresses.forEach(direction => {
              // if (direction.dir_delivery_main === true) {
              this.formDataAddress.controls.codigoPostal.setValue(direction.d_codigo);
              this.formDataAddress.controls.selectColonia.setValue(direction.d_asenta);
              this.formDataAddress.controls.directions.setValue(direction.directions);
              this.formDataAddress.controls.outdoorNumber.setValue(direction.outdoorNumber);
              this.formDataAddress.controls.interiorNumber.setValue(direction.interiorNumber);
              this.formDataAddress.controls.outdoorNumber.setValue(direction.outdoorNumber);
              this.formDataAddress.controls.interiorNumber.setValue(direction.interiorNumber);
              this.formDataAddress.controls.references.setValue(direction.references);
              if (this.countrys.length > 0) {
                this.countrys.forEach(country => {
                  if (country.c_pais === direction.c_pais) {
                    this.estados = country.estados;
                    this.formDataAddress.controls.selectCountry.setValue(direction.c_pais);
                    this.selectCountry.c_pais = direction.c_pais;
                    this.selectCountry.d_pais = direction.d_pais;
                    country.estados.forEach(estado => {
                      if (estado.c_estado === direction.c_estado) {
                        this.municipios = estado.municipios;
                        this.formDataAddress.controls.selectEstado.setValue(direction.c_estado);
                        this.selectEstado.c_estado = direction.c_estado;
                        this.selectEstado.d_estado = direction.d_estado;
                        estado.municipios.forEach(municipio => {
                          if (municipio.c_mnpio === direction.c_mnpio) {
                            this.formDataAddress.controls.selectMunicipio.setValue(direction.c_mnpio);
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
              // }
            });
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  viewTab($event: Event, prevId: number, nextId: number) {
    $event.preventDefault();
    let nodes = this.el.nativeElement.querySelectorAll(".nav-dashboard .nav-link");
    this.renderer.removeClass(nodes[prevId], 'active');
    this.renderer.addClass(nodes[nextId], 'active');
  }

  verificarUsuario(): boolean {
    // Primero comprobar que existe sesion
    if (this.authService.getSession() !== null) {
      const dataDecode = this.decodeToken();
      return true;
    } else {
      return this.redirect();
    }
  }

  logout(): void {
    this.authService.resetSession();
    this.router.navigate(['/']);
  }

  decodeToken() {
    return jwtDecode(this.authService.getSession().token);
  }

  redirect(): boolean {
    this.router.navigate(['/login']);
    return false;
  }

  async onSubmit() {
    const email = this.formDataMain.controls.email.value;
    let address: AddressInput = new AddressInput();
    const addresses: AddressInput[] = [];
    if (email !== '') {
      address = this.setAddress(this.user.addresses, this.formDataAddress);
      addresses.push(address);
      console.log('this.user: ', this.user);
      // this.user.addresses = addresses;
      this.usersService.update(this.user).subscribe(
        (res: any) => {
          if (res.status) {
            basicAlert(TYPE_ALERT.SUCCESS, res.message);
          } else {
            basicAlert(TYPE_ALERT.WARNING, res.message);
          }
        }
      );
    }
  }

  //#region Direcciones
  setAddress(addresses: AddressInput[], formDataAddress: FormGroup): AddressInput {
    console.log('addresses: ', addresses);
    console.log('formDataAddress: ', formDataAddress);
    console.log('formDataAddress.controls: ', formDataAddress.controls);
    const userAddresses: AddressInput[] = addresses;
    const userAddress: AddressInput = userAddresses[0];
    return userAddress;
  }

  onActiveCP(): void {
    this.byCodigopostal = !this.byCodigopostal;
    this.selectCountry = new Country();
    this.selectEstado = new Estado();
    this.selectMunicipio = new Municipio();
    this.formDataAddress.controls.codigoPostal.setValue('');
    this.formDataAddress.controls.selectCountry.setValue('');
    this.formDataAddress.controls.selectEstado.setValue('');
    this.formDataAddress.controls.selectMunicipio.setValue('');
  }

  async onSetCps(event): Promise<void> {
    if (event) {
      const cp = $(event.target).val();
      if (cp !== '') {
        loadData('Consultando Codigo Postal', 'Esperar la carga de los envíos.');
        // Recuperar pais, estado y municipio con el CP
        const codigoPostal = await this.codigopostalsService.getCps(1, -1, cp).then(async result => {
          this.cps = result.codigopostals;
          if (this.cps.length > 0) {
            // Agregar Pais, Estados, Municipios del CP
            if (this.countrys.length > 0) {
              this.countrys.forEach(country => {
                if (country.c_pais === this.cps[0].c_pais) {
                  this.estados = country.estados;
                  this.formDataAddress.controls.selectCountry.setValue(country.c_pais);
                  this.selectCountry.c_pais = country.c_pais;
                  this.selectCountry.d_pais = country.d_pais;
                  country.estados.forEach(estado => {
                    if (estado.c_estado === this.cps[0].c_estado) {
                      this.municipios = estado.municipios;
                      this.formDataAddress.controls.selectEstado.setValue(estado.c_estado);
                      this.selectEstado.c_estado = estado.c_estado;
                      this.selectEstado.d_estado = estado.d_estado;
                      estado.municipios.forEach(municipio => {
                        if (municipio.c_mnpio === this.cps[0].c_mnpio) {
                          this.formDataAddress.controls.selectMunicipio.setValue(municipio.c_mnpio);
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
            }
          }
          closeAlert();
          return await this.colonias;
        });
      } else {
        infoEventAlert('No se ha especificado un código correcto.', '');
      }
    } else {

    }
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
        this.formDataAddress.controls.selectEstado.setValue('');
        this.formDataAddress.controls.selectMunicipio.setValue('');
        this.formDataAddress.controls.selectColonia.setValue('');
        this.formDataAddress.controls.directions.setValue('');
        this.formDataAddress.controls.outdoorNumber.setValue('');
        this.formDataAddress.controls.interiorNumber.setValue('');
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
        this.formDataAddress.controls.selectMunicipio.setValue('');
      }
    });
  }

  onSetColonias(event): void {
  }
  //#endregion

  openModal(content: any, data: any) {
    this.data = data;
    this.productos = [];
    this.totalProd = 0.0;
    this.totalEnvios = 0;
    if (this.data) {
      if (this.data.orderCtResponse) {
        this.getStatusOrderCt(this.data.orderCtResponse.pedidoWeb).then(result => {
          this.guias = result.statusOrdersCt;
        });
      }
      for (const idW of Object.keys(this.data.warehouses)) {
        const warehouse = this.data.warehouses[idW];
        for (const idP of Object.keys(warehouse.productShipments)) {
          const prod = warehouse.productShipments[idP];
          this.totalProd += (prod.precio * prod.cantidad);
          this.productos.push(prod);
        }
        for (const idE of Object.keys(warehouse.shipments)) {
          const ship = warehouse.shipments[idE];
          this.totalEnvios += ship.costo;
        }
      }
      this.discount = this.data.discount;
      this.total = this.totalProd + this.totalEnvios - this.discount;

      this.modalService.open(content, { size: 'lg', centered: true, windowClass: 'custom-modal' });
    }
  }

  async getStatusOrderCt(folio: string): Promise<any> {
    const confirmarPedidoCt = await this.externalAuthService.statusOrdersCt(folio);
    console.log('confirmarPedidoCt: ', confirmarPedidoCt);
    return confirmarPedidoCt;
  }

  getArchivoSeguro(archivoBase64: string): SafeResourceUrl {
    const url = `data:application/pdf;base64,${archivoBase64}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  abrirPDFEnOtraPagina(archivo: string): void {
    const nuevaVentana = window.open();
    nuevaVentana.document.write(`<embed src="data:application/pdf;base64,${archivo}" type="application/pdf" width="100%" height="100%">`);
  }

}
