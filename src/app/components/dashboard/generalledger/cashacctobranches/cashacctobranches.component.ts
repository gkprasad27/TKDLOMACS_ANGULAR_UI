import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';

import { CommonService } from 'src/app/services/common.service';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-cashacctobranches',
    templateUrl: './cashacctobranches.component.html',
    styleUrls: ['./cashacctobranches.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class CashAccToBranchesComponent  implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted  =  false;
  formData: any;
  branchesList:any;
  bankList:any;
  cashaccList:any;
  glaccgrpList:any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<CashAccToBranchesComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService:CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
        branchCode: [null, [Validators.required]],
        active: [null],
        bankGlacc: [null],
        ext1: [null],
        ext2: [null],
        cashGlacc:[null],
      });


      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
        this.modelFormData.controls['code'].disable();
      }

  }

  ngOnInit() {
this.getCashAccBranchesList();
this.getBankAccounts();
this.getCashAccounts();
  }

  getCashAccBranchesList() {
    const getCashAccBranchesList = [this.apiConfigService.getCashAccBranchesList].join('/');
    this.apiService.apiGetRequest(getCashAccBranchesList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.branchesList = res.response['BranchesList'];
          }
        }
        this.spinner.hide();
      });
  }

  getBankAccounts() {
    const getBankAccounts = [this.apiConfigService.getBankAccounts].join('/');
    this.apiService.apiGetRequest(getBankAccounts)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.bankList = res.response['GLCasnBankAccounts'];
          }
        }
        this.spinner.hide();
      });
  }

  getCashAccounts() {
    const getCashAccounts = [this.apiConfigService.getCashAccounts].join('/');
    this.apiService.apiGetRequest(getCashAccounts)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.cashaccList = res.response['GLCashAccounts'];
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
    this.modelFormData.controls['code'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
