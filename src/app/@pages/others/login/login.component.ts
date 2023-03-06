import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILoginForm, IRegisterForm, IResultLogin } from '@core/interfaces/login.interface';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { AuthenticationService } from '@core/services/auth.service';

@Component({
  selector: 'pages-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginPageComponent implements OnInit {

  @Input() active = 1;
  login: ILoginForm = {
    email: '',
    password: ''
  };
  register: IRegisterForm = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    stripeCustomer: '',
    policy: false
  };

  constructor(public activeRoute: ActivatedRoute,
              public router: Router,
              public authService: AuthenticationService) {
    activeRoute.params.subscribe(params => {
      console.log('params: ', params);
      if (params.register) {
        if (params.register !== 'on') {
          this.router.navigate(['/register/on']);
        }
      }
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.login(this.login.email, this.login.password).subscribe(
      (result: IResultLogin) => {
        if (result.status) {
          if (result.token !== null) {
            this.authService.setSession(result.token);
            this.authService.updateSession(result);
            basicAlert(TYPE_ALERT.INFO, result.message);
            return;
          }
          basicAlert(TYPE_ALERT.WARNING, result.message);
          return;
        }
        basicAlert(TYPE_ALERT.INFO, result.message);
      }
    );
  }

  registerUser(): void {
    console.log('register: ', this.login);
  }

}
