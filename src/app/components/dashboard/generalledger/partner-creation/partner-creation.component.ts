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
    selector: 'app-partner-creation',
    templateUrl: './partner-creation.component.html',
    styleUrls: ['./partner-creation.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class PartnerCreationComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted  =  false;
  formData: any;
  branchesList : any;
  companyList: any;
    partnerTypeList: any;
    balanceTypeList: any;
    getNatureList: any;

  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<PartnerCreationComponent>,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
        name: [null, [Validators.required, Validators.minLength(2)]],
        branchCode: [null],
        compCode: [null],
        address1: [null],
        address2: [null],
        address3: [null],
        address4: [null],
        contactPerson: [null],
        email: [null],
        ext1: [null],
        ext2: [null],
        glcontrolAcc: [null],
        gstno: [null],
        nacture: [null],
        partnertype: [null],
        phone1: [null],
        phone2: [null],
        pinCode: [null],
        place: [null],
        state: [null],
        addDate: [null],
        editDate: [null],
        addWho: [null],
        editWho: [null],
        balance: [null],
        balanceType: [null],
        ext3: [null],
        ext4: [null],
        ext5: [null],
        active: [null]

      });

      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
       // this.modelFormData.controls['code'].disable();
      }

  }

  ngOnInit() {
    this.branchesListData();
    this.companiesListData();
    this.PartnerTypesListData();
    this.getBalanceTypesData();
    this.getNatureListData();
  }

  companiesListData() {
    const getCompanyUrl = ['/', this.apiConfigService.getCompanysList].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.companyList = res.response['companiesList'];
          }
        }
          this.spinner.hide();
      });
  }

  branchesListData() {
    const getCompanyUrl = ['/', this.apiConfigService.getBranchesPartnerCreationList].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.branchesList = res.response['branchesList'];
            console.log(res);
          }
        }
          this.spinner.hide();
      });
  }
  PartnerTypesListData()
  {
    const getCompanyUrl = ['/', this.apiConfigService.getPartnerPartnerCreationTypes].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.partnerTypeList = res.response['partnerTypeList'];
              console.log(res);
            }
          }
          this.spinner.hide();
        });
  }
  getBalanceTypesData()
  {
    const getCompanyUrl = ['/', this.apiConfigService.getBalanceTypes].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.balanceTypeList = res.response['partnerCreationList'];
              console.log(res);
            }
          }
          this.spinner.hide();
        });
  }
  getNatureListData() {
    const getCompanyUrl = ['/', this.apiConfigService.getNatureList].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.getNatureList = res.response['partnerCreationList'];
              console.log(res);
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
    //this.modelFormData.controls['code'].disable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
