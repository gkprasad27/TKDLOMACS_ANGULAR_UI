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
  selector: 'app-stockexcess',
  templateUrl: './stockexcess.component.html',
  styleUrls: ['./stockexcess.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class StockExcessComponent implements OnInit {
  selectedDate = {start : moment().add(-1, 'day'), end: moment().add(0, 'day')};

  dateForm: UntypedFormGroup;
  // table
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['branchCode','branchName','stockExcessNo','stockExcessDate', 'costCenter','userId','shiftId'
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
      selected: [null],
      fromDate: [null],
      toDate: [null],
      stockExcessNo: [null],
      role:[null]
    });
  }

  ngOnInit() {
      this.branchCode = JSON.parse(localStorage.getItem('user'));
      this.dateForm.patchValue({role:this.branchCode.role})
      this.getStockexcessList();
  }



  getStockexcessList() {
    const getStockexcessListUrl = ['/', this.apiConfigService.getStockexcessList, this.branchCode.branchCode].join('/');
    this.apiService.apiPostRequest(getStockexcessListUrl, this.dateForm.value).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
        if (res?.response?.StockexcessList?.length) {
          this.dataSource = new MatTableDataSource( res.response['StockexcessList']);
          this.dataSource.paginator = this.paginator;
          this.spinner.hide();
        }
      }
      });
  }

  openSale(row) {
    localStorage.setItem('selectedBill', JSON.stringify(row));
    this.router.navigate(['dashboard/transactions/stockexcess/createStockExcess', row.stockExcessMasterId]);
  }

  search() {
    if ((this.dateForm.value.stockExcessNo == null)) {
        if (this.dateForm?.value?.selected == null) {
          this.alertService.openSnackBar('Select StockExcess No or Date', Static.Close, SnackBar.error);
          return;
        } else {
          this.dateForm.patchValue({
            fromDate:  this.commonService.formatDate(this.dateForm.value.selected.start._d),
            toDate:  this.commonService.formatDate(this.dateForm.value.selected.end._d),
            stockExcessNo:this.dateForm.value.stockExcessNo
          });
        }
    }

    this.getStockexcessList();
  }

  reset() {
    this.dateForm.reset();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
  }

}
