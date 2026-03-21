import { Component, Inject, Optional, OnInit, ViewChild } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { DatePipe, formatDate } from '@angular/common';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';


@Component({ 
  selector: 'app-permissionrequest',
  templateUrl: './permissionrequest.component.html',
  styleUrls: ['./permissionrequest.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})

export class PermissionRequestComponent implements OnInit {


  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];
  permissionDate = new UntypedFormControl(new Date());


  EmpName: any;
  advanceList: any;
  //pipe = new DatePipe('en-US');
  //now = Date.now();

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<PermissionRequestComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      id: ['0'],
      empCode: [null],
      permissionDate: new UntypedFormControl(new Date()),
      status: [null],
      companyCode: [null],
      fromTime: [null],
      toTime: [null],
      reason: [null],
      approvedId: [null],
      approvedName: [null],
      empName: [null],
      reportId: [null],
      reportName: [null],
      recommendedBy: [null],
      rejectedId: [null],
      rejectedName: [null],
      rejectReason: [null],
      purpose: [null],
      department: [null],
      fromdate: [null],
      todate: [null]
    });



    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['empCode'].disable();
    }

  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    //this.getTableData();
    //this.getTableDatas();
    this.modelFormData.patchValue
      ({
        empCode: user.userName
      });
    this.getProductByProductCode(user.userName);
  }


  //getTableDatas() {
  //  const getCompanyUrl = [this.apiConfigService.getAdvancetypeList].join('/');
  //  this.apiService.apiGetRequest(getCompanyUrl)
  //    .subscribe(
  //      response => {
  //        const res = response;
  //        if (res != null && res.status === StatusCodes.pass) {
  //          if (res.response != null) {
  //            console.log(res);
  //            this.advanceList = res.response['advancesList'];
  //          }
  //        }
  //        this.spinner.hide();
  //      });
  //}

  getProductByProductCode(value) {

    if (value != null && value !== '') {
      const getProductByProductCodeUrl = [this.apiConfigService.getEmpCode].join('/');
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: value }).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.['Empcodes'] != null) {
                this.getProductByProductCodeArray = res.response['Empcodes'];
                this.spinner.hide();
              }
            }
          }

        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }


  showErrorAlert(caption: string, message: string) {
    // this.alertService.openSnackBar(caption, message);
  }

  get formControls() { return this.modelFormData.controls; }
  fromdateValueChange()
  {
   // debugger;
    this.modelFormData.patchValue
      ({
        todate: this.modelFormData.get('fromdate').value
      });
  }
  onSearchChange()
  {
    let arr = 0;
    let arr1 = 0;
    var ftime = this.modelFormData.get('fromTime').value
    let str = ftime
    arr = str.substring(0, str.length - 3);
    arr1 = ftime.slice(-2);
    let count = 0;
    count = Number.parseInt(arr.toString()) + 1;
    var x= count + ':' + arr1 + '' + '';
    this.modelFormData.patchValue
      ({
        toTime: x
      });
  }

 
  save() {
    // debugger;
    if (this.modelFormData.invalid) {
      return;
    }

    this.modelFormData.patchValue({
      todate: this.commonService.formatDate(this.modelFormData.get('todate').value),
      fromdate: this.commonService.formatDate(this.modelFormData.get('fromdate').value)
    });
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

