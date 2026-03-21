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
    selector: 'app-pump',
    templateUrl: './pump.component.html',
    styleUrls: ['./pump.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class PumpComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
  BranchesList: any;
  getCashPaymentBranchesListArray: any;
    ProductGroupsList: any;

  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<PumpComponent>,

    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      branchId: [null],
      branchCode: [null],
      branchName: [null],
      productId: [null],
      productCode: [null],
      productName: [null],
      tankId: [null],
      tankNo: [null],
      pumpNo: [null],
      pumpCapacityinLtrs: [null],
      meterReading: [null],
      isWorking: [null],
      pumpId: "0"

    });


    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['pumpNo'].disable();
    }

  }

  ngOnInit() {
    this.GetBranchesList();
    this.GetProductGroupsList();
  }

  GetBranchesList() {
    const getBranchesListUrl = [this.apiConfigService.getCashPaymentBranchesList].join('/');
    this.apiService.apiGetRequest(getBranchesListUrl)
      .subscribe(
        response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.BranchesList = res.response['BranchesList'];
          }
        }
          this.spinner.hide();
      });
  }
  GetProductGroupsList() {
    const getProductGroupsListUrl = [this.apiConfigService.GetProductGroups].join('/');
    this.apiService.apiGetRequest(getProductGroupsListUrl)
      .subscribe(
        response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.ProductGroupsList = res.response['ProductGroupsList'];
          }
        }
          this.spinner.hide();
      });
  }


  getbranchCodeList() {
    const getbranchcodeList = [this.apiConfigService.GetBranchcodes, this.modelFormData.get('branchName').value].join('/');
    this.apiService.apiGetRequest(getbranchcodeList)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.getCashPaymentBranchesListArray = res.response['branchcode'];
              this.modelFormData.patchValue({
                branchCode: this.getCashPaymentBranchesListArray[0]['id'],
                tankNo: this.getCashPaymentBranchesListArray[0]['name'],
              })
            }
          }
          this.spinner.hide();
        });

  }
  getGetProductGroupsNamesList() {
    const getProductGroupsNamesList = [this.apiConfigService.GetProductGroupsNames, this.modelFormData.get('productCode').value].join('/');
    this.apiService.apiGetRequest(getProductGroupsNamesList)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.getCashPaymentBranchesListArray = res.response['ProductGroupsName'];
              this.modelFormData.patchValue({
                productName: this.getCashPaymentBranchesListArray[0]['name'],
              })
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
    this.modelFormData.controls['pumpNo'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
    
  }

  cancel() {
    this.dialogRef.close();
  }

}
