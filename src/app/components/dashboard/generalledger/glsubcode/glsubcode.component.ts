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
    selector: 'app-glsubcode',
    templateUrl: './glsubcode.component.html',
    styleUrls: ['./glsubcode.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class GlSubcodeComponent  implements OnInit {

  modelFormData: FormGroup;
  isSubmitted  =  false;
  formData: any;
  glaccsubgrpList:any;

  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<GlSubcodeComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService:CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        subCode: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        description: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        ext1: [null],
        active: [null],
        ext2: [null],
        glcode: [null, [Validators.required]]
      });


      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
        this.modelFormData.controls['subCode'].disable();
      }

  }

  ngOnInit() {
this.getGLSubCodeAccountsList();
  }


  getGLSubCodeAccountsList() {
    const getGLSubCodeAccountsList = [this.apiConfigService.getGLSubCodeAccountsList].join('/');
    this.apiService.apiGetRequest(getGLSubCodeAccountsList)
      .subscribe(
        response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.glaccsubgrpList = res.response['GLUnderSubGroupList'];
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
    this.modelFormData.controls['subCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
