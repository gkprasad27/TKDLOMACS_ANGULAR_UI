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
    selector: 'app-undersubgroup',
    templateUrl: './undersubgroup.component.html',
    styleUrls: ['./undersubgroup.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class UndersubGroupComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
  glAccgrpList: any;
  getAccSubGrpList: any;
  glAccNameList: any;
  glsubAccNameList: any;

  affectGrossProfit: affectGrossProfit[] =
    [
      { value: 'Yes', viewValue: 'Yes' },
      { value: 'No', viewValue: 'No' }
    ];

  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<UndersubGroupComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      accountGroupId: 0,
      accountGroupName: [null, [Validators.required]],
      nature: [null, [Validators.required]],
      narration: [null],
      affectGrossProfit: [null],
      extraDate: [null],
      extra1: [null],
      extra2: [null],
      groupUnder: [null],
      Undersubaccount: [null]
    });


    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['accountGroupId'].disable();
      this.getGLUnderGroupList();
      this.getAccountNamelist();
    }

  }

  ngOnInit() {
    this.getglAccgrpList();
    //this.getAccountNamelist();
  }

  getglAccgrpList() {
    const getglAccgrpList = ['/', this.apiConfigService.getglAccgrpList].join('/');
    this.apiService.apiGetRequest(getglAccgrpList)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.glAccgrpList = res.response['GLAccGroupList'];
            }
          }
          this.spinner.hide();
        });
  }

  getAccountNamelist() {
    const getAccountNamelist = ['/', this.apiConfigService.getAccountNamelist, this.modelFormData.get('nature').value].join('/');
    this.apiService.apiGetRequest(getAccountNamelist)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.glAccNameList = res.response['GetAccountNamelist'];
            }
          }
          this.spinner.hide();
        });
  }

  getGLUnderGroupList() {
    const getGLUnderGroupList = ['/', this.apiConfigService.getGLUnderGroupList, this.modelFormData.get('groupUnder').value].join('/');
    this.apiService.apiGetRequest(getGLUnderGroupList)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.getAccSubGrpList = res.response['GetAccountSubGrouplist'];
            }
          }
          this.spinner.hide();
        });
  }

  getAccountSubGrouplist() {
    const getAccountSubGrouplist = ['/', this.apiConfigService.getAccountSubGrouplist,
      this.modelFormData.get('groupName').value].join('/');
    this.apiService.apiGetRequest(getAccountSubGrouplist)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.glAccNameList = res.response['GLAccSubGroupList'];
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
    this.modelFormData.controls['accountGroupId'].enable();
    this.formData.item = this.modelFormData.value;
    (this.formData.item.Undersubaccount != null) ? this.formData.item.groupUnder = this.formData.item.Undersubaccount : null;
    console.log(this.formData)
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
