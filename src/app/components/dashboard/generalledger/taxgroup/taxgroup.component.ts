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
    selector: 'app-taxgroup',
    templateUrl: './taxgroup.component.html',
    styleUrls: ['./taxgroup.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class TaxgroupsComponent implements OnInit {

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
    public dialogRef: MatDialogRef<TaxgroupsComponent>,

    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      taxGroupId: "0",
      taxGroupCode: [null],
      taxGroupName: [null],
      productGroupId: [null],
      productGroupCode: [null],
      productGroupName: [null],
      narration: [null],
      productLedgerId: [null],
      productLedgerName: [null]
    });


    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['taxGroupCode'].disable();
    }

  }

  ngOnInit() {
    this.GetProductGroupsList();
  }

 
  GetProductGroupsList() {
    const getProductGroupsListUrl = ['/', this.apiConfigService.GetProductGroups].join('/');
    this.apiService.apiGetRequest(getProductGroupsListUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.ProductGroupsList = res.response['ProductGroupsList'];
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
    this.modelFormData.controls['taxGroupCode'].enable();
  }

  cancel() {
    this.dialogRef.close();
  }
  getGetProductGroupsNamesList() {
    
  }

}
