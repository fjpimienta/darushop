import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from '@core/services/password.service';
import { UsersService } from '@core/services/users.service';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  token: string;
  title: string;
  userToken: any = {
    id: '',
    email: ''
  };

  change: any = {
    password: '',
    passwordTwo: ''
  };
  submitted = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private passwordService: PasswordService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params.token) {
        this.token = params.token;
        this.userToken = jwtDecode(this.token);
        this.title = 'Cambiar Contraseña';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.change.password !== this.change.passwordTwo) {
      basicAlert(TYPE_ALERT.WARNING, 'Las contrasenas no coinciden. Asegurate que las contrasenas sean iguales.');
      return;
    }
    this.passwordService.change(this.token, this.change.password).subscribe(result => {
      if (result.status) {
        basicAlert(TYPE_ALERT.SUCCESS, result.message);
        this.router.navigate(['login']);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, result.message);
    });
  }

}
