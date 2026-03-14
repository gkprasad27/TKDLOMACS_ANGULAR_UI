import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../services/alert.service';
import { SalesService } from './sales.service';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { StocktransferComponent } from './stocktransfer/stocktransfer.component';
import { SalesReturnComponent } from './sales-return/sales-return.component';
import { SalesInvoiceComponent } from './sales-invoice/sales-invoice.component';

@Component({ 
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule, PurchaseReturnComponent, PurchaseComponent, StocktransferComponent, SalesReturnComponent, SalesInvoiceComponent, ]
    
})
export class SalesComponent implements OnInit, OnDestroy {

  tableData: any;
  addOrUpdateData: any;
  tableUrl: any;
  routeParams: any;
  private routeSub: Subscription | null = null;



  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private salesService: SalesService
  ) {
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      if (params && params.id != null) {
        this.routeParams = params.id;
        this.tableUrl = this.salesService.getRouteUrls(params.id);
      } else {
        this.routeParams = null;
        this.tableUrl = null;
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
      this.routeSub = null;
    }
  }

}
