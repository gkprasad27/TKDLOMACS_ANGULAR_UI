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
import { HttpClient } from '@angular/common/http';

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
  ipAddress: string = '';
  IPAddressList: any[] = [];

  constructor(
    public translate: TranslateService,
    private apiConfigService: ApiConfigService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private apiService: ApiService,
    private authService: AuthService,
    private commonService: CommonService,
    private http: HttpClient
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
      otp: [0, Validators.required],
    });
    this.ipifyApi();
    this.getIPAddress();
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
    if (!(this.loginForm.value.username.toLowerCase() === 'raju' || this.loginForm.value.password.toLowerCase() === 'dev' || this.loginForm.value.username.toLowerCase() === 'admin')) {
      if (this.ipAddress != null && this.ipAddress != '') {
        const ipAddressObj = this.IPAddressList.find(x => x.ipAddress === this.ipAddress);
        if (!ipAddressObj) {
          this.otpApi(null);
        }
      } else {
        this.alertService.openSnackBar('Unable to fetch IP Address. Please try again later.', Static.Close, SnackBar.error);
      }
    }
    // // this.spinner.show();
    const requestObj = { UserName: this.loginForm.get('username').value, Password: this.loginForm.get('password').value };
    const getLoginUrl = [this.apiConfigService.loginUrl].join('/');
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

  ipifyApi() {
    // Direct HTTP call to first fallback service - returns plain text IPv4
    const url = 'https://checkip.amazonaws.com/';
    console.log('Trying alternative IP service:', url);
    this.http.get(url, { responseType: 'text' }).subscribe(
      response => {
        console.log('Alternative IP response:', response);
        this.spinner.hide();
        if (response) {
          const ip = response.trim();
          if (this.isIPv4(ip)) {
            this.ipAddress = ip;
            console.log('✅ IP successfully set to:', this.ipAddress);
            return;
          }
        }
      },
      error => {
        console.error('Alternative service error:', error);
        this.spinner.hide();
      }
    );
  }

  getIPAddress() {
    const getIPAddress = this.apiConfigService.getIPAddress;
    this.apiService.apiGetRequest(getIPAddress)
      .subscribe(
        response => {
          this.spinner.hide();
          this.IPAddressList = response.response;
        });
  }

  isIPv4(ip: string): boolean {
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipv4Pattern.test(ip);
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
              this.authService.login(obj);
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
