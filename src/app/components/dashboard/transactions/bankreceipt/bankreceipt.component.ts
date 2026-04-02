import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  selector: 'app-bankreceipt',
  templateUrl: './bankreceipt.component.html',
  styleUrls: ['./bankreceipt.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class BankReceiptComponent implements OnInit {
  selectedDate = {start : moment().add(-1, 'day'), end: moment().add(0, 'day')};
  GetBranchesListArray:any;
  dateForm: UntypedFormGroup;
  // table
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['branchCode', 'branchName','bankLedgerCode','bankLedgerName','voucherNo','bankReceiptDate', 
   'totalAmount','userId', 'shiftId'
];
branchCode:any;
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
    this.getBankreceiptList();
    this.getBankReceiptBranchesList();
  }
  
  getBankReceiptBranchesList() {
    const getBankReceiptBranchesListUrl = [this.apiConfigService.getBankReceiptBranchesList].join('/');
    this.apiService.apiGetRequest(getBankReceiptBranchesListUrl).subscribe(
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
 
  getBankreceiptList() {
    const getBankreceiptListUrl = [this.apiConfigService.getBankreceiptList, this.branchCode.branchCode].join('/');
    this.apiService.apiPostRequest(getBankreceiptListUrl, this.dateForm.value).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
        if (res?.response?.BankReceiptList?.length) {
          this.dataSource = new MatTableDataSource( res.response['BankReceiptList']);
          this.dataSource.paginator = this.paginator;
          this.spinner.hide();
        }
      }
      });
  }

  openSale(row) {
    localStorage.setItem('selectedBill', JSON.stringify(row));
    this.router.navigate(['dashboard/transactions/bankreceipt/createBankreceipt', row.bankReceiptMasterId]);
  }

  search() {
    if (this.dateForm?.value?.voucherNo == null) {
       if (this.dateForm?.value?.branchCode == null) {
        if (this.dateForm?.value?.fromDate == null) {
          this.alertService.openSnackBar('Select VoucherNo or Date', Static.Close, SnackBar.error);
          return;
        } else {
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

    this.getBankreceiptList();
  }

  reset() {
    this.dateForm.reset();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
  }

}
