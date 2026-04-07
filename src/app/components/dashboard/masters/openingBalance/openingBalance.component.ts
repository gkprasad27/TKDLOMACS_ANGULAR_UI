import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';

import { CommonService } from '../../../../services/common.service';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({ 
    selector: 'openingBalance',
    templateUrl: './openingBalance.component.html',
    styleUrls: ['./openingBalance.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})

export class OpeningBalanceComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  voucherClass: any;
  compList: any;
  getBranchesListArray: any[] = [];
  GetPaymentListArray: any[] = [];
  GetBankPAccountLedgerListArray: any[] = [];

  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<OpeningBalanceComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      // departmentId: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      // departmentName: ['', [Validators.required, Validators.minLength(2)]],
      openingBalanceId:  ['0'],
      branchCode: [null],
      branchName:[null],
      voucherNo:[null],
      paymentTypeId: [null],
      openingBalanceDate: [null],
      narration: [null],
      ledgerCode: [null],
      ledgerName: [null],
      amount:[null]
    });


    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
    }

  }

  ngOnInit() {
    this.getOpeningBalBranchesList();
    this.getPaymentType();
    this.commonService.setFocus('ledgerName');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.branchCode != null) {
      this.modelFormData.patchValue({
        branchCode: +user.branchCode,
        userId: user.seqId,
        userName: user.userName
      });
      this.genarateVoucherNo(user.branchCode);
    }
  }
 
  getOpeningBalBranchesList() {
    const getOpeningBalBranchesListUrl = [this.apiConfigService.getObBranchesList].join('/');
   this.apiService.apiGetRequest(getOpeningBalBranchesListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.BranchesList?.length > 0) {
              this.getBranchesListArray = res.response['BranchesList'];
              this.spinner.hide();
            }
          }
        }
      });
  }

  getPaymentType() {
    const getPaymentTypeListUrl = [this.apiConfigService.getPaymentType].join('/');
   this.apiService.apiGetRequest(getPaymentTypeListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.BranchesList?.length > 0) {
              this.GetPaymentListArray = res.response['BranchesList'];
              this.spinner.hide();
            }
          }
        }
      });
  }

  genarateVoucherNo(branch?) {
    let genarateVoucherNoUrl;
    if (branch != null) {
      genarateVoucherNoUrl = [this.apiConfigService.getObVoucherNo, branch].join('/');
    } else {
      genarateVoucherNoUrl = [this.apiConfigService.getObVoucherNo, this.modelFormData.get('branchCode').value].join('/');
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.BranchesList != null) {
              this.modelFormData.patchValue({
                voucherNo: res.response['BranchesList']
              });
              this.spinner.hide();
            }
          }
        }
      });
  }
  getBankPAccountLedgerList(value) {
    if (value != null && value !== '') {
      const getBankPAccountLedgerListUrl = [this.apiConfigService.getBPAccountLedgerList, value].join('/');
      this.apiService.apiGetRequest(getBankPAccountLedgerListUrl).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.AccountLedgerList?.length > 0) {
                this.GetBankPAccountLedgerListArray = res.response['AccountLedgerList'];
              } else {
                this.GetBankPAccountLedgerListArray = [];
              }
            }
            this.spinner.hide();
          }
        });
    } else {
      this.GetBankPAccountLedgerListArray = [];
    }
  }

  // setLedgerName(value) {
  //   const lname = this.GetBankPAccountLedgerListArray.filter(lCode => {
  //     if (lCode.id == this.modelFormData.get('ledgerCode').value) {
  //       return lCode;
  //     }
  //   });
  //   this.modelFormData.patchValue({
  //     ledgerName:  (lname[0] != null) ? lname[0].text : null
  //   });
  // }

  // setBranchCode() {
  //   const bname = this.getBranchesListArray.filter(branchCode => {
  //     if (branchCode.id == this.modelFormData.get('branchCode').value) {
  //       return branchCode;
  //     }
  //   });
  //   if (bname.length) {
  //     this.modelFormData.patchValue({
  //       branchName: (bname[0] != null) ? bname[0].text : null
  //     });
  //   }
  // }

  get formControls() { return this.modelFormData.controls; }


  save() {
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
