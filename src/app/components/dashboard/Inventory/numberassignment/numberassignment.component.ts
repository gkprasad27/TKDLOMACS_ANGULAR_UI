import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { StatusCodes } from '../../../../enums/common/common';
import { CommonService } from 'src/app/services/common.service';


import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-numberassignment',
    templateUrl: './numberassignment.component.html',
    styleUrls: ['./numberassignment.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class NumberAssignmentComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
    companyList: any;
    MaterialGroupsList: any;
    getProductGroup: any;

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<NumberAssignmentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      companyCode: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      description: [null],
      ext1: [null],
      ext2: [null],
      materialGroup: [null],
      noType: [null],
      numberInterval: [null],
      active: ['Y']
    });


    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['code'].disable();
    }

  }

  ngOnInit() {
    this.getTableData();
    this.getProductGroupList();

    //this.getMaterialGroupsList();
  }

  getTableData() {
    const getCompanyUrl = [this.apiConfigService.getCompaniesList].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.companyList = res.response['CompaniesList'];
            }
          }
          this.spinner.hide();
        });
  }
  getProductGroupList() {
    const getProductGroupList = [this.apiConfigService.getProductGroupList].join('/');
    this.apiService.apiGetRequest(getProductGroupList)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.getProductGroup = res.response['ProductGroupList'];
            }
          }
          this.spinner.hide();
        });
  }


  getMaterialGroupsList() {
    const getCompanyUrl = [this.apiConfigService.getMaterialGroupsList].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.MaterialGroupsList = res.response['materialGroupList'];
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
    //this.modelFormData.controls['code'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
