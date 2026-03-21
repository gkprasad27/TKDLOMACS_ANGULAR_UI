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
    selector: 'app-taxstructure',
    templateUrl: './taxstructure.component.html',
    styleUrls: ['./taxstructure.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class TaxstructuresComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
  BranchesList: any;
  getCashPaymentBranchesListArray: any;
    TaxGroupsList: any;
    PSGroupsList: any;

  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<TaxstructuresComponent>,

    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      taxStructureId: "0",
      taxStructureCode: [null],
      taxGroupId: "0",
      taxGroupCode: "0",
      taxGroupName: [null],
      description: [null],
      fromDate: [null],
      toDate: [null],
      purchaseAccount: [null],
      salesAccount: [null],
      totalPercentageGst: [null],
      cgst: [null],
      sgst: [null],
      igst: [null],
      totalGst: [null],
      narration: [null]

    });


    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['taxStructureCode'].disable();
    }

  }

  ngOnInit() {
    this.GetTaxGroupsList();
    this.GetPurchaseAccountsList();
  }

  setTotalGST(val) {
    this.modelFormData.patchValue({
      totalGst: val
    });
  }

  GetTaxGroupsList() {
    const getTaxGroupsListUrl = [this.apiConfigService.TaxGroupsLists].join('/');
    this.apiService.apiGetRequest(getTaxGroupsListUrl)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.TaxGroupsList = res.response['TaxGroupsList'];
            }
          }
          this.spinner.hide();
        });

  }
  GetPurchaseAccountsList() {
    const getTaxGroupsListUrl = [this.apiConfigService.PurchaseAccountsList].join('/');
    this.apiService.apiGetRequest(getTaxGroupsListUrl)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.PSGroupsList = res.response['PSGroupsList'];
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
    this.modelFormData.controls['taxStructureCode'].enable();
  }

  cancel() {
    this.dialogRef.close();
  }

}
