import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';

import { ApiConfigService } from '../../../../services/api-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../services/api.service';

import { Router, ActivatedRoute } from '@angular/router';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { Static } from '../../../../enums/common/static';
import { AlertService } from '../../../../services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-sales-invoice',
    templateUrl: './sales-invoice.component.html',
    styleUrls: ['./sales-invoice.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class SalesInvoiceComponent implements OnInit {
  selectedDate = {start : moment().add(0, 'day'), end: moment().add(0, 'day')};

  dateForm: UntypedFormGroup;
  // table
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['branchCode','branchName','invoiceNo', 'invoiceDate', 'ledgerCode',
    'ledgerName', 'grandTotal','vehicleRegNo', 'salesInvoice','stateCode', 'customerGstin', 'userId',  'shiftId',
     
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
    private activatedRoute: ActivatedRoute,

  ) {
    this.dateForm = this.formBuilder.group({
      selected: [null],
      fromDate: [null],
      toDate: [null],
      invoiceNo: [null],
      Role:[null]
    });
  }

  ngOnInit() {
    this.branchCode = JSON.parse(localStorage.getItem('user'));
    this.dateForm.patchValue({
      Role: this.branchCode.role
    })
    this.getInvoiceList();
    this.commonService.setFocus('ledgerCode');
  }

  getInvoiceList() {
    const getInvoiceListUrl = [this.apiConfigService.getInvoiceList, this.branchCode.branchCode].join('/');
    this.apiService.apiPostRequest(getInvoiceListUrl, this.dateForm.value).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.InvoiceList?.length > 0) {
            this.dataSource = new MatTableDataSource(res.response['InvoiceList']);
            this.dataSource.paginator = this.paginator;
            this.spinner.hide();
          }
        }
      });
  }

  openSale(row) {
    localStorage.setItem('selectedBill', JSON.stringify(row));
    this.router.navigate(['dashboard/sales/salesInvoice/viewSaleInvoice','create', row.invoiceNo ]);
  }

  returnSale(row) {
    localStorage.setItem('selectedBill', JSON.stringify(row));
    this.router.navigate(['dashboard/sales/salesInvoice/viewSaleInvoice', 'return',  row.invoiceNo]);
  }

  search() {
    if (this.dateForm?.value?.invoiceNo == null) {
      if (this.dateForm?.value?.selected == null) {
        this.alertService.openSnackBar('Select Invoice or Date', Static.Close, SnackBar.error);
        return;
      } else {
        this.dateForm.patchValue({
          fromDate: this.commonService.formatDate(this.dateForm.value.selected.start._d),
          toDate: this.commonService.formatDate(this.dateForm.value.selected.end._d),
          role:this.branchCode.role
        });
      }
    }

    this.getInvoiceList();
  }

  reset() {
    this.dateForm.reset();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
  }

}
