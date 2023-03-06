import { Component, Input, OnInit } from '@angular/core';
import { ILoginForm, IRegisterForm, IResultLogin } from '@core/interfaces/login.interface';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { AuthenticationService } from '@core/services/auth.service';
import { UsersService } from '@core/services/users.service';
import { IResultRegister } from '@core/interfaces/register.interface';
import { Router } from '@angular/router';
import { EMAIL_PATTERN } from '@core/constants/regex';
import { UserInput } from '@core/models/user.models';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})

export class LoginModalComponent implements OnInit {

  pattern = EMAIL_PATTERN;
  @Input() active = 1;
  login: ILoginForm = {
    email: '',
    password: '',
    remember: false
  };
  register: UserInput = new UserInput();

  constructor(
    public authService: AuthenticationService,
    public userService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.start();
    if (localStorage.remember && localStorage.remember !== '') {
      this.login.email = localStorage.getItem('email');
      this.login.remember = localStorage.getItem('remember') === 'true' ? true : false;
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
            basicAlert(TYPE_ALERT.INFO, result.message);
            this.router.navigate(['/']);
            this.closeModal();
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
    this.userService.register(this.register).subscribe((result: IResultRegister) => {
      if (!result.status) {
        basicAlert(TYPE_ALERT.WARNING, result.message);
        return;
      }
      basicAlert(TYPE_ALERT.SUCCESS, result.message);
      this.userService.sendEmailActive(result.user.id, result.user.email).subscribe(
        resEmail => {
          (resEmail.status) ?
            basicAlert(TYPE_ALERT.SUCCESS, resEmail.message) :
            basicAlert(TYPE_ALERT.WARNING, resEmail.message);
        }
      );
      this.router.navigate(['/login']);
    });
  }

  onRecover(): void {
    this.router.navigate(['/recover']);
  }

  closeModal(): void {
    const modal = document.querySelector('.login-modal') as HTMLElement;
    if (modal) {
      modal.click();
    }
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
