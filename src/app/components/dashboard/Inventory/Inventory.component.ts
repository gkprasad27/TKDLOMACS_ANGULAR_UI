import { Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../services/api.service';

import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { NgxSpinnerService } from 'ngx-spinner';
import { StatusCodes } from '../../../enums/common/common';
import { DeleteItemComponent } from '../../../reuse-components/delete-item/delete-item.component';
import { TableComponent } from '../../../reuse-components/table/table.component';
import { AlertService } from '../../../services/alert.service';
import { SnackBar } from '../../../enums/common/common';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 
import { InventoryService } from './inventory.service';

@Component({ 
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [SharedImportModule, TranslateModule, TableComponent, DeleteItemComponent]
})
export class InventoryComponent implements OnInit {
    tableData: any;
    addOrUpdateData: any;
    tableUrl: any;

    @ViewChild(TableComponent) tableComponent: TableComponent;

    constructor(
        private apiService: ApiService,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        private generalLedgerService: InventoryService,
        private spinner: NgxSpinnerService,
        private alertService: AlertService,

      ) {
        activatedRoute.params.subscribe(params => {
          this.tableUrl = generalLedgerService.getRouteUrls(params.id);
          if (this.tableUrl != null) {
            this.getTableData();
            if (this.tableComponent != null) {
              this.tableComponent.defaultValues();
            }
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
