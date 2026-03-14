import { Component, Inject, Optional, OnInit } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from '../../../../services/alert.service';
import { ApiConfigService } from '../../../../services/api-config.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';


@Component({ 
  selector: 'app-leaveopeningbalance',
  templateUrl: './leaveopeningbalance.component.html',
  styleUrls: ['./leaveopeningbalance.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class LeaveopeningbalanceComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
  companyList: any;
  LeaveTypeatList: any;
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];


  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<LeaveopeningbalanceComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {


    const user = JSON.parse(localStorage.getItem('user'));
    let username = user.userName;
    this.modelFormData = this.formBuilder.group({
      empCode: [username],
       // '', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(0), Validators.maxLength(4)]],
      year: [(new Date()).getFullYear()],
      leaveCode: ['', [Validators.required, Validators.minLength(2)]],
      opbal: ['', [Validators.required, Validators.pattern("^[0-9\.]*$"), Validators.minLength(0),Validators.maxLength(3)]],
      used: [null],
      userId: [null],
      timeStamp: [null],
      balance: ['', [Validators.required, Validators.pattern("^[0-9\.]*$"), Validators.minLength(0),Validators.maxLength(3)]],
      remarks: [null],
      compCode: [null]
    });


    this.formData = { ...data };
    if (this.formData?.item != null)
    {
      
     
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['empCode'].disable();
      
    }

  }

  ngOnInit()
  {
    //debugger;
    
    this.getTableData();
    this.modelFormData.patchValue
      ({
        //empCode: username
      });
    //this.getProductByProductCode(username);
  }

  getProductByProductCode(value) {
    //alert("hi");
    //debugger;
    if (value != null && value !== '') {
      const getProductByProductCodeUrl = ['/', this.apiConfigService.getEmpCode].join('/');
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

  onSearchChange(code) {
   // debugger;
    //alert("hi");
    let genarateVoucherNoUrl;
    if (code != null) {
      genarateVoucherNoUrl = ['/', this.apiConfigService.getEmpName, code.value].join('/');
    } else {
      genarateVoucherNoUrl = ['/', this.apiConfigService.getEmpName, this.modelFormData.get('empCode').value].join('/');
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.empname != null) {
              //this.EmpName = res.response['empname']
              this.modelFormData.patchValue
                ({
                  empName: res.response['empname']
                });
              this.spinner.hide();
            }
          }
        }
      });
  }

  getTableData() {
    //debugger;
    const user = JSON.parse(localStorage.getItem('user'));
    let username = user.userName;
    this.spinner.show();
    const getCompanyUrl = ['/', this.apiConfigService.getLeaveTypeatListforlop, user.companyCode ? user.companyCode : "6"].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.LeaveTypeatList = res.response['leavetypesList'];
            }
          }
          this.spinner.hide();
        }, error => {

        });
  }
  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['empCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
