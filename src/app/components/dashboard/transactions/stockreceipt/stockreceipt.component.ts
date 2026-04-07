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
  selector: 'app-stockreceipt',
  templateUrl: './stockreceipt.component.html',
  styleUrls: ['./stockreceipt.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class StockreceiptsComponent implements OnInit {
  selectedDate = { start: moment().add(-1, 'day'), end: moment().add(0, 'day') };
  dateForm: FormGroup;
  // table
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['fromBranchCode', 'fromBranchName','toBranchCode', 'toBranchName','receiptNo', 'receiptDate', 
  'userId','shiftId' 
  ];
    receiptNo: any;
    fromBranchCode: any;
    branchCode: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
  )
  {
   
    this.dateForm = this.formBuilder.group({
      fromDate: [null],
      toDate: [null],
      receiptNo: [null],
      role: [null]
    });
  }

  ngOnInit()
  {
    this.branchCode = JSON.parse(localStorage.getItem('user'));
    this.dateForm.patchValue({ role: this.branchCode.role })
    this.getInvoiceDetails();
  }
  getInvoiceDetails() {
    const getInvoiceDetailstUrl = [this.apiConfigService.getStockreceiptsDeatilListLoad, this.branchCode.branchCode].join('/');
    this.apiService.apiPostRequest(getInvoiceDetailstUrl, this.dateForm.value).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.StockreceiptList?.length) {
            this.dataSource = new MatTableDataSource(res.response['StockreceiptList']);
            this.dataSource.paginator = this.paginator;
            this.spinner.hide();
          }
        }
      });
  }
  

  openStockreceipt(row) {
    localStorage.setItem('selectedstockissues', JSON.stringify(row));
    this.router.navigate(['dashboard/transactions/stockreceipt/CreateStockreceipts', row.operatorStockReceiptId]);
  }

  returnSdeale() {
    this.router.navigate(['dashboard/transactions/stockreceipt/CreateStockreceipts', 'return']);
  }

  //Search and datadisplay code
  search()
  {
    if ((this.dateForm.value.receiptNo == null))
    {
      if ((this.dateForm.value.fromDate == null))
      {
        this.alertService.openSnackBar('Select issueNo or Date', Static.Close, SnackBar.error);
        return;
      }
      else {
        this.dateForm.patchValue({
          fromDate: this.commonService.formatDate(this.dateForm.value.fromDate),
          toDate: this.commonService.formatDate(this.dateForm.value.toDate),
          receiptNo: this.dateForm.value.receiptNo
        });
      }
    }

    this.getStockreceiptList();
  }
  getStockreceiptList()
  {
    const getInvoiceListUrl = [this.apiConfigService.getStockreceiptsList, this.branchCode.branchCode].join('/');

    this.apiService.apiPostRequest(getInvoiceListUrl, this.dateForm.value).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.StockreceiptList?.length) {
            this.dataSource = new MatTableDataSource(res.response['StockreceiptList']);
            this.dataSource.paginator = this.paginator;
            this.spinner.hide();
          }
        }
      });
  }

  reset() {
    this.dateForm.reset();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
  }

}
