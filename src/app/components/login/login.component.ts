import { Component, OnInit } from '@angular/core';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { Static } from '../../enums/common/static';
import { SnackBar, StatusCodes } from '../../enums/common/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiConfigService } from '../../services/api-config.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { CommonService } from '../../services/common.service';

@Component({ 
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;
  form: FormGroup;
  isSubmitted = false;

  showOtp = false;
  otp: number;
  loginUrlData: any;

  constructor(
    public translate: TranslateService,
    private apiConfigService: ApiConfigService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private apiService: ApiService,
    private authService: AuthService,
    private commonService: CommonService
  ) {
    commonService.showNavbar.next(false);
  }

  // form model
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.form = this.formBuilder.group({
      otp: ['', Validators.required],
    });
  }

  // Language Preference
  setLang(lang) {
    localStorage.setItem(Static.DefaultLang, lang.toLowerCase());
    this.translate.use(lang.toLowerCase());
    this.translate.currentLang = lang;
  }

  // OTP Verification
  onotp() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.form.value.otp != this.otp) {
      this.alertService.openSnackBar('Invalid Otp', Static.Close, SnackBar.error);
    } else {
      this.setRoute();
    }
  }


  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loginAPICall();
  }

  loginAPICall() {
    // // this.spinner.show();
    const requestObj = { UserName: this.loginForm.get('username').value, Password: this.loginForm.get('password').value };
    const getLoginUrl = [this.apiConfigService.loginUrl, this.form.get('otp').value].join('/');
    this.apiService.apiPostRequest(getLoginUrl, requestObj)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.getBranchesForUser(res.response['user']);
              localStorage.setItem('token', JSON.stringify(res.response['token']));
            }
          } else if (res != null && res.status === StatusCodes.fail && res.response == 'Access denied from this IP address. Ask SMS for your Admin for Access') {
              this.otpApi();
          }
        });
  }


  getBranchesForUser(obj) {

    const getBranchesForUserUrl = [this.apiConfigService.getBranchesForUser, obj.seqId].join('/');
    this.apiService.apiGetRequest(getBranchesForUserUrl).subscribe(
      response => {
        this.spinner.hide();
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if ((res.response['branches'] != null)) {
              obj.branchCode = res.response['branches'][0];
              localStorage.setItem('branchList', JSON.stringify(res.response['branches']));
              // this.authService.login(obj);
              this.alertService.openSnackBar(Static.LoginSussfull, Static.Close, SnackBar.success);
              this.router.navigate(['dashboard']);
            }
          }
        }
      });
  }


  otpApi(companyCode: string = null) {
    const getLoginUrl = `${this.apiConfigService.getAuthentication}?company=${companyCode}`;
    this.apiService.apiGetRequest(getLoginUrl)
      .subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.otp = res.response['purchaseordernoList'];
              this.showOtp = true;
            }
          } else {
            this.spinner.hide();
          }
        });
  }

  setRoute() {
    this.showOtp = false;
    // this.router.navigate(['dashboard']);
  }


  get formControls() { return this.loginForm.controls; }

}
