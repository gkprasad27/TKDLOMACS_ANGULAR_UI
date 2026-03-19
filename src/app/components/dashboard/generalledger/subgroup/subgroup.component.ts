import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';

import { CommonService } from 'src/app/services/common.service';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-subgroup',
    templateUrl: './subgroup.component.html',
    styleUrls: ['./subgroup.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class SubGroupComponent  implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted  =  false;
  formData: any;
  accGroupList:any;

  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<SubGroupComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService:CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        subGroupCode: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        subGroupName: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        accGroup: [null,[Validators.required]],
        underSubGroupCode: [null],
        active:[null],
        ext1:[null],
        ext2:[null]
      });


      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
        this.modelFormData.controls['subGroupCode'].disable();
      }

  }

  ngOnInit() {
this.getAccgrpList();
  }

  getAccgrpList() {
    const getAccgrpList = [this.apiConfigService.getAccgrpList].join('/');
    this.apiService.apiGetRequest(getAccgrpList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.accGroupList = res.response['GLAccountGroupList'];
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
    this.modelFormData.controls['subGroupCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
