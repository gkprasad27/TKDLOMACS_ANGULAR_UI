import { Component, OnInit, ViewChild } from '@angular/core';
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
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';

@Component({ 
    selector: 'app-stockshort',
    templateUrl: './stockshort.component.html',
    styleUrls: ['./stockshort.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class StockshortComponent  implements OnInit {
  selectedDate = { start: moment().add(-1, 'day'), end: moment().add(0, 'day') };
  dateForm: UntypedFormGroup;
  // table
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['branchCode', 'branchName','stockshortNo', 'stockshortDate', 'costCenter','userId',
    'shiftId'
  ];
    stockshortNo: any;
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
      selected: [this.selectedDate],
      fromDate: [null],
      toDate: [null],
      stockshortNo: [null],
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
    //debugger;
    const getInvoiceDetailstUrl = ['/', this.apiConfigService.getStockshortDeatilListLoad, this.branchCode.branchCode].join('/');
    this.apiService.apiPostRequest(getInvoiceDetailstUrl, this.dateForm.value).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.StockshortsList?.length) {
            this.dataSource = new MatTableDataSource(res.response['StockshortsList']);
            this.dataSource.paginator = this.paginator;
            this.spinner.hide();
          }
        }
      });
  }

  openStockissues(row) {
    // debugger;
    localStorage.setItem('selectedStockshort', JSON.stringify(row));
    this.router.navigate(['dashboard/transactions/stockshort/CreateStocshorts', row.stockshortMasterId]);
  }

  returnSdeale() {
    this.router.navigate(['dashboard/transactions/stockshort/CreateStocshorts', 'return']);
  }

  
  //Search and datadisplay code
  search() {
    if ((this.dateForm.value.stockshortNo == null)) {
      if (this.dateForm?.value?.selected == null) {
        this.alertService.openSnackBar('Select issueNo or Date', Static.Close, SnackBar.error);
        return;
      }
      else {
        this.dateForm.patchValue({
          fromDate: this.commonService.formatDate(this.dateForm.value.selected.start._d),
          toDate: this.commonService.formatDate(this.dateForm.value.selected.end._d),
          stockshortNo: this.dateForm.value.stockshortNo
        });
      }
    }
    this.getStockshortList();
  }
  getStockshortList() {
    const getInvoiceListUrl = ['/', this.apiConfigService.getStockshortList, this.branchCode.branchCode].join('/');

    this.apiService.apiPostRequest(getInvoiceListUrl, this.dateForm.value).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.StockshortsList?.length) {
            this.dataSource = new MatTableDataSource(res.response['StockshortsList']);
            console.log(this.dataSource);
            console.log(res.response['StockshortsList']);
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
