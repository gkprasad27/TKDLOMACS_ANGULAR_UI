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

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 
import { TableComponent } from 'src/app/reuse-components';

@Component({ 
    selector: 'app-vehicle',
    templateUrl: './vehicle.component.html',
    styleUrls: ['./vehicle.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule, TableComponent]
})
export class VehicleComponent implements OnInit, OnChanges {

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
  companyList: any;
  tableUrl: any;
  vehicleTypes: any = [];

  @Input() memberCode: any;
  @Input() vehicleTableData: any = [];

  isFormEdit: boolean = false;

  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    // public dialogRef: MatDialogRef<VehicleComponent>,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    // @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    this.modelFormData = this.formBuilder.group({
      vehicleId: [null],
      memberId: [null],
      memberCode: [null],
      memberShares: [null],
      vehicleRegNo: [null],
      vehicleModel: [null],
      isValid: [null],
      fromDate: [null],
      toDate: [null],
      vehicleTypeId: [null],
      vehicleTypeName: [null],
      vehicleType: [null],

    });

  }

  ngOnChanges() {
    this.formData = this.vehicleTableData[0];
    if (this.formData != null) {
      this.seDefaults();
      this.tableUrl = {
        url: this.apiConfigService.getVehicles,
        registerUrl: this.apiConfigService.registerMemberMaster,
        updateUrl: this.apiConfigService.updateVehicle
      }
    }
  }

  seDefaults() {
    //this.modelFormData.controls['memberId'].setValue(this.formData.memberId);
   // this.modelFormData.controls['memberCode'].setValue(this.formData.memberCode);
    this.modelFormData.controls['memberId'].disable();
    this.modelFormData.controls['memberCode'].disable();
  }

  ngOnInit() {
    this.getVehicleTypes();
  }

  getVehicleTypes() {
    this.apiService.apiGetRequest(this.apiConfigService.getVehicleTypes)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              // console.log(res);
              this.vehicleTypes = res.response['VehicleTypes'];
            }
          }
          this.spinner.hide();
        }
      );
  }

  getVehicleTableData(memberCode) {

    this.apiService.apiGetRequest(this.apiConfigService.getVehicles + '/' + memberCode)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              // console.log(res);
              this.vehicleTableData = res.response['VechicleList'];
            }
          }
          this.spinner.hide();
        }
      );
  }

  get formControls() { return this.modelFormData.controls; }

  addOrUpdateEvent(value) {
    if (value.action == 'Edit') {
      this.formData = value.item;
      if (this.formData != null) {
        this.modelFormData.patchValue(this.formData);
        this.modelFormData.controls['memberId'].disable();
        this.modelFormData.controls['memberCode'].disable();
        this.isFormEdit = true;
      }
    }
  }

  save() {
  
    if (this.modelFormData.invalid) {
      return;
    }

    this.modelFormData.controls['memberId'].enable();
    this.modelFormData.controls['memberCode'].enable();

    let memberCode =this.memberCode;// this.modelFormData.controls['memberCode'].value;
    this.modelFormData.patchValue({
      fromDate:this.commonService.formatDate(this.modelFormData.get('fromDate').value),
      toDate:this.commonService.formatDate(this.modelFormData.get('toDate').value)
    });
    if (!this.isFormEdit) {
      this.apiService.apiPostRequest(this.apiConfigService.registerMemberMaster + '/' + memberCode, this.modelFormData.value)
        .subscribe(
          response => {
            const res = response;
            if (res != null && res.status === StatusCodes.pass) {
              if (res.response != null) {
                this.alertService.openSnackBar('Record Added...', 'close', SnackBar.success);
                this.reset();
                this.getVehicleTableData(memberCode);
              }
            }
            this.spinner.hide();
          }
        );
    }

    else if (this.isFormEdit) {

      this.apiService.apiUpdateRequest(this.apiConfigService.updateVehicle, this.modelFormData.value)
        .subscribe(
          response => {
            const res = response;
            if (res != null && res.status === StatusCodes.pass) {
              if (res.response != null) {
                this.alertService.openSnackBar('Record Updated...', 'close', SnackBar.success);
                this.reset();
                this.getVehicleTableData(memberCode);
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

