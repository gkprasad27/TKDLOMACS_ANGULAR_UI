import { Component, Inject, Optional, OnInit, ViewChild } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { DatePipe, formatDate } from '@angular/common';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

interface Session {
 value: string;
 viewValue: string;
}
//interface NumberType {
//  value: string;
//  viewValue: string;
//}
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({ 
  selector: 'app-leaverequest',
  templateUrl: './leaverequest.component.html',
  styleUrls: ['./leaverequest.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})

export class LeaveRequestComponent implements OnInit {


  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  modelFormData: UntypedFormGroup;
  isSubmitted = false;
  formData: any;
  LeaveTypeatList: any;
  companyList: any;
  brandList: any;
  MaterialGroupsList: any;
  SizesList: any; 
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];
  applDate = new UntypedFormControl(new Date());

  sessions: Session[] =
   [
     { value: 'FirstHalf', viewValue: 'FirstHalf' },
     { value: 'SecondHalf', viewValue: 'SecondHalf' }
   ];
  EmpName: any;
  pipe = new DatePipe('en-US');
  now = Date.now();

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<LeaveRequestComponent>,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any)
  {

    this.modelFormData = this.formBuilder.group({
      empCode: [null],
      empName: [null],
      sno: ['0'],
      applDate: [null],
      leaveCode: [null],
      leaveFrom: [null],
      leaveTo: [null],
      leaveDays: [null],
      leaveRemarks: [null],
      status: [null],
      approvedId: [null],
      approveName: [null],
      reason: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(2), Validators.maxLength(40)]],
      authorizedStatus: [null],
      authorizedId: [null],
      formno: [null],
      trmno: [null],
      apprDate: [null],
      authDate: [null],
      accptedId: [null],
      accDate: [null],
      acceptedRemarks: [null],
      skip: [null],
      lopdays: [null],
      reportId: [null],
      reportName: [null],
      recomendedby: [null],
      companyCode: [null],
      companyName: [null],
      rejectedId: [null],
      rejectedName: [null],
      countofLeaves: [null],
      chkAcceptReject: [null],
      session1: [null],
      session2: null
    });

    
    
    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      //this.modelFormData.controls['empCode'].disable();
    }

  }

  ngOnInit()
  {
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
   // debugger;
    const user = JSON.parse(localStorage.getItem('user'));
    const getLeaveApplDetailsListUrl = ['/', this.apiConfigService.getLeaveRequestList, user.userName].join('/');
    this.apiService.apiGetRequest(getLeaveApplDetailsListUrl)
      .subscribe(
        response => {
          const res = response.body;
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
  NoofdaysCount()
  {
    //debugger;
    var date1 = this.pipe.transform(this.modelFormData.get('leaveFrom').value, 'dd-MM-yyyy');
    var date2 = this.pipe.transform(this.modelFormData.get('leaveTo').value, 'dd-MM-yyyy');

    var session1 = this.modelFormData.get('session1').value
    var session2 = this.modelFormData.get('session2').value

    if (date1 != null) {
      const getProductByProductCodeUrl = ['/', this.apiConfigService.getnoofdayscount].join('/');
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: date1, date2, session1, session2 }).subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.days != null) {
                this.EmpName = res.response['days']
                this.modelFormData.patchValue
                  ({
                    leaveDays: res.response['days']
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

  sessionevent()
  {
    this.NoofdaysCount();
  }
  orgValueChange()
  {
    //debugger;
    this.NoofdaysCount();
  }
  leaveToValueChange()
  {
    this.NoofdaysCount();
  }
  
  sessionevent2()
  {
    

    var date1 = this.pipe.transform(this.modelFormData.get('leaveFrom').value, 'dd-MM-yyyy');
    var date2 = this.pipe.transform(this.modelFormData.get('leaveTo').value, 'dd-MM-yyyy');
    //var momentVariable = moment(date, 'MM-DD-YYYY');  
    //let str = date.toDateString();  
    var session1 = this.modelFormData.get('session1').value
    var session2 = this.modelFormData.get('session2').value

    if ((date1 != null))
    {
      const getProductByProductCodeUrl = ['/', this.apiConfigService.getnoofdayscount].join('/');
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: date1, date2,session1,session2 }).subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.days != null) {
                this.EmpName = res.response['days']
                this.modelFormData.patchValue
                  ({
                    leaveDays: res.response['days']
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


  getTableDataonempcodechangevent()
  {

    this.spinner.show();
    const getCompanyUrl = ['/', this.apiConfigService.getLeaveTypeatList, this.modelFormData.get('empCode').value].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
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
    //debugger;
    const user = JSON.parse(localStorage.getItem('user'));
    let username = user.userName;
    this.spinner.show();
    const getCompanyUrl = ['/', this.apiConfigService.getLeaveTypeatList,username].join('/');
    this.apiService.apiGetRequest(getCompanyUrl)
      .subscribe(
        response => {
          const res = response.body;
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
    //debugger;
    
    if (value != null && value !== '') {
      const getProductByProductCodeUrl = ['/', this.apiConfigService.getEmpCode].join('/');
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { Code: value }).subscribe(
        response => {
          const res = response.body;
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
    //debugger;
    let genarateVoucherNoUrl;
    if (code != null) {
      genarateVoucherNoUrl = ['/', this.apiConfigService.getEmpName,code.value].join('/');
    } else {
      genarateVoucherNoUrl = ['/', this.apiConfigService.getEmpName, this.modelFormData.get('empCode').value].join('/');
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response.body;
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


  save()
  {
   // debugger;
    if (this.modelFormData.invalid)
    {
      return;
    }

    this.modelFormData.patchValue({
     leaveTo: this.commonService.formatDate(this.modelFormData.get('leaveTo').value),
     leaveFrom: this.commonService.formatDate(this.modelFormData.get('leaveFrom').value)
    });
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

