import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { SaveItemComponent } from '../../../../reuse-components/save-item/save-item.component';

import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';

import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { userInfo } from 'os';
import { map, Observable, startWith } from 'rxjs';


@Component({
  selector: 'app-meterreading',
  templateUrl: './meterreading.component.html',
  styleUrls: ['./meterreading.component.scss'],
  standalone: true,
  imports: [
    /* common shared imports for material, forms, etc. */
    SharedImportModule,
    TranslateModule,
    SaveItemComponent
  ]
})

export class MeterReadingComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  getMeterReadingBranches: any;
  getPumpList: any;
  getShiftList: any;
  getOBFromPumpList: any;
  user: any;
  getSUFromIM: any;
  pumpNoConfig: any;
  getmemberNamesArray = [];

  filteredOptions: Observable<any[]>;

  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<MeterReadingComponent>,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private commonService: CommonService,
    public dialog: MatDialog,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      meterReadingId: 0,
      branchCode: [null, [Validators.required]],
      branchName: [null],
      shiftId: [null],
      testing: [0.00],
      density: [0.00],
      inMeterReading: [0.00],
      outMeterReading: [0.00],
      consumption: [0.00],
      totalSales: [0.00],
      variation: [0.00],
      pumpNo: [null],
      invoiceSales: [0.00]
    });
    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({
        branchCode: +this.formData.item.branchCode
      });
      this.modelFormData.controls['totalSales'].disable();
      this.modelFormData.controls['invoiceSales'].disable();
      this.modelFormData.controls['variation'].disable();
      this.modelFormData.controls['shiftId'].disable();
      this.modelFormData.controls['inMeterReading'].disable();
    }
    else {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.branchCode != null) {
        this.modelFormData.patchValue({
          branchCode: +user.branchCode,
          userId: user.seqId,
          userName: user.userName
        });
        // this.getPump(user.branchCode);
        // this.getmemberNames(user.branchCode);
        this.modelFormData.controls['totalSales'].disable();
        this.modelFormData.controls['invoiceSales'].disable();
        this.modelFormData.controls['shiftId'].disable();
        this.modelFormData.controls['inMeterReading'].disable();
      }
    }
    this.getPump();

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role != '1') {
      this.modelFormData.controls['branchCode'].disable();
    }

    this.filteredOptions = this.modelFormData.get('pumpNo').valueChanges.pipe(
      startWith(''),
      map(value => (this.getmemberNamesArray.length) ? this._filter(value || '') : []),
    );

  }

  private _filter(value: string): string[] {
    return this.getmemberNamesArray.filter(option => (option.id).toString().includes(value));
  }

  calculateAmount() {
    let amount = 0;
    this.modelFormData.patchValue({
      totalSales: (this.modelFormData.get('outMeterReading').value - this.modelFormData.get('inMeterReading').value
        - this.modelFormData.get('testing').value - this.modelFormData.get('density').value - this.modelFormData.get('consumption').value).toFixed(2),
      // invoiceSales:(this.modelFormData.get('outMeterReading').value-this.modelFormData.get('inMeterReading').value
      // -this.modelFormData.get('testing').value-this.modelFormData.get('density').value-this.modelFormData.get('consumption').value).toFixed(2),
    });
  }

  calculateSales() {
    this.modelFormData.patchValue({
      variation: (this.modelFormData.get('totalSales').value - this.modelFormData.get('invoiceSales').value).toFixed(2),
    });
  }

  getSaledUnits() {
    this.modelFormData.patchValue({
      invoiceSales: 0.0
    });
    const getSaledUnitsUrl = [this.apiConfigService.getSaledUnits, this.modelFormData.get('branchCode').value, this.modelFormData.get('pumpNo').value, this.modelFormData.get('shiftId').value].join('/');
    this.apiService.apiPostRequest(getSaledUnitsUrl)
      .subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.saledList != null) {
                this.getSUFromIM = res.response['saledList'];
                this.modelFormData.patchValue({
                  invoiceSales: this.getSUFromIM
                });
              }
            }
          }
        });
  }


  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getMeterReadingBranchesList();
    this.getShift(this.user.seqId);
    this.isSubmitted = true;
  }

  getMeterReadingBranchesList() {
    const getMeterReadingBranchesList = this.apiConfigService.getMeterReadingBranchesList;
    this.apiService.apiGetRequest(getMeterReadingBranchesList)
      .subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.getMeterReadingBranches = res.response['BranchesList'];
              this.setMeterName();
            }
          }
        });
  }

  setMeterName() {
    const selectedBranch = this.getMeterReadingBranches.find(x => x.id === this.modelFormData.get('branchCode').value);
    this.modelFormData.patchValue({
      branchName: selectedBranch.text
    });
  }

  getShift(userId) {
    let getShiftUrl
    //const getShift = [this.apiConfigService.getShift,userId].join('/');
    if (userId != null) {
      getShiftUrl = [this.apiConfigService.getShift, userId].join('/');
    }
    this.apiService.apiGetRequest(getShiftUrl)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if ((res.response['ShiftList'] != null)) {
                this.getShiftList = res.response['ShiftList'];
                this.modelFormData.patchValue({
                  shiftId: this.getShiftList.shiftId
                });
                this.spinner.hide();
              }
            }
          }
        });
  }

  getOBFromPump() {
    this.modelFormData.patchValue({
      inMeterReading: 0.0
    });
    const getOBFromPumpUrl = [this.apiConfigService.getOBFromPump, this.modelFormData.get('branchCode').value, this.modelFormData.get('pumpNo').value].join('/');
    this.apiService.apiPostRequest(getOBFromPumpUrl)
      .subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if ((res.response['OBList'] != null)) {
                this.getOBFromPumpList = res.response['OBList'];
                this.modelFormData.patchValue({
                  inMeterReading: this.getOBFromPumpList.outMeterReading
                });
              }
            }
          }
        });
    this.commonService.setFocus('outMeterReading');
  }


  getPump(branch?) {
    this.getPumpNames();
    // let getPumpUrl;
    // //const getPump = [this.apiConfigService.getPump,branch].join('/');
    // if (branch != null) {
    //   // getPumpUrl = [this.apiConfigService.getPump, branch].join('/');
    // }
    // else {
    //   getPumpUrl = [this.apiConfigService.getPump, this.modelFormData.get('branchCode').value].join('/');
    //   //this.getmemberNames(this.modelFormData.get('pumpNo').value);
    // }

    // this.pumpNoConfig = {
    //   url: getPumpUrl,
    //   list: 'PumpList',

    // };
    // this.apiService.apiGetRequest(getPumpUrl)
    //   .subscribe(
    //     response => {
    //     const res = response;
    //     if (res != null && res.status === StatusCodes.pass) {
    //       if (res.response != null) {
    //         if (res?.response?.PumpList?.length) {
    //           this.getPumpList = res.response['PumpList'];
    //       }
    //       this.spinner.hide();
    //     }
    //   }
    //   });

  }
  setTypeAheadValue(val, col, indx) {
    //this.dataSource.data[indx][col].value = val;
    //this.formControlValid(col, this.dataSource.data[indx][col], val, indx);
  }
  getpumpNo(val?) {
    let getPumpUrl;
    //const getPump = [this.apiConfigService.getPump,branch].join('/');
    if ((val != null)) {
      getPumpUrl = [this.apiConfigService.getPump, val].join('/');
    }
    else {
      getPumpUrl = [this.apiConfigService.getPump, this.modelFormData.get('branchCode').value].join('/');
    }
    this.apiService.apiGetRequest(getPumpUrl)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.PumpList?.length) {
                this.getPumpList = res.response['PumpList'];
              }
              this.spinner.hide();
            }
          }
        });

  }
  //autocompletecode
  setMemberName(member) {
    this.modelFormData.patchValue({
      pumpNo: member.item.id
    });
  }

  getPumpNames() {
    this.getmemberNamesArray = [];
    if (this.modelFormData.get('branchCode').value) {
      const getmemberNamesUrl = [this.apiConfigService.getMPump, this.modelFormData.get('branchCode').value].join('/');
      this.apiService.apiGetRequest(getmemberNamesUrl).subscribe(
        response => {
          this.spinner.hide();
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.PumpList?.length) {
                this.getmemberNamesArray = res.response['PumpList'];
              } else {
                this.getmemberNamesArray = [];
              }
            }
          }
        });
    }
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['meterReadingId'].enable();
    this.modelFormData.controls['totalSales'].enable();
    this.modelFormData.controls['invoiceSales'].enable();
    this.modelFormData.controls['variation'].enable();
    this.modelFormData.controls['shiftId'].enable();
    this.modelFormData.controls['inMeterReading'].enable();
    const dialogRef = this.dialog.open(SaveItemComponent, {
      width: '1024px',
      data: '',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        if (this.modelFormData.value.meterReadingId) {
          this.dialogRef.close(this.formData);
        } else {
          const addCompanyUrl = this.apiConfigService.registerMeterReading;
          this.apiService.apiPostRequest(addCompanyUrl, this.modelFormData.getRawValue())
            .subscribe(
              response => {
                const res = response;
                this.spinner.hide();
                if (res != null && res.status === StatusCodes.pass) {
                  if (res.response != null) {
                    this.alertService.openSnackBar('Record Added...', 'close', SnackBar.success);
                    this.getmemberNamesArray.forEach((m: any) => {
                      if (m.id === this.modelFormData.value.pumpNo) {
                        m.selected = true
                      }
                    })
                    this.resetData();
                  }
                }
              });
        }
      }
    });
  }

  resetData() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.modelFormData.patchValue({
      meterReadingId: 0,
      testing: 0.00,
      density: 0.00,
      inMeterReading: 0.00,
      outMeterReading: 0.00,
      consumption: 0.00,
      totalSales: 0.00,
      variation: 0.00,
      invoiceSales: 0.00,
      userId: user.seqId,
      userName: user.userName,
      pumpNo: ''
    })
    if (+this.modelFormData.get('branchCode').value !== +user.branchCode) {
      this.getPump();
      this.modelFormData.patchValue({
        branchCode: +user.branchCode
      })
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
