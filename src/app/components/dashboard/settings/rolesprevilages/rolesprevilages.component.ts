import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';
import { AlertService } from '../../../../services/alert.service';

import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { Static } from '../../../../enums/common/static';
import { NgxSpinnerService } from 'ngx-spinner';

import { CommonService } from '../../../../services/common.service';

@Component({ 
  selector: 'app-rolesprevilages',
  templateUrl: './rolesprevilages.component.html',
  styleUrls: ['./rolesprevilages.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class RolesprevilagesComponent implements OnInit {

  formData: UntypedFormGroup;
  roleArray = [];
  parentMenu = [];
  actualData = [];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['ext4', 'active', 'canAdd', 'canEdit', 'canDelete'];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService

  ) {
    this.formData = this.formBuilder.group({
      role: [null],
      parentMenu: [null]
    });
    this.formData.controls['parentMenu'].disable();
  }

  ngOnInit() {
    this.GetRoles();
    this.GetParentMenus();
  }

  GetRoles() {
    const getRolesUrl = this.apiConfigService.getRoles;
    this.apiService.apiGetRequest(getRolesUrl).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.roleArray = res.response['Roles'];
          }
        }
        this.spinner.hide();
      });
  }

  onRuleChange(data) {
    this.reset();
    this.formData.patchValue({
      role: data.value
    })
    this.formData.controls['parentMenu'].enable();
  }

  GetParentMenus() {
    const getRolesUrl = this.apiConfigService.getParentMenus;
    this.apiService.apiGetRequest(getRolesUrl).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.parentMenu = res.response['ParentMenus'];
          }
        }
        this.spinner.hide();
      });
  }

  selectedParentMenu() {
    const getRolesUrl = ['/', this.apiConfigService.getMenuList, this.formData.get('role').value,
      this.formData.get('parentMenu').value].join('/');
    this.apiService.apiGetRequest(getRolesUrl).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.actualData = res.response.map(x => ({...x}));
            this.dataSource = new MatTableDataSource(res.response.map(x => ({...x})));
            this.dataSource.paginator = this.paginator;
          }
        }
        this.spinner.hide();
      });
  }


  checkboxCheck(event, column) {
    if (this.dataSource != null) {
      this.dataSource.data = this.dataSource.data.map(val => {
        val[column] = event.checked;
        return val;
      });
    }
  }

  save() {
    let filterData = [];
    for (let d = 0; d < this.dataSource.data.length; d++) {
      let filterValue = this.actualData.filter(res => res.operationCode == this.dataSource.data[d]['operationCode']);
      if (filterValue.length) {
        if (!this.commonService.IsObjectsMatch(filterValue[0], this.dataSource.data[d])) {
          filterData.push(this.dataSource.data[d]);
        }
      }
    }
    
    const getAccessUrl = ['/', this.apiConfigService.giveAccess, this.formData.get('role').value].join('/');
    this.apiService.apiPostRequest(getAccessUrl, filterData).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar(Static.LoginSussfull, Static.Close, SnackBar.success);
            this.reset();
          }
        }
        this.spinner.hide();
      });

  }

  reset() {
    this.formData.reset();
    this.dataSource = undefined;
    this.formData.controls['parentMenu'].disable();
  }

}

