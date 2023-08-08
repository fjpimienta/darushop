import { Component, OnInit } from '@angular/core';
import { ILoginForm, IRegisterForm, IResultLogin } from '@core/interfaces/login.interface';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { AuthenticationService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { EMAIL_PATTERN } from '@core/constants/regex';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  pattern = EMAIL_PATTERN;

  login: ILoginForm = {
    email: '',
    password: '',
    remember: false
  };

  constructor(
    public authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.start();
    if (localStorage.remember && localStorage.remember !== '') {
      this.login.email = localStorage.email;
      this.login.remember = localStorage.remember;
    } else {
      this.login.email = '';
      this.login.remember = false;
    }
  }

  onSubmit(): void {
    this.lsRememberMe();
    this.authService.login(this.login.email, this.login.password).subscribe(
      (result: IResultLogin) => {
        if (result.status) {
          if (result.token !== null) {
            this.authService.setSession(result.token);
            this.authService.updateSession(result);
            this.router.navigate(['/']);
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

  onRecover(): void {
    this.router.navigate(['/recover']);
  }

  lsRememberMe(): void {
    if (this.login.remember && this.login.email !== '') {
      localStorage.setItem('email', this.login.email);
      localStorage.setItem('remember', this.login.remember.toString());
    } else {
      localStorage.setItem('email', '');
      localStorage.setItem('remember', 'false');
    }
  }

}
