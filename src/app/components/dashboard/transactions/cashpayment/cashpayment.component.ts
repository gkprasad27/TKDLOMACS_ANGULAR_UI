import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';

import { ApiConfigService } from '../../../../services/api-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../services/api.service';

import { Router } from '@angular/router';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';

@Component({ 
  selector: 'app-cashpayment',
  templateUrl: './cashpayment.component.html',
  styleUrls: ['./cashpayment.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class CashPaymentComponent implements OnInit {
  selectedDate = {start : moment().add(-1, 'day'), end: moment().add(0, 'day')};
  GetBranchesListArray:any;
  dateForm: FormGroup;
  // table
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['branchCode', 'branchName','fromLedgerCode','fromLedgerName','voucherNo','cashPaymentDate',  
   'totalAmount', 'userId', 'shiftId'
];
branchCode: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,

  ) {
    this.dateForm = this.formBuilder.group({
      fromDate: [null],
      toDate: [null],
      voucherNo: [null],
      role:[null],
      branchCode:[null]
    });
  }

  ngOnInit() {
      this.branchCode = JSON.parse(localStorage.getItem('user'));
      // this.search();
      this.dateForm.patchValue({role:this.branchCode.role})
      this.getCashPaymentList();
      this.getCashPaymentBranchesList();
  }

  
  getCashPaymentBranchesList() {
    const getCashPaymentBranchesListUrl = [this.apiConfigService.getCashPaymentBranchesList].join('/');
    this.apiService.apiGetRequest(getCashPaymentBranchesListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.BranchesList?.length > 0) {
              this.GetBranchesListArray = res.response['BranchesList'];
              this.spinner.hide();
            }
          }
        }
      });
  }


  getCashPaymentList() {
    const getCashPaymentListUrl = [this.apiConfigService.getCashPaymentList, this.branchCode.branchCode].join('/');
    this.apiService.apiPostRequest(getCashPaymentListUrl, this.dateForm.value).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
        if (res?.response?.CashPaymentList?.length) {
          this.dataSource = new MatTableDataSource( res.response['CashPaymentList']);
          this.dataSource.paginator = this.paginator;
          this.spinner.hide();
        }
      }
      });
  }

  openSale(row) {
    localStorage.setItem('selectedBill', JSON.stringify(row));
    this.router.navigate(['dashboard/transactions/cashpayment/createCashpayment', row.cashPaymentMasterId]);
  }

  search() {
    if (this.dateForm?.value?.voucherNo == null) {
      if (this.dateForm?.value?.branchCode == null) {
        if (this.dateForm?.value?.fromDate == null) {
          this.alertService.openSnackBar('Select VoucherNo or Date', Static.Close, SnackBar.error);
          return;
        }
         else {
          this.dateForm.patchValue({
            fromDate:  this.commonService.formatDate(this.dateForm.value.fromDate),
            toDate:  this.commonService.formatDate(this.dateForm.value.toDate),
            voucherNo:this.dateForm.value.voucherNo,
            role:this.branchCode.role,
            branchCode:this.dateForm.value.branchCode
          });
        }
      }
    }

    this.getCashPaymentList();
  }

  reset() {
    this.dateForm.reset();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
  }

}
