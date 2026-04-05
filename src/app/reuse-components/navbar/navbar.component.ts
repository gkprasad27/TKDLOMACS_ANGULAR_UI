import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

import { ApiConfigService } from '../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../services/alert.service';
import { Static } from '../../enums/common/static';
import { SnackBar, StatusCodes } from '../../enums/common/common';


import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class NavbarComponent implements OnInit {
  openMenu = false;
  loginUser: any;
  showExpandButtons: any;
  shiftButton: string;
  shiftData: { Shift: string; Id: any; };
  employeeShift: string

  @Input() set showExpandButton(val: string) {
    this.loginUser = JSON.parse(localStorage.getItem('user'));
    this.showExpandButtons = val;
    if (this.showExpandButtons) {
      this.employeeShift = '';
      this.shiftButton = '';
      this.GetShiftId();
    }
  }


  constructor(
    public commonService: CommonService,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private route: ActivatedRoute

  ) {
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const root = this.router.routerState.snapshot.root;
        const allParams = this.getAllParams(root);
        console.log(this.router.routerState.snapshot.url);
        if (allParams && allParams.hasOwnProperty('id') && allParams.id) {
          this.commonService.routeParam = allParams.id;
        } else {
          this.commonService.routeParam = this.router.routerState.snapshot.url.replace('/', '');
        }
      });
  }

  getAllParams(route: any): any {
    let params = {
      ...route.params,
      ...route.queryParams
    };

    if (route.firstChild) {
      params = { ...params, ...this.getAllParams(route.firstChild) };
    }

    return params;
  }

  GetShiftId() {
    const getShiftIdUrl = [this.apiConfigService.getShiftId, this.loginUser.seqId, this.loginUser.branchCode].join('/');
    this.apiService.apiGetRequest(getShiftIdUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.shiftButton = (res.response['ShiftId'] != null) ? 'ShiftOUT' : 'ShiftIN'
            this.employeeShift = (res.response['ShiftId'] != null) ? res.response['ShiftId'] : null
          }
        } else if ((res != null) && res.status === StatusCodes.fail) {
          this.shiftButton = 'ShiftIN'
        }
      });
  }


  logout() {
    const logoutUrl = [this.apiConfigService.logoutUrl, this.loginUser.seqId].join('/');
    this.apiService.apiGetRequest(logoutUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res.response != null) {
          this.alertService.openSnackBar(res.response, Static.Close, SnackBar.success);
          this.authService.logout();
          this.router.navigateByUrl('/login');
        }
      });
  }

  shift() {
    var logoutUrl;
    if (this.shiftButton == 'ShiftIN') {
      logoutUrl = [this.apiConfigService.shiftStart, this.loginUser.seqId, this.loginUser.branchCode].join('/');
    } else {
      logoutUrl = [this.apiConfigService.shiftTerminate, this.employeeShift].join('/');
    }

    this.apiService.apiGetRequest(logoutUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res.response != null) {
          this.shiftButton = (res.response['ShiftId'] != null) ? 'ShiftOUT' : 'ShiftIN'
          this.employeeShift = (res.response['ShiftId'] != null) ? res.response['ShiftId'] : null
          const mesage = (res.response['ShiftId'] != null) ? 'Shift IN' : 'Shift Out'
          this.alertService.openSnackBar(`Successfully ${mesage}`, Static.Close, SnackBar.success);
        }
      });
  }

  openSetting() {
    this.router.navigateByUrl('/dashboard/setting');
  }

  openCloseMemu() {
    if (this.openMenu) {
      this.commonService.toggleSidebar();
      this.openMenu = false;
    } else {
      this.commonService.toggleSidebar();
      this.openMenu = true;
    }
  }
}
