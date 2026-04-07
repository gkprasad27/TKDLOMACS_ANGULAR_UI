import { Component, Inject, Optional, OnInit } from '@angular/core';

import { ApiService } from '../../../../services/api.service';

import { AlertService } from '../../../../services/alert.service';

import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { CommonService } from '../../../../services/common.service';

interface GENDER {
  value: string;
  viewValue: string;
}
interface BloodGroup
{
  value: string;
  viewValue: string;
}
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class EmployeeComponent implements OnInit {


  modelFormData: FormGroup;
  isSubmitted  =  false;
  formData: any;
  companyList: any;
  branchesList: any;
  gender: GENDER[] =
    [
      { value: 'Male', viewValue: 'Male' },
      { value: 'Female', viewValue: 'Female' }
    ];
  
  blood: BloodGroup[] =
    [
    { value: 'A +', viewValue: 'A +' },
    { value: 'A-', viewValue: 'A-' },
    { value: 'B+', viewValue: 'B+' },
    { value: 'B-', viewValue: 'B-' },
    { value: 'AB +', viewValue: ' AB +' },
    { value: 'AB-', viewValue: 'AB-' },
    { value: 'O+', viewValue: 'O+' },
    { value: 'O-', viewValue: 'O-' }
    ];
    getEmployeeCodeList = [];

  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EmployeeComponent>,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

    this.modelFormData = this.formBuilder.group({
      employeeId: 0,
      branchId: [null],
      branchCode: [null],
      branchName: [null],
      designationId: [null],
      employeeName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      employeeCode: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      dob: [null],
      maritalStatus: [null],
      gender: [null],
      qualification: [null],
      address: [null],
      phoneNumber: [null],
      mobileNumber: [null],
      email: [null],
      joiningDate: [null],
      terminationDate: [null],
      isActive: [null],
      narration: [null],
      bloodGroup: [null],
      passportNo: [null],
      passportExpiryDate: [null],
      labourCardNumber: [null],
      labourCardExpiryDate: [null],
      salaryType: [null],
      bankName: [null],
      bankbranchName: [null],
      bankAccountNumber: [null],
      bankbranchCode: [null],
      panNumber: [null],
      pfNumber: [null],
      esiNumber: [null],
      extraDate: [null],
      extra1: [null],
      extra2: [null],
      defaultPackageId: [null],
      aadharNumber: [null],
      recomendedBy: [null],
      approvedBy: [null]
        
      });

      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
       this.modelFormData.controls['employeeCode'].disable();
      }

  }

  ngOnInit() {
   // this.getTableData();
    this.getTableData1();
  }

  // getTableData() {
  //   const getCompanyUrl = [this.apiConfigService.getCompanysList].join('/');
  //   this.apiService.apiGetRequest(getCompanyUrl)
  //     .subscribe(
  //       response => {
  //       const res = response;
  //       if (res != null && res.status === StatusCodes.pass) {
  //         if (res.response != null) {
  //           console.log(res);
  //           this.companyList = res.response['companiesList'];
  //         }
  //       }
  //         this.spinner.hide();
  //     });
  // }
  getTableData1() {
    const getCompanyUrl = [this.apiConfigService.getBranchesList].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.branchesList = res.response['branchesList'];
            }
          }
          this.spinner.hide();
        });
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
    this.modelFormData.controls['employeeCode'].enable();
  }

  cancel() {
    this.dialogRef.close();
  }

//Get the Employee list data
getEmployeeCode(value) {
  if (value != null && value !== '') {
    const getProductByProductCodeUrl = [this.apiConfigService.getEmpCode].join('/');
    this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: value }).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.['Empcodes'] != null) {
              this.getEmployeeCodeList = res.response['Empcodes'];
              this.spinner.hide();
            }
          }
        }
      });
  } else {
    this.getEmployeeCodeList = [];
  }
}

}

