import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { StatusCodes } from '../../../../enums/common/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-brandmodel',
    templateUrl: './brandmodel.component.html',
    styleUrls: ['./brandmodel.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class BrandModelComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
    companyList: any;
    brandList: any;
    MaterialGroupsList: any;
    SizesList: any;

  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<BrandModelComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      brandName: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      closingStock: [null],
      compName: [null],
      description: [null],
      ext1: [null],
      ext2: [null],
      ext3: [null],
      itemCode: [null],
      rate: [null],
      brandCode: [null],
      ext4: [null],
      ext5: [null],
      ext6: [null],
      hsncode: [null],
      inputTaxCode: [null],
      materialGroupCode: [null],
      modelName: [null],
      outputTaxCode: [null],
      size: [null],
      active: "Y"
    });


    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }

  }

  ngOnInit() {
    this.getCompiniesList();
    this.getbrandTableData();
    this.getMaterialGroupsList();
    this.getSizesList();
  }

  getCompiniesList() {
    const getCompiniesListList = [this.apiConfigService.getCompaniesList].join('/');
    this.apiService.apiGetRequest(getCompiniesListList)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.companyList = res.response['CompaniesList'];
            }
          }
          this.spinner.hide();
        });
  }
  //getTableData() {
  //  const getCompanyUrl = [this.apiConfigService.getCompaniesList].join('/');
  //  this.apiService.apiGetRequest(getCompanyUrl)
  //    .subscribe(
  //      response => {
  //        const res = response.body;
  //        if (res != null && res.status === StatusCodes.pass) {
  //          if (res.response != null) {
  //            console.log(res);
  //            this.companyList = res.response['companiesList'];
  //          }
  //        }
  //        this.spinner.hide();
  //      });
  //}

  getbrandTableData() {
    const getCompanyUrl = [this.apiConfigService.getBrandList].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.brandList = res.response['BrandList'];
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
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.MaterialGroupsList = res.response['materialGroupList'];
            }
          }
          this.spinner.hide();
        });
  }

  getSizesList()  {
    const getCompanyUrl = [this.apiConfigService.getSizesList].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.SizesList = res.response['sizesList'];
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
