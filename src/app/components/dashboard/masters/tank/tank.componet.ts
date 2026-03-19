import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { StatusCodes } from '../../../../enums/common/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { CommonService } from '../../../../services/common.service';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-tank',
    templateUrl: './tank.component.html',
    styleUrls: ['./tank.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class TanksComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
    BranchesList: any;
    getCashPaymentBranchesListArray: any;
    GetBranchesListArray: any;

  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<TanksComponent>,

    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      branchId: [null],
      branchCode: [null],
      branchName: [null],
      tankNo: [null],
      tankCapacityinLtrs: [null],
      noofPumps: [null],
      isWorking: [null],
      productCode: [null],
      itemCode: [null],
      tankId: "0"
      
    });


    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['tankNo'].disable();
    }

  }

  ngOnInit()
  {
    //this.GetBranchesList();
    this.getBranchesList();
  }
  
  GetBranchesList() {
    const getBranchesListUrl = [this.apiConfigService.GetBranches].join('/');
    this.apiService.apiGetRequest(getBranchesListUrl)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.BranchesList = res.response['BranchesList'];
          }
        }
          this.spinner.hide();
      });
  }


  getBranchesList() {
    const getCashPaymentBranchesListUrl = [this.apiConfigService.getCashPaymentBranchesList].join('/');
    this.apiService.apiGetRequest(getCashPaymentBranchesListUrl).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.BranchesList?.length > 0) {
              this.GetBranchesListArray = res.response['BranchesList'];
              this.spinner.hide();
            }
          }
        }
      });
  }


  getproductCodeList()
  {
    
  }

  getbranchCodeList() {
    this.spinner.show();
    const getbranchcodeList = [this.apiConfigService.Getbranchcodes, this.modelFormData.get('branchName').value].join('/');
    this.apiService.apiGetRequest(getbranchcodeList)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.getCashPaymentBranchesListArray = res.response['productcode'];
              this.modelFormData.patchValue({
                branchCode: this.getCashPaymentBranchesListArray[0]['id'],
              })
            }
          }
          this.spinner.hide();
        });
  }

 
 get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid)
    {
      return;
    }
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
    this.modelFormData.controls['tankNo'].enable();
  }

  cancel() {
    this.dialogRef.close();
  }

}
