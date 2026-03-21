import { Component, Inject, Optional, OnInit } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from '../../../../services/alert.service';

import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { CommonService } from '../../../../services/common.service';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-profit-center',
    templateUrl: './profit-center.component.html',
    styleUrls: ['./profit-center.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class ProfitCenterComponent implements OnInit {


  modelFormData: UntypedFormGroup;
  isSubmitted  =  false;
  formData: any;
  companyList: any;


  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ProfitCenterComponent>,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
        name: [null, [Validators.required, Validators.minLength(2)]],
        seqId: ['0'],
        compCode: [null],
        address1: [null],
        address2: [null],
        address3: [null],
        address4: [null],
        place: [null],
        state: [null],
        pinCode: [null],
        phone1: [null],
        phone2: [null],
        phone3: [null],
        email: [null],
        addDate:[null],
        responsiblePerson: [null],
        active: ['Y'],
      });

      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
        this.modelFormData.controls['seqId'].disable();
      }

  }

  ngOnInit() {
    this.companiesListData();
  }

  companiesListData() {
    const getCompanyUrl = [this.apiConfigService.getCompanysList].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.companyList = res.response['companiesList'];
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
    this.modelFormData.controls['seqId'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
