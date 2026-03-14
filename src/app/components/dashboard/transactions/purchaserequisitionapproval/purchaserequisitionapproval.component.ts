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
  selector: 'app-purchaserequisitionapproval',
  templateUrl: './purchaserequisitionapproval.component.html',
  styleUrls: ['./purchaserequisitionapproval.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class PurchaserequisitionapprovalComponent implements OnInit {
  selectedDate = { start: moment().add(-1, 'day'), end: moment().add(0, 'day') };

  dateForm: UntypedFormGroup;
  // table
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'requisitionNo', 'requisitionDate', 'branch', 'company'
  ];
  fromBranchCode: any;
  issueNo: any;
  branchCode: any;
  user1: any;

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
      requisitionNo: [null],
      role: [null]
    });
  }

  ngOnInit() {
    this.branchCode = JSON.parse(localStorage.getItem('user'));
    this.dateForm.patchValue({ role: this.branchCode.role })
    this.getPurchaserequisitionDetails();
  }

  getPurchaserequisitionDetails() {
    //debugger;
    const getInvoiceDetailstUrl = ['/', this.apiConfigService.getPurchaserequisitionDetailsListLoad, this.branchCode.branchCode].join('/');
    this.apiService.apiPostRequest(getInvoiceDetailstUrl, this.dateForm.value).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.PurchaseequisitionDetailslist?.length) {
            this.dataSource = new MatTableDataSource(res.response['PurchaseequisitionDetailslist']);
            this.dataSource.paginator = this.paginator;
            this.spinner.hide();
          }
        }
      });
  }

  openStockissues(row) {
    debugger;
    localStorage.setItem('selectedstockissues', JSON.stringify(row));
    this.router.navigate(['dashboard/transactions/purchaserequisition/CreatePurchaserequisitionapproval', row.id]);
  }

  returnSdeale() {
    this.router.navigate(['dashboard/transactions/purchaserequisition/CreatePurchaserequisitionapproval', 'return']);
  }


  //Search and datadisplay code
  search() {
    if (this.dateForm?.value?.issueNo == null) {
      if (this.dateForm?.value?.selected == null) {
        this.alertService.openSnackBar('Select issueNo or Date', Static.Close, SnackBar.error);
        return;
      }
      else {
        this.dateForm.patchValue({
          fromDate: this.commonService.formatDate(this.dateForm.value.selected.start._d),
          toDate: this.commonService.formatDate(this.dateForm.value.selected.end._d),
          issueNo: this.dateForm.value.issueNo
        });
      }
    }

    this.getpurchaserequisitionList();
  }
  getpurchaserequisitionList() {
    //debugger;
    const getInvoiceListUrl = ['/', this.apiConfigService.getpurchaserequisitionList, this.branchCode.branchCode].join('/');
    this.apiService.apiPostRequest(getInvoiceListUrl, this.dateForm.value).subscribe(
      response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.PurchaseRequisitionList?.length) {
            this.dataSource = new MatTableDataSource(res.response['PurchaseRequisitionList']);
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
