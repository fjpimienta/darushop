import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMAIL_PATTERN } from '@core/constants/regex';
import { PasswordService } from '@core/services/password.service';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

  title: string;
  pattern = EMAIL_PATTERN;
  recover: any = {
    email: ''
  };

  submitted = false;

  constructor(
    private passwordService: PasswordService,
    private router: Router,
  ) { }


  ngOnInit(): void {
  }

  onSubmit(): void {
    this.submitted = true;
    this.passwordService.reset(this.recover.email).subscribe(result => {
      if (result.status) {
        basicAlert(TYPE_ALERT.SUCCESS, result.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, result.message);
    });
  }

}
