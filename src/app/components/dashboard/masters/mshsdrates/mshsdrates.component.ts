import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';

import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

interface affectGrossProfit {
  value: string;
  viewValue: string;
}

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-mshsdrates',
    templateUrl: './mshsdrates.component.html',
    styleUrls: ['./mshsdrates.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class MSHSDRatesComponent  implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted  =  false;
  formData: any;
  getMshsdBranches:any;
  getMshsdProductList:any;
  glAccNameList:any;


  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<MSHSDRatesComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService:CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        id: 0,
        branchCode: [null, [Validators.required]],
        branchName: [null],
        productCode: [null],
        productName: [null],
        rate: [null],
      });


      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
        this.modelFormData.controls['id'].disable();
        this.modelFormData.controls['branchCode'].disable();
        this.modelFormData.controls['productCode'].disable();
      }
      else{
        const user = JSON.parse(localStorage.getItem('user'));
       if (user?.branchCode != null) {
        this.modelFormData.patchValue({
          branchCode: user.branchCode,
          userId: user.seqId,
          userName: user.userName
        });
      
      }
      }
  }

  ngOnInit() {
this.getMshsdBranchesList();
this.getProductList();
  }

  getMshsdBranchesList() {
    const getMshsdBranchesList = [this.apiConfigService.getMshsdBranchesList].join('/');
    this.apiService.apiGetRequest(getMshsdBranchesList)
      .subscribe(
        response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.getMshsdBranches = res.response['mshsdBranchesList'];
          }
        }
        this.spinner.hide();
      });
  }

  getProductList() {
    const getProductList = [this.apiConfigService.getProductList].join('/');
    this.apiService.apiGetRequest(getProductList)
      .subscribe(
        response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.getMshsdProductList = res.response['mshsdProductsList'];
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
    this.modelFormData.controls['id'].enable();
    this.modelFormData.controls['branchCode'].enable();
        this.modelFormData.controls['productCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
