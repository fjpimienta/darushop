import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IMeData } from '@core/interfaces/session.interface';
import { ChargeInput } from '@core/models/charge.models';
import { Codigopostal } from '@core/models/codigopostal.models';
import { Country, Estado, Municipio } from '@core/models/country.models';
import { OrderInput } from '@core/models/order.models';
import { UserInput } from '@core/models/user.models';
import { AuthenticationService } from '@core/services/auth.service';
import { CodigopostalsService } from '@core/services/codigopostals.service';
import { CountrysService } from '@core/services/countrys.service';
import { OrdersService } from '@core/services/orders.service';
import { ChargeService } from '@core/services/stripe/charge.service';
import { infoEventAlert } from '@shared/alert/alerts';
import jwtDecode from 'jwt-decode';

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
  access = false;
  sistema = false;
  role: string;
  userName = '';
  user: UserInput;
  orders: OrderInput[] = [];
  charges: ChargeInput[] = [];

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

  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private router: Router,
    public authService: AuthenticationService,
    public ordersService: OrdersService,
    public chargeService: ChargeService,
    public codigopostalsService: CodigopostalsService,
    public countrysService: CountrysService,
  ) {
    this.countrysService.getCountrys().subscribe(result => {
      this.countrys = result.countrys;
    });
  }

  ngOnInit(): void {
    this.authService.start();

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
      references: [''],
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
      // Obtener Pedidos
      this.ordersService.getOrders(1, 0, this.session.user?.email).subscribe(resultOrders => {
        let i = 0;
        this.charges = [];
        this.orders = resultOrders.orders;
        this.orders.forEach(order => {
          i += 1;
          let newCharge = new ChargeInput();
          newCharge.id = i.toString();
          const fechaReg = new Date(order.charge.created);
          const fecha = fechaReg.getDate() + '/' + fechaReg.getMonth() + '/' + fechaReg.getFullYear();
          newCharge.created = fecha;
          newCharge.description = order.charge.description;
          newCharge.amount = order.charge.amount;
          this.charges.push(newCharge);
        });
      });
      // Obtener Direcciones
      if (result.user) {
        this.user = result.user;

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
              if (direction.dir_delivery_main === true) {
                this.formDataAddress.controls.codigoPostal.setValue(direction.d_codigo);
                this.formDataAddress.controls.selectColonia.setValue(direction.d_asenta);
                this.formDataAddress.controls.directions.setValue(direction.directions);
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
              }
            });
          });
        }
      }
    });
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
    console.log('onSubmit');
  }

  //#region Direcciones
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
}
