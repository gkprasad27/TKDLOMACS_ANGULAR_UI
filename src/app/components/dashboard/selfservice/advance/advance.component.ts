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
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})

export class AdvanceComponent implements OnInit {


  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
  //LeaveTypeatList: any;
  //companyList: any;
  //brandList: any;
  //MaterialGroupsList: any;
  //SizesList: any;
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];
  applDate = new UntypedFormControl(new Date());

  
  EmpName: any;
  advanceList: any;
  //pipe = new DatePipe('en-US');
  //now = Date.now();

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AdvanceComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      id: ['0'],
      employeeId: [null],
      advanceType: [null],
      advanceAmount: [null],
      applyDate: [null],
      approveDate: [null],
      reason: [null],
      recommendedBy: [null],
      approvedBy: [null],
      status: [null],
      balance: [null],
      deductedAmount: [null]
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
    this.getTableDatas();
    this.modelFormData.patchValue
      ({
        employeeId: user.userName
      });
    this.getProductByProductCode(user.userName);
  }
  

  getTableDatas() {
    const getCompanyUrl = [this.apiConfigService.getAdvancetypeList].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.advanceList = res.response['advancesList'];
            }
          }
          this.spinner.hide();
        });
  }

  getProductByProductCode(value) {

    if (value != null && value !== '') {
      const getProductByProductCodeUrl = [this.apiConfigService.getEmpCode].join('/');
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: value }).subscribe(
        response => {
          const res = response.body;
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


  save() {
    // debugger;
    if (this.modelFormData.invalid) {
      return;
    }
   
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

