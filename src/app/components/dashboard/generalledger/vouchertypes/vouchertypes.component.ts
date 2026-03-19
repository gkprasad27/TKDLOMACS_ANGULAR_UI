import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';

import { CommonService } from '../../../../services/common.service';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'vouchertypes',
    templateUrl: './vouchertypes.component.html',
    styleUrls: ['./vouchertypes.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class VoucherTypesComponent  implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted  =  false;
  formData: any;
  voucherClass:any;
  compList:any;
  branchList:any;

  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<VoucherTypesComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService:CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        voucherCode: [null],
        branch: [null, [Validators.required]],
        company: [null, [Validators.required]],
        active: [null],
        noSeries: [null],
        ext1: [null],
        ext2: [null],
        period:[null],
        prefix: [null],
        transaction: [null],
        voucherType:[null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
      });


      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
        //this.modelFormData.controls['voucherCode'].disable();
      }

  }

  ngOnInit()
  {
 this.getVoucherBranchesList();
this.getVoucherClassList();
this.getCompaniesList();
  }

  getVoucherClassList() {
    const getVoucherClassList = [this.apiConfigService.getVoucherClassList].join('/');
    this.apiService.apiGetRequest(getVoucherClassList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.voucherClass = res.response['VoucherClassList'];
            console.log(this.voucherClass);
          }
        }
        this.spinner.hide();
      });
  }

  getCompaniesList() {
    const getCompaniesList = [this.apiConfigService.getCompaniesList].join('/');
    this.apiService.apiGetRequest(getCompaniesList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.compList = res.response['CompaniesList'];
          }
        }
        this.spinner.hide();
      });
  }

  getVoucherBranchesList() {
    const getVoucherBranchesList = [this.apiConfigService.getVoucherBranchesList].join('/');
    this.apiService.apiGetRequest(getVoucherBranchesList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.branchList = res.response['BranchesList'];
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
   // this.modelFormData.controls['voucherCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
