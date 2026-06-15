import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiConfigService } from '../../../services/api-config.service';
import { ApiService } from '../../../services/api.service';
import { AlertService } from '../../../services/alert.service';
import { SnackBar, StatusCodes } from '../../../enums/common/common';
import { Static } from '../../../enums/common/static';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../services/common.service';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rolesprevilages',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslateModule,
    MatPaginator,
    MatTableModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './rolesprevilages.component.html',
  styleUrls: ['./rolesprevilages.component.scss']
})
export class RolesprevilagesComponent implements OnInit, OnDestroy {

  formData: FormGroup;

  roleArray = [];
  parentMenu = [];
  actualData = [];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  displayedColumns: string[] = [
    'ext4',
    'active',
    'canAdd',
    'canEdit',
    'canDelete'
  ];

  // Header checkbox states
  activeChecked = false;
  canAddChecked = false;
  canEditChecked = false;
  canDeleteChecked = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    route: ActivatedRoute
  ) {
    this.commonService.routeParam = route.snapshot.routeConfig.path;

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

    this.apiService.apiGetRequest(getRolesUrl).subscribe(response => {
      const res = response;

      if (res != null && res.status === StatusCodes.pass) {
        if (res.response != null) {
          this.roleArray = res.response['roles'];
        }
      }

      this.spinner.hide();
    });
  }

  onRuleChange(data: any) {
    this.reset();

    this.formData.patchValue({
      role: data.value
    });

    this.formData.controls['parentMenu'].enable();
  }

  GetParentMenus() {
    const getRolesUrl = this.apiConfigService.getParentMenus;

    this.apiService.apiGetRequest(getRolesUrl).subscribe(response => {
      const res = response;

      if (res != null && res.status === StatusCodes.pass) {
        if (res.response != null) {
          this.parentMenu = res.response['parentMenus'];
        }
      }

      this.spinner.hide();
    });
  }

  selectedParentMenu() {
    const getRolesUrl = [
      this.apiConfigService.getMenuList,
      this.formData.get('role')?.value,
      this.formData.get('parentMenu')?.value
    ].join('/');

    this.apiService.apiGetRequest(getRolesUrl).subscribe(response => {
      const res = response;

      if (res != null && res.status === StatusCodes.pass) {
        if (res.response != null) {

          this.actualData = res.response.map(x => ({ ...x }));

          this.dataSource = new MatTableDataSource(
            res.response.map(x => ({ ...x }))
          );

          this.dataSource.paginator = this.paginator;

          this.updateHeaderCheckboxes();
        }
      }

      this.spinner.hide();
    });
  }

  checkboxCheck(event: any, column: string) {
    if (!this.dataSource?.data?.length) {
      return;
    }

    this.dataSource.data.forEach(row => {
      row[column] = event.checked;
    });

    // Refresh table
    this.dataSource.data = [...this.dataSource.data];

    this.updateHeaderCheckboxes();
  }

  updateHeaderCheckboxes() {
    if (!this.dataSource?.data?.length) {

      this.activeChecked = false;
      this.canAddChecked = false;
      this.canEditChecked = false;
      this.canDeleteChecked = false;

      return;
    }

    this.activeChecked = this.dataSource.data.every(x => x.active);
    this.canAddChecked = this.dataSource.data.every(x => x.canAdd);
    this.canEditChecked = this.dataSource.data.every(x => x.canEdit);
    this.canDeleteChecked = this.dataSource.data.every(x => x.canDelete);
  }

  save() {
    const user = JSON.parse(localStorage.getItem('user'));

    const filterData = [];

    for (let d = 0; d < this.dataSource.data.length; d++) {

      const filterValue = this.actualData.filter(
        res => res.operationCode === this.dataSource.data[d]['operationCode']
      );

      if (filterValue.length) {

        if (!this.commonService.IsObjectsMatch(
          filterValue[0],
          this.dataSource.data[d]
        )) {

          const temp = { ...this.dataSource.data[d] };

          temp['roleId'] = this.formData.get('role')?.value;
          temp['userId'] = user.seqId;

          filterData.push(temp);
        }
      }
    }

    const getAccessUrl = [
      this.apiConfigService.giveAccess,
      this.formData.get('role')?.value
    ].join('/');

    this.apiService.apiPostRequest(getAccessUrl, filterData).subscribe(
      response => {
        const res = response;

        if (res != null && res.status === StatusCodes.pass) {

          if (res.response != null) {

            this.alertService.openSnackBar(
              Static.LoginSussfull,
              Static.Close,
              SnackBar.success
            );

            this.reset();
          }
        }

        this.spinner.hide();
      }
    );
  }

  reset() {
    this.formData.reset();

    this.activeChecked = false;
    this.canAddChecked = false;
    this.canEditChecked = false;
    this.canDeleteChecked = false;

    this.dataSource = undefined;

    this.formData.controls['parentMenu'].disable();
  }

  ngOnDestroy(): void {
    this.commonService.routeParam = null;
  }
}