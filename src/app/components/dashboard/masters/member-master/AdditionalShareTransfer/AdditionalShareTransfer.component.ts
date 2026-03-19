import { Component, Inject, Optional, OnInit, Input, OnChanges } from '@angular/core';

import { ApiService } from '../../../../../services/api.service';

import { AlertService } from '../../../../../services/alert.service';

import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { StatusCodes } from '../../../../../enums/common/common';
import { CommonService } from '../../../../../services/common.service';
import { SnackBar } from '../../../../../enums/common/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../directives/format-datepicker';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 
import { TableComponent } from 'src/app/reuse-components/table/table.component';

@Component({ 
    selector: 'app-AdditionalShareTransfer',
    templateUrl: './AdditionalShareTransfer.component.html',
    styleUrls: ['./AdditionalShareTransfer.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ],
    standalone: true,
    imports: [SharedImportModule, TranslateModule, TableComponent]
})
export class AdditionalShareTransferComponent implements OnInit, OnChanges {

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
  companyList: any;
  tableUrl: any;
  vehicleTypes: any = [];
  getShareMembersListArray:any;
  @Input() memberCode: any;
  @Input() memberName: string;
  @Input() shareTableData: any = [];

  isFormEdit: boolean = false;
  date = new Date((new Date().getTime() - 3888000000));
  getNoOfShares1:any;

  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    // @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    this.modelFormData = this.formBuilder.group({
      shareId: 0,
      shareTransferCode: [null],
      shareCode: 0,
      transferDate: [(new Date()).toISOString()],
      isShareTransfered: [null],
      fromMemberId: 0,
      fromMemberCode: 10000,
      fromMemberName: [null],
      fromMemberSharesBefore: [null],
      fromMemberSharesAfter: [null],
      toMemberId: 0,
      toMemberCode: [null],
      toMemberName:[null],
      toMemberSharesBefore: [null],
      toMemberSharesAfter: [null],
    });

  }

  ngOnChanges() {
    this.formData = this.shareTableData[0];
    this.modelFormData.patchValue({
      toMemberCode:this.memberCode,
      toMemberName:this.memberName
    });
    if (this.formData != null) {
      this.seDefaults();
      this.tableUrl = {
        url: this.apiConfigService.getShareTransfer,
        registerUrl: this.apiConfigService.registerShareTransfer,
        updateUrl: this.apiConfigService.updateVehicle
      }
    }
  }

  seDefaults() {
    
  //   this.modelFormData.controls['memberId'].setValue(this.formData.memberId);
  //  this.modelFormData.controls['toMemberCode'].setValue(this.formData.memberCode);
  //   this.modelFormData.controls['memberId'].disable();
  //   this.modelFormData.controls['memberCode'].disable();
  }

  ngOnInit() {
    this.getAdditionalShareTransferNo();
    this.getShareMembersList();
    this.getNoOfShares();
    this.getToMemberNoOfShares();
    this.getToMemberName();
  }

 

  getAdditionalShareTableData(memberCode) {

    this.apiService.apiGetRequest(this.apiConfigService.getAdditionalShareTransfer + '/' + memberCode)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              // console.log(res);
              this.shareTableData = res.response['ShareList'];
            }
          }
          this.spinner.hide();
        }
      );
  }

  getAdditionalShareTransferNo(){
    this.apiService.apiGetRequest(this.apiConfigService.getAdditionalShareTransferNo)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.modelFormData.patchValue({
              shareTransferCode: res.response['ShareTransferNoList']
              })
            }
          }
          this.spinner.hide();
        }
      );
  }

  getShareMembersList(){
    const getShareMembersListUrl = [this.apiConfigService.getShareMembersList].join('/');
    this.apiService.apiGetRequest(getShareMembersListUrl).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.memberList?.length) {
              this.getShareMembersListArray = res.response['memberList'];
              this.spinner.hide();
            }
          }
        }
      });
  }

  getNoOfShares(){
    this.apiService.apiGetRequest(this.apiConfigService.getNoOfShares + '/' + this.modelFormData.get('fromMemberCode').value)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              // this.getNoOfShares1 = res.response['noOfsharesList'];
              this.modelFormData.patchValue({
                fromMemberSharesBefore:res.response['noOfsharesList']
              });
            }
          }
          this.spinner.hide();
        }
      );
  }

  getToMemberNoOfShares(){
    this.apiService.apiGetRequest(this.apiConfigService.getNoOfShares + '/' + this.modelFormData.get('toMemberCode').value)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              // this.getNoOfShares1 = res.response['noOfsharesList'];
              this.modelFormData.patchValue({
                toMemberSharesBefore:res.response['noOfsharesList']
              });
            }
          }
          this.spinner.hide();
        }
      );
  }

  getToMemberName(){
    this.apiService.apiGetRequest(this.apiConfigService.getToMemberName + '/' + this.modelFormData.get('toMemberCode').value)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.modelFormData.patchValue({
                toMemberName:res.response['memberName']
              });
            }
          }
          this.spinner.hide();
        }
      );
  }

  setMemberCode() {
    const bname = this.getShareMembersListArray.filter(fromMemberCode => {
      if (fromMemberCode.id == this.modelFormData.get('fromMemberCode').value) {
        return fromMemberCode;
      }
    });
    if (bname.length) {
      this.modelFormData.patchValue({
        fromMembername: (bname[0] != null) ? bname[0].text : null
      });
    }
  }

  get formControls() { return this.modelFormData.controls; }

  addOrUpdateEvent(value) {
    if (value.action == 'Edit') {
      this.formData = value.item;
      if (this.formData != null) {
        this.modelFormData.patchValue(this.formData);
        this.modelFormData.controls['shareId'].disable();
        // this.modelFormData.controls['memberCode'].disable();
        this.isFormEdit = true;
      }
    }
  }

  save() {
  
    if (this.modelFormData.invalid) {
      return;
    }

    this.modelFormData.controls['shareId'].enable();
    // this.modelFormData.controls['memberCode'].enable();

    let memberCode =this.memberCode;// this.modelFormData.controls['memberCode'].value;
    // this.modelFormData.patchValue({
    //   fromDate:this.commonService.formatDate(this.modelFormData.get('fromDate').value),
    //   toDate:this.commonService.formatDate(this.modelFormData.get('toDate').value)
    // });
    if (!this.isFormEdit) {
      this.apiService.apiPostRequest(this.apiConfigService.registerShareTransfer + '/' + memberCode, this.modelFormData.value)
        .subscribe(
          response => {
            const res = response.body;
            if (res != null && res.status === StatusCodes.pass) {
              if (res.response != null) {
                this.alertService.openSnackBar('Record Added...', 'close', SnackBar.success);
                this.reset();
                this.getAdditionalShareTableData(memberCode);
              }
            }
            this.spinner.hide();
          }
        );
    }

    else if (this.isFormEdit) {

      this.apiService.apiUpdateRequest(this.tableUrl.updateUrl, this.modelFormData.value)
        .subscribe(
          response => {
            const res = response.body;
            if (res != null && res.status === StatusCodes.pass) {
              if (res.response != null) {
                this.alertService.openSnackBar('Record Updated...', 'close', SnackBar.success);
                this.reset();
                this.getAdditionalShareTableData(memberCode);
              }
            }
            this.spinner.hide();
          }
        );
    }

  }

  reset() {
    this.modelFormData.reset();
    this.seDefaults();
  }

}

