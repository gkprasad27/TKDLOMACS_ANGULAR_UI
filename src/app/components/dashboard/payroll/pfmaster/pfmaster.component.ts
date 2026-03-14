import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';

import { CommonService } from '../../../../services/common.service';

interface ContributionType {
  value: string;
  viewValue: string;
}

interface Limit {
  value: string;
  viewValue: string;
}

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-pfmaster',
    templateUrl: './pfmaster.component.html',
    styleUrls: ['./pfmaster.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class PFMasterComponent  implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted  =  false;
  formData: any;
  componentList:any;

  limit : Limit[]=
  [
    { value: 'Yes', viewValue: 'Yes' },
    { value: 'No', viewValue: 'No' }
  ];

  contributionType : ContributionType[]=
  [
    { value: 'Employee', viewValue: 'Employee' },
    { value: 'Employer', viewValue: 'Employer' },
    { value: 'Both', viewValue: 'Both' }
  ];

  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<PFMasterComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService:CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        pftypeName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
        limit: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        componentCode: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
        componentName: [null],
        employeeContribution: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
        employerContribution: [null, [Validators.required,  Validators.minLength(1), Validators.maxLength(10)]],
        companyCode: [null],
        branchCode: [null], 
        active: [null],
        id:['0'],
        contributionType: [null]
      });


      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
      }

  }

  ngOnInit() {
       this.getPfComponentsList();
  }

  getPfComponentsList() {
    const getPfComponentsList = ['/', this.apiConfigService.getPfComponentsList].join('/');
    this.apiService.apiGetRequest(getPfComponentsList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.componentList = res.response['ComponentList'];
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
  }

  cancel() {
    this.dialogRef.close();
  }

}
