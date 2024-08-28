import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '@core/services/users.service';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss']
})
export class ActiveComponent implements OnInit {

  token: string;
  title: string;
  userToken: any = {
    id: '',
    email: ''
  };

  active: any = {
    password: '',
    passwordTwo: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private userService: UsersService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { }

  submitted = false;

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params.token) {
        this.token = params.token;
        this.userToken = jwtDecode(this.token);
        this.title = 'Activar Usuario ';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.active.password !== this.active.passwordTwo) {
      basicAlert(TYPE_ALERT.WARNING, 'Las contrasenas no coinciden. Asegúrate que las contrase&ntilde;as sean iguales.');
      return;
    }
    // Todo validado, enviar a la api de graphql
    // servicio => active
    this.userService.active(this.token, this.active.password).subscribe(
      result => {
        if (result.status) {
          // Redireccionar a login
          this.router.navigate(['/login']);
          basicAlert(TYPE_ALERT.SUCCESS, result.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, result.message);
        this.active.password = '';
        this.active.passwordTwo = '';
      }
    );
  }

  onActivar(): void {
    this.userService.sendEmailActive(this.userToken.user.id, this.userToken.user.email).subscribe(
      resEmail => {
        (resEmail.status) ?
          basicAlert(TYPE_ALERT.SUCCESS, resEmail.message) :
          basicAlert(TYPE_ALERT.WARNING, resEmail.message);
      }
    );
  }

}
