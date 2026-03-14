import { Component, Inject, Optional, OnInit } from '@angular/core';

import { ApiService } from '../../../../services/api.service';

import { AlertService } from '../../../../services/alert.service';

import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-employee-in-branch',
    templateUrl: './employee-in-branch.component.html',
    styleUrls: ['./employee-in-branch.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class EmployeeInBranchComponent implements OnInit {

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
    public dialogRef: MatDialogRef<EmployeeInBranchComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

    this.modelFormData = this.formBuilder.group({
      
      branchCode: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      empCode: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(6)]],
      empName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      ext1: [null],
      ext2: [null],
      fromDate: [null],
      toDate: [null],
      active: ['Y'],
      seqId: ['0'],
      addDate: [null]

      });

      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
        this.modelFormData.controls['branchCode'].disable();
      }

  }

  ngOnInit() {
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['branchCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

