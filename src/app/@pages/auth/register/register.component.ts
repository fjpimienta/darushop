import { Component, OnInit } from '@angular/core';
import { IRegisterForm, IResultLogin } from '@core/interfaces/login.interface';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { AuthenticationService } from '@core/services/auth.service';
import { UsersService } from '@core/services/users.service';
import { Router } from '@angular/router';
import { IResultRegister } from '@core/interfaces/register.interface';
import { UserInput } from '@core/models/user.models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  register:UserInput = new UserInput();

  constructor(
    public authService: AuthenticationService,
    public userService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
}
