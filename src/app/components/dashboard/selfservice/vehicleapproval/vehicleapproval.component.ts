import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';

import { ApiConfigService } from '../../../../services/api-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SnackBar, StatusCodes } from '../../../../enums/common/common';
//import { StatusCodes, SnackBar } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../../services/api.service';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({ 
  selector: 'app-vehicleapproval',
  templateUrl: './vehicleapproval.component.html',
  styleUrls: ['./vehicleapproval.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})

export class VehicleApprovalsComponent implements OnInit {

  leaveApprovalList: any;

  leaveRequestForm: UntypedFormGroup;
  displayedColumns: string[] = ['select', 'empCode', 'empName', 'sno', 'fromDate', 'todate', 'place', 'status', 'approvedId', 'reason'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;



  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService, ) {

    this.leaveRequestForm = this.formBuilder.group({
      accept: [null],
      reject: [null],
      ApprBy: [null],
      chkAcceptReject: [null],
      reason: [null]
    });

  }

  ngOnInit() {
    this.getLeaveApplDetailsList();
  }

  approveOrReject(event) {
    //debugger;
    if (event) {
      this.leaveRequestForm.patchValue({
        ApprBy: "Accept",
        reject: null
      });
    } else {
      this.leaveRequestForm.patchValue({
        ApprBy: null,
        reject: "Reject"
      });
    }
  }

  singleChecked(flag, column, row) {
    // debugger;
    console.log(flag, row, column)
    let statusFlag = true;
    if (this.leaveApprovalList.length) {
      for (let l = 0; l < this.leaveApprovalList.length; l++) {
        if (this.leaveApprovalList[l]['sno'] == column) {
          statusFlag = false;
          if (!flag) {
            if (this.leaveApprovalList.length == 1) {
              this.leaveApprovalList = [];
            }
            else {
              //delete this.leaveApprovalList[l];
              this.leaveApprovalList.splice(0, l);
            }
          }
          if (flag) {
            this.leaveApprovalList.push(row);
          }
        }
      }
    }
    if (this.leaveApprovalList.length == 0 || statusFlag) {
      this.leaveApprovalList.push(row);
    }
    //console.log(this.leaveApprovalList)
  }

  checkAll(flag, checkAll?) {
    for (let l = 0; l < this.dataSource.data.length; l++) {
      this.dataSource.data[l]['select'] = flag;
    }
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    if (flag && checkAll) {
      this.leaveApprovalList = this.dataSource.data;
    } else {
      this.leaveApprovalList = [];
    }
  }

  getLeaveApplDetailsList() {
    //debugger;
    const user = JSON.parse(localStorage.getItem('user'));
    const getLeaveApplDetailsListUrl = ['/', this.apiConfigService.getVehicleApplDetailsList, user.userName].join('/');
    this.apiService.apiGetRequest(getLeaveApplDetailsListUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.dataSource = new MatTableDataSource(res.response['VehicleApprovalApplDetailsList']);
              this.dataSource.paginator = this.paginator;
              this.checkAll(false);
            }
          }
          this.spinner.hide();
        });
  }

  save() {
    console.log(this.leaveApprovalList);
    const user = JSON.parse(localStorage.getItem('user'));
    const registerInvoiceUrl = ['/', this.apiConfigService.RegisterVehicleApprovalDetails].join('/');
    const requestObj = { StockissueHdr: this.leaveRequestForm.value, code: user.userName, StockissueDtl: this.leaveApprovalList };
    this.apiService.apiPostRequest(registerInvoiceUrl, requestObj).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar('Vehicle Approval  Successfully..', Static.Close, SnackBar.success);
            //this.branchFormData.reset();
          }
          this.reset();

          this.spinner.hide();

        }
      });
  }



  reset() {
    this.leaveRequestForm.reset();
    this.dataSource = new MatTableDataSource();
    this.ngOnInit();
  }


}
