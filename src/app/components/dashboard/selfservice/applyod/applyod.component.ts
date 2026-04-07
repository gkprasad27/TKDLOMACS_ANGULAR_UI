import { Component, Inject, Optional, OnInit, ViewChild } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { DatePipe, formatDate } from '@angular/common';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

interface Session {
  value: string;
  viewValue: string;
}
//interface NumberType {
//  value: string;
//  viewValue: string;
//}

@Component({ 
  selector: 'app-applyod',
  templateUrl: './applyod.component.html',
  styleUrls: ['./applyod.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})

export class ApplyodComponent implements OnInit {


  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  LeaveTypeatList: any;
  companyList: any;
  brandList: any;
  MaterialGroupsList: any;
  SizesList: any;
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];
  applDate = new FormControl(new Date());

  sessions: Session[] =
    [
      { value: 'Train', viewValue: 'Train' },
      { value: 'Bus', viewValue: 'Bus' },
      { value: 'Air', viewValue: 'Air' },
      { value: 'Car', viewValue: 'Car' },
      { value: 'Own Vechile', viewValue: 'Own Vechile' },
    ];
  EmpName: any;
  pipe = new DatePipe('en-US');
  now = Date.now();

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<ApplyodComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      sno: ['0'],
      empCode: [null],
      applDate: [null],
      fromDate: [null],
      toDate: [null],
      fromTime: [null],
      toTime: [null],
      remarks: [null],
      recBy: [null],
      recStatus: [null],
      recDate: [null],
      apprBy: [null],
      apprStatus: [null],
      apprDate: [null],
      reason: [null],
      acceptedBy: [null],
      timeStamp: [null],
      skip: [null],
      transport: [null],
      visitingPlace: [null],
      empName: [null],
      visitingPlacePurpus: [null],
      type: [null],
      status: [null],
      approvedId: [null],
      approveName: [null],
      reportId: [null],
      reportName: [null],
      code: [null],
      name: [null],
      rejectedId: [null],
      rejectedName: [null],
      noOfDays: [null],
      department: [null]
    });



    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['empCode'].disable();
    }

  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.getTableData();
    this.modelFormData.patchValue
      ({
        empCode: user.userName
      });
    this.getProductByProductCode(user.userName);
    this.onSearchChange(null);
  }


  //load data
  getLeaveApplDetailsList() {
    const user = JSON.parse(localStorage.getItem('user'));
    const getLeaveApplDetailsListUrl = [this.apiConfigService.getLeaveRequestList, user.userName].join('/');
    this.apiService.apiGetRequest(getLeaveApplDetailsListUrl)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.dataSource = new MatTableDataSource(res.response['LeaveApplDetailsList']);
              this.dataSource.paginator = this.paginator;
              //this.checkAll(false);
            }
          }
          this.spinner.hide();
        });
  }


  ///gettting NoofdaysCount code
  NoofdaysCount() {
    var date1 = this.pipe.transform(this.modelFormData.get('fromDate').value, 'dd-MM-yyyy');
    var date2 = this.pipe.transform(this.modelFormData.get('toDate').value, 'dd-MM-yyyy');

    var session1 = null;
    var session2 = null;
    if (date1 != null) {
      const getProductByProductCodeUrl = [this.apiConfigService.getnoofdayscount].join('/');
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: date1, date2, session1, session2 }).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.days != null) {
                this.EmpName = res.response['days']
                this.modelFormData.patchValue
                  ({
                    noOfDays: res.response['days']
                  });
                this.spinner.hide();
              }
            }
          }
        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }

  
  orgValueChange() {
    this.NoofdaysCount();
  }
  leaveToValueChange() {
    this.NoofdaysCount();
  }


  getTableDataonempcodechangevent() {

    this.spinner.show();
    const getCompanyUrl = [this.apiConfigService.getLeaveTypeatList, this.modelFormData.get('empCode').value].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.LeaveTypeatList = res.response['leavetypesList'];
            }
          }
          this.spinner.hide();
        }, error => {

        });
  }

  getTableData() {
    const user = JSON.parse(localStorage.getItem('user'));
    let username = user.userName;
    this.spinner.show();
    const getCompanyUrl = [this.apiConfigService.getLeaveTypeatList, username].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.LeaveTypeatList = res.response['leavetypesList'];
            }
          }
          this.spinner.hide();
        }, error => {

        });
  }


  getProductByProductCode(value) {
    if (value != null && value !== '') {
      const getProductByProductCodeUrl = [this.apiConfigService.getEmpCode].join('/');
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: value }).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.['Empcodes'] != null) {
                this.getProductByProductCodeArray = res.response['Empcodes'];
                this.spinner.hide();
              }
            }
          }

        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }

  onSearchChange(code) {
    let genarateVoucherNoUrl;
    if (code != null) {
      genarateVoucherNoUrl = [this.apiConfigService.getEmpName, code.value].join('/');
    } else {
      genarateVoucherNoUrl = [this.apiConfigService.getEmpName, this.modelFormData.get('empCode').value].join('/');
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.empname != null) {
              this.EmpName = res.response['empname']
              this.modelFormData.patchValue
                ({
                  empName: res.response['empname']
                });
              this.spinner.hide();
            }
          }
        }
        this.getTableDataonempcodechangevent();
      });
  }



  showErrorAlert(caption: string, message: string) {
    // this.alertService.openSnackBar(caption, message);
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }

    this.modelFormData.patchValue({
      leaveTo: this.commonService.formatDate(this.modelFormData.get('toDate').value),
      leaveFrom: this.commonService.formatDate(this.modelFormData.get('fromDate').value)
    });
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

