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
    selector: 'app-taxintegration',
    templateUrl: './taxintegration.component.html',
    styleUrls: ['./taxintegration.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class TaxIntegrationComponent  implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted  =  false;
  formData: any;
  taxcodeList:any;
  taxaccList:any;

  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<TaxIntegrationComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService:CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        taxCode: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        branchCode: [null],
        cgst: [null],
        active: [null],
        companyCode: [null],
        ext1: [null],
        ext2: [null],
        description:[null],
        igst: [null],
        sgst: [null],
        ugst:[null]
      });


      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
        //this.modelFormData.controls['taxCode'].disable();
      }

  }

  ngOnInit() {
this.getTaxCodesList();
this.getGLTaxAccountList();
  }

  getTaxCodesList() {
    const getTaxCodesList = ['/', this.apiConfigService.getTaxCodesList].join('/');
    this.apiService.apiGetRequest(getTaxCodesList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.taxcodeList = res.response['TaxcodesList'];
          }
        }
        this.spinner.hide();
      });
  }

  getGLTaxAccountList() {
    const getGLTaxAccountList = ['/', this.apiConfigService.getGLTaxAccountList].join('/');
    this.apiService.apiGetRequest(getGLTaxAccountList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.taxaccList = res.response['GLTaxAccountList'];
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
    this.modelFormData.controls['taxCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
