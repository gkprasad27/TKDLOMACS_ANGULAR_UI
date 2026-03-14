import { Component, Inject, Optional, OnInit } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from '../../../../services/alert.service';

import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-leavetypes',
    templateUrl: './leavetypes.component.html',
    styleUrls: ['./leavetypes.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class LeavetypesComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
  apiConfigService: any;
  apiService: any;
  companyList: any;


  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<LeavetypesComponent>,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      leaveCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      companyCode: [null],
      companyName: [null],
      id: 0,
      leaveMaxLimit: [null],
      leaveName: [null]
    });

    //leaveCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      //leaveName: ['', [Validators.required, Validators.minLength(2)]],
      //leaveMaxLimit: [null],
      //ext1: [null],
      //leaveMinLimit: [null],
      //companyCode: [null],
      //active: [null],
      //addDate: [null],
      //branchCode: [null],
      //remarks: [null],
    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
    }

  }

  ngOnInit() {
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
