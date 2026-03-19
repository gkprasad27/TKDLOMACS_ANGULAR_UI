import { Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../services/api.service';

import { DeleteItemComponent } from '../../../reuse-components/delete-item/delete-item.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { CashPaymentComponent } from './cashpayment/cashpayment.component';
import { CashReceiptComponent } from './cashreceipt/cashreceipt.component';
import { BankPaymentComponent } from './bankpayment/bankpayment.component';
import { BankReceiptComponent } from './bankreceipt/bankreceipt.component';
import { JournalVoucherComponent } from './journalvoucher/journalvoucher.component';
import { StockissuesComponent } from './stockissues/stockissues.component';
import { PurchaserequisitionComponent } from './purchaserequisition/purchaserequisition.component';
import { PurchaserequisitionapprovalComponent } from './purchaserequisitionapproval/purchaserequisitionapproval.component';
import { StockreceiptsComponent } from './stockreceipt/stockreceipt.component';
import { StockshortComponent } from './stockshort/stockshort.component';
import { OilconversionComponent } from './oilconversion/oilconversion.component';
import { StockExcessComponent } from './stockexcess/stockexcess.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { StatusCodes } from '../../../enums/common/common';
import { AlertService } from '../../../services/alert.service';
import { SnackBar } from '../../../enums/common/common';
import { TransactionsService } from './transactions.service';
import { TableComponent } from '../../../reuse-components/table/table.component';

@Component({ 
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [
    DeleteItemComponent,
    TableComponent,
    SharedImportModule,
    TranslateModule,
    CashPaymentComponent,
    CashReceiptComponent,
    BankPaymentComponent,
    BankReceiptComponent,
    JournalVoucherComponent,
    StockissuesComponent,
    PurchaserequisitionComponent,
    PurchaserequisitionapprovalComponent,
    StockreceiptsComponent,
    StockshortComponent,
    OilconversionComponent,
    StockExcessComponent
  ]
})
export class TransactionsComponent implements OnInit {

  tableData: any;
  addOrUpdateData: any;
  tableUrl: any;
  routeParams: any;

  @ViewChild(TableComponent) tableComponent: TableComponent;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private transactionsService: TransactionsService
  ) {
    const user = JSON.parse(localStorage.getItem('user'));
    this.transactionsService.branchCode = user.branchCode;
    this.transactionsService.role = user.role;
    activatedRoute.params.subscribe(params => {
    if (this.tableComponent != null) {
      this.tableComponent.defaultValues();
    }
      this.routeParams = params.id;
      this.tableUrl = transactionsService.getRouteUrls(params.id);
      if (this.tableUrl != null && this.tableUrl.coustom) {
        this.tableData = null;
        this.getTableData();
      }
    });
  }

  ngOnInit() {
  }

  deleteRecord(value) {
    const dialogRef = this.dialog.open(DeleteItemComponent, {
      width: '1024px',
      data: value,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.spinner.show();
        const deleteCompanyUrl = [this.tableUrl.deleteUrl, result.item[this.tableUrl.primaryKey]].join('/');
        this.apiService.apiDeleteRequest(deleteCompanyUrl, result.item)
          .subscribe(
            response => {
              const res = response.body;
              if (res != null && res.status === StatusCodes.pass) {
                if (res.response != null) {
                  this.tableComponent.defaultValues();
                  this.getTableData();
                  this.alertService.openSnackBar('Delected Record...', 'close', SnackBar.success);
                }
              }
              this.spinner.hide();
            });
      }
    });
  }

  addOrUpdateEvent(value) {
    if (value.action === 'Delete') {
      this.deleteRecord(value);
    } else {
      const dialogRef = this.dialog.open(this.tableUrl.component, {
        width: '80%',
        //height: '350px',
        data: value,
        panelClass: 'custom-dialog-container',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.spinner.show();
          if (result.action === 'Add') {
            const addCompanyUrl = [this.tableUrl.registerUrl].join('/');
            this.apiService.apiPostRequest(addCompanyUrl, result.item)
              .subscribe(
                response => {
                  const res = response.body;
                  if (res != null && res.status === StatusCodes.pass) {
                    if (res.response != null) {
                      this.tableComponent.defaultValues();
                      this.getTableData();
                      this.alertService.openSnackBar('Record Added...', 'close', SnackBar.success);
                    }
                  }
                  this.spinner.hide();
                });
          } else if (result.action === 'Edit') {
            const updateCompanyUrl = [this.tableUrl.updateUrl].join('/');
            this.apiService.apiUpdateRequest(updateCompanyUrl, result.item)
              .subscribe(
                response => {
                  const res = response.body;
                  this.spinner.hide();
                  if (res != null && res.status === StatusCodes.pass) {
                    if (res.response != null) {
                      this.tableComponent.defaultValues();
                      this.getTableData();
                      this.alertService.openSnackBar('Record Updated...', 'close', SnackBar.success);
                    }
                  }
                });
          }
        }
      });
    }
  }

  getTableData() {
    this.tableData = null;
    const getUrl = [this.tableUrl.url].join('/');
    this.apiService.apiGetRequest(getUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              this.tableData = res.response[this.tableUrl.listName];
            }
          }
          this.spinner.hide();
        });
  }

}
