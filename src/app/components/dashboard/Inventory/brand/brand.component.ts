import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { ApiService } from '../../../../services/api.service';
import { ApiConfigService } from '../../../../services/api-config.service';

import { CommonService } from 'src/app/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-brand',
    templateUrl: './brand.component.html',
    styleUrls: ['./brand.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class BrandComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  companyList: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<BrandComponent>,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      brandName: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      compCode: [null],
      customerCare:[null],
      ext1: [null],
      ext2: [null],
      active: ['Y']
    });


    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }

  }

  ngOnInit() {
    this.getTableData();
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
