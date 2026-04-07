import { Component, Inject, Optional, OnInit } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from '../../../../services/alert.service';

import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-division',
    templateUrl: './division.component.html',
    styleUrls: ['./division.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class DivisionComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted  =  false;
  formData: any;
    apiConfigService: any;
    apiService: any;
    companyList: any;


  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DivisionComponent>,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
        description: ['', [Validators.required, Validators.minLength(2)]],
        ext1: [null],
        ext2: [null],
        responsiblePerson: [null],
        active: [null],
      });


      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
       this.modelFormData.controls['code'].disable();
      }

  }

  ngOnInit() {
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
