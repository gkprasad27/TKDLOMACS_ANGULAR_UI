import { Component, Inject, Optional, OnInit } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from '../../../../services/alert.service';

import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { DatePipe, formatDate } from '@angular/common';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';


interface Session {
  value: string;
  viewValue: string;
}

@Component({ 
  selector: 'app-packageconversion',
  templateUrl: './packageconversion.component.html',
  styleUrls: ['./packageconversion.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})

export class PackageconversionComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
  LeaveTypeatList: any;
  inputproductName = null;
  outputproductName = null;
  applDate = new UntypedFormControl(new Date());

  sessions: Session[] =
    [
      { value: 'FirstHalf', viewValue: 'FirstHalf' },
      { value: 'SecondHalf', viewValue: 'SecondHalf' }
    ];
    inputcodeList: any;
    outcodeList: any;
    getCashPaymentBranchesListArray: any;
  
  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<PackageconversionComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      inputProductId: "0",
      inputproductCode: [null],
      inputproductName: [null],
      outputProductId: "0",
      outputproductCode: [null],
      outputproductName: [null],
      inputQty: [null],
      outputQty: [null],
      addDate: [null],
      packingConversionId: "0"
    });



    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['packingConversionId'].disable();
    }

  }

  ngOnInit() {
     this.GetInputcodeproductList();
    //this.GetouttcodeproductList();
  }
  GetInputcodeproductList() {
    const getCompanyUrl = ['/', this.apiConfigService.getInputcodeproductList].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              //this.companyList = res.response['companiesList'];
              this.inputcodeList = res.response['InputcodeList'];
              this.outcodeList = res.response['InputcodeList'];
            }
          }
          this.spinner.hide();
        });
  }
   //GetInputcodeproductList() {
   //  const getCostCentersListUrl = ['/', this.apiConfigService.getInputcodeproductList].join('/');
   //  this.commonService.apiCall(getCostCentersListUrl, (data) => {
   //    this.inputcodeList = data['InputcodeList'];
   //    this.outcodeList = data['InputcodeList'];
   //    console.log(data);
   //  });
   //}
 
  
  getproductCodeList() {
    //debugger;
    this.spinner.show();
    const getbranchcodeList = ['/', this.apiConfigService.GetproductNames, this.modelFormData.get('inputproductCode').value].join('/');
    this.apiService.apiGetRequest(getbranchcodeList)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.getCashPaymentBranchesListArray = res.response['productNames'];
              this.modelFormData.patchValue({
                inputproductName: this.getCashPaymentBranchesListArray[0]['name'],
              })
            }
          }
          this.spinner.hide();
        }, error => {

        });
  }
  getoutproductCodeList() {
   // debugger;
    this.spinner.show();
    const getbranchcodeList = ['/', this.apiConfigService.GetproductNames, this.modelFormData.get('outputproductCode').value].join('/');
    this.apiService.apiGetRequest(getbranchcodeList)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.getCashPaymentBranchesListArray = res.response['productNames'];
              this.modelFormData.patchValue({
                outputproductName: this.getCashPaymentBranchesListArray[0]['name'],
              })
            }
          }
          this.spinner.hide();
        }, error => {

        });
  }
  showErrorAlert(caption: string, message: string) {
    // this.alertService.openSnackBar(caption, message);
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    //debugger;
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
