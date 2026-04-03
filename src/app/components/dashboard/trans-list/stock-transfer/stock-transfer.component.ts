import { Component, OnInit, ViewChild, NgZone, Input } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { ApiConfigService } from '../../../../services/api-config.service';

import { ApiService } from '../../../../services/api.service';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../directives/format-datepicker';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { SaveItemComponent } from '../../../../reuse-components/save-item/save-item.component';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, SaveItemComponent, DatePipe]
})
export class StockTransferComponent implements OnInit {
  formData: FormGroup;
  routeUrl = '';
  getBranchesListArray = [];
  tableFormData: FormGroup;
  totalQty: any;
  totalAmount: any;
  totalLtrs: any;
  getProductByProductCodeArray = [];
  getProductByProductNameArray = [];
  getTableArray = [];
  printBill = false;
  setFocus: any;
  params = new HttpParams();
  @Input() tableData: any;
  @Input() headerData: any = [];
  @Input() footerData: any;
  routeParam: any;
  tableHeaders: any = [];

  displayedColumns: string[] = ['SlNo', 'productCode', 'productName', 'hsnNo', 'qty', 'ltrs', 'fQty', 'unitId', 'rate', 'totalAmount', 'availStock', 'batchNo', 'delete'];
  dataSource: MatTableDataSource<any>;

  date = new Date((new Date().getTime() - 3888000000));
  getLtrsArray: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private router: Router,
  ) {
    this.formDataGroup();
  }

  formDataGroup() {
    this.formData = this.formBuilder.group({
      stockTransferMasterId: [0],
      stockTransferNo: [null],
      stockTransferDate: [(new Date()).toISOString()],
      fromBranchCode: [null],
      fromBranchName: [null],
      toBranchCode: [null],
      toBranchName: [null],
      shiftId: [null],
      userId: [null],
      userName: [null],
      employeeId: [null],
      narration: [null],
      serverDateTime: [null]
    });
  }

  ngOnInit() {
    this.allApis();
  }


  allApis() {
    const getBranchesListUrl = this.apiConfigService.getBillingBranchesList;
    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getBranchesListUrl),
      ]).subscribe(([branchesList]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(branchesList) && branchesList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(branchesList.response)) {
            this.getBranchesListArray = branchesList.response['BranchesList'];
            this.setBranchCode('fromBranchCode', 'fromBranchName');
          }
        }

      });
    });

    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != 'New') {
        this.routeUrl = params.id1;
        if (params.value != null) {
          this.getStockTransferDetilsaRecords(params.value);
        }
        this.disableForm(params.id1);
      } else {
        this.addTableRow();
        this.disableForm();
        this.formGroup();
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.branchCode != null) {
          this.formData.patchValue({
            fromBranchCode: +user.branchCode,
            userId: user.seqId,
            userName: user.userName
          });
        }
      }
    });

  }

  setBranchCode(code, text) {
    let flag = false;
    const branchList = JSON.parse(localStorage.getItem('branchList'));
    for (let b = 0; b < branchList.length; b++) {
      if (this.formData.get('fromBranchCode').value == branchList[b]) {
        flag = true;
      }
    }
    if (!flag) {
      this.alertService.openSnackBar(`You are not eligible to use this Branch(${this.formData.get('fromBranchCode').value}) code`, Static.Close, SnackBar.error);
      this.formData.patchValue({
        fromBranchCode: null,
        fromBranchName: null,
        stockTransferNo: null
      });
    } else {
      const bname = this.getBranchesListArray.filter(branchCode => {
        if (branchCode.id == this.formData.get(code).value) {
          return branchCode;
        }
      });
      if (bname.length) {
        this.formData.patchValue({
          [text]: bname?.[0] != null ? bname[0].text : null
        });
        if (code == 'fromBranchCode' && this.routeUrl == '') {
          this.generateStockTranfNo();
        }
      }
    }
  }

  getStockTransferDetilsaRecords(id) {
    const getStockTransferDetilsaRecordsUrl = [this.apiConfigService.getStockTransferDetilsaRecords, id].join('/');
    this.apiService.apiGetRequest(getStockTransferDetilsaRecordsUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.InvoiceList?.length > 0) {
            this.getltrs(res.response['InvoiceList'][0]);
            this.dataSource = new MatTableDataSource(res.response['InvoiceList']);
            if (res?.response?.invoiceMasterData != null) {
              this.formData.patchValue(res.response['invoiceMasterData']);
            }
            this.calculateAmount();
            this.spinner.hide();
          }
        }
      });
  }

  disableForm(route?) {
    if (route != null) {
      this.formData.controls['stockTransferMasterId'].disable();
      this.formData.controls['stockTransferDate'].disable();
      this.formData.controls['fromBranchCode'].disable();
      this.formData.controls['fromBranchName'].disable();
      this.formData.controls['toBranchCode'].disable();
      this.formData.controls['toBranchName'].disable();
      this.formData.controls['shiftId'].disable();
      this.formData.controls['userId'].disable();
      this.formData.controls['employeeId'].disable();
      this.formData.controls['narration'].disable();
      this.formData.controls['serverDateTime'].disable();
    }
    this.formData.controls['stockTransferNo'].disable();
    this.formData.controls['userName'].disable();

  }

  GetBranchesList() {
    const getBranchesListUrl = this.apiConfigService.getBillingBranchesList;
    this.apiService.apiGetRequest(getBranchesListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.BranchesList?.length > 0) {
              this.getBranchesListArray = res.response['BranchesList'];
              this.setBranchCode('fromBranchCode', 'fromBranchName');
              this.spinner.hide();
            }
          }
        }
      });
  }


  addTableRow() {
    const tableObj = {
      stockTransferDetailId: '', stockTransferMasterId: '', stockTransferDetailsDate: '', productId: '', STockTransferDetail: '',
      productCode: '', productName: '', hsnNo: '', rate: '', productGroupId: '', productGroupCode: '', qty: '',
      ltrs: '',
      fQty: '', batchNo: '', unitId: '', unitName: '', totalAmount: '', availStock: '', text: 'obj', delete: ''
    }
    if (this.dataSource != null) {
      this.dataSource.data.push(tableObj);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    } else {
      this.dataSource = new MatTableDataSource([tableObj]);
    }
    this.commonService.setFocus(this.setFocus);
  }

  clearQty(index, value, column, row) {
    this.dataSource.data[index].qty = 0;
    this.dataSource.data[index].fQty = 0;
    if (row.availStock < value) {
      this.alertService.openSnackBar(`This Product(${row.productCode}) qty or Fqty cannot be greater than available stock`, Static.Close, SnackBar.error);
      return;
    }
    this.dataSource.data[index][column] = value;
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  deleteRow(i) {
    if (this.dataSource.data.length == 1) {
      return;
    }
    this.dataSource.data = this.dataSource.data.filter((value, index, array) => {
      return index !== i;
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.calculateAmount();
  }

  formGroup() {
    this.tableFormData = this.formBuilder.group({
      stockTransferDetailId: [null],
      stockTransferMasterId: [0],
      stockTransferDetailsDate: [null],
      productId: [null],
      STockTransferDetail: [null],
      productCode: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      hsnNo: [null],
      rate: [null],
      productGroupId: [null],
      productGroupCode: [null],
      qty: [null],
      ltrs: [null],
      fQty: [0],
      batchNo: [null],
      unitId: [null],
      unitName: [null],
      totalAmount: [null],
      totalLtrs: [null],
      availStock: [null]
    });
  }

  setToFormModel(text, column, value) {
    if (text == 'obj') {
      this.tableFormData.patchValue({
        [column]: value
      });
    }
    if (this.tableFormData.valid) {
      // if (this.dataSource.data.length) {
      if (this.dataSource.data[this.dataSource.data.length - 1].productCode != '') {
        this.addTableRow();
      }
      this.formGroup();
      // }
    }
  }

  generateStockTranfNo() {
    const generateStockTranfNoUrl = [this.apiConfigService.generateStockTranfNo, this.formData.get('fromBranchCode').value].join('/');
    this.apiService.apiGetRequest(generateStockTranfNoUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.SateteList?.length) {
              this.formData.patchValue({
                stockTransferNo: (res.response['SateteList'] != null) ? res.response['SateteList'] : null
              });
              this.spinner.hide();
            }
          }
        }
      });
  }


  getProductByProductCode(value) {
    // this.getltrs(value);
    if (value != null && value !== '') {
      const getProductByProductCodeUrl = this.apiConfigService.getProductByProductCode;
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { productCode: value }).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.Products != null) {
                this.getProductByProductCodeArray = res.response['Products'];
                this.spinner.hide();
              }
            }
          }
        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }


  getStockTransferDetailsSection(productCode, index, id) {
    this.setFocus = id + index;
    this.commonService.setFocus(id + index)
    // if (this.checkProductCode(productCode, index)) {
    const fromBranchCode = this.formData.get('fromBranchCode')?.value;

    if (fromBranchCode != null && fromBranchCode !== '' &&
      productCode?.value != null && productCode.value !== '') {
      const getStockTransferDetailsSectionUrl = this.apiConfigService.getStockTransferDetailsSection;
      this.apiService.apiPostRequest(getStockTransferDetailsSectionUrl, {
        branchCode: this.formData.get('fromBranchCode').value, productCode: productCode.value
      }).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if ((res.response['SateteList'] != null)) {
                this.getltrs(res.response['SateteList'], index);
                this.getProductByProductCodeArray = [];
                this.spinner.hide();
              }
            }
          }
        });
      // this.addTableRow();
    }
    // } else {
    //   this.dataSource.data[index].productCode = null;
    //   this.dataSource = new MatTableDataSource(this.dataSource.data);
    //   this.alertService.openSnackBar(`Product Code( ${productCode.value} ) Allready Selected`, Static.Close, SnackBar.error);
    // }
  }

  // checkProductCode(code, index) {
  //   if (code?.value != null) {
  //     for (let c = 0; c < this.dataSource.data.length; c++) {
  //       if ((this.dataSource.data[c].productCode == code.value) && c != index) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   }
  // }


  detailsSection(obj, index) {
    if (obj?.availStock == null || obj.availStock === 0) {
      this.alertService.openSnackBar(`This Product(${obj.productCode}) available stock is 0`, Static.Close, SnackBar.error);
    }
    obj.text = 'obj';
    if (obj.qty == 0) {
      obj.qty = '';
    }
    this.dataSource.data[index] = obj;
    this.dataSource = new MatTableDataSource(this.dataSource.data);

    this.tableFormData.patchValue({
      productCode: obj.productCode,
      productName: obj.productName,
    });

    this.setToFormModel(null, null, null);

  }

  getProductByProductName(value) {

    if (value != null && value !== '') {
      const getProductByProductNameUrl = this.apiConfigService.getProductByProductName;
      this.apiService.apiPostRequest(getProductByProductNameUrl, { productName: value }).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.Products != null) {
                this.getProductByProductNameArray = res.response['Products'];
                this.spinner.hide();
              }
            }
          }
        });
    } else {
      this.getProductByProductNameArray = [];
    }
  }
  getltrs(value, index?) {
    if (value?.productCode != null && value.productCode !== '') {
      const getProductByProductNameUrl = this.apiConfigService.getLtrs;
      this.apiService.apiPostRequest(getProductByProductNameUrl, { code: value.productCode }).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.Ltrs != null) {
                console.log(res.response['Ltrs']);
                value.ltrs = res.response['Ltrs'][0]['id'];
                if ((index != null)) {
                  this.detailsSection(value, index);
                }
                else {
                  value.ltrs = +(value.qty) * +(value.ltrs);
                  value.totalQty = value.qty;
                  value.totalAmount = value.totalAmount;
                  this.totalLtrs = +(value.ltrs);
                  // for (let a = 0; a < this.dataSource.data.length; a++) 
                  // {
                  //   if (this.dataSource.data[a].totalAmount)
                  //   {

                  //   }

                  // }
                  // this.dataSource = new MatTableDataSource([value]);
                  this.spinner.hide();
                }
              }
            }
          }
        });
    }

  }


  calculateAmount(row?, index?) {
    if (row != null) {
      if ((row.qty != null) && (row.qty != '')) {
        this.dataSource.data[index].totalAmount = (row.qty * row.rate).toFixed(2);
      }
      if ((row.ltrs != null) && (row.ltrs != '')) {
        this.dataSource.data[index].totalltrs = (row.qty * row.ltrs);
        this.dataSource.data[index].ltrs = (row.qty * row.ltrs);
      }

      else if ((row.fQty != null) && (row.fQty != '')) {
        this.dataSource.data[index].totalAmount = (0 * row.rate).toFixed(2);
      }
    }
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    let amount = 0;
    let totltrs = 0;
    let qty = 0;
    let ltrs = 0;
    for (let a = 0; a < this.dataSource.data.length; a++) {
      if (this.dataSource.data[a].totalAmount) {
        amount = amount + (+this.dataSource.data[a].totalAmount);
        totltrs = totltrs + (+this.dataSource.data[a].totalltrs);
      }
      if ((this.dataSource.data[a].qty != null)) {
        qty = qty + this.dataSource.data[a].qty;
        //ltrs=this.dataSource.data[a].qty * this.dataSource.data[a].ltrs;
      }
      // if ((this.dataSource.data[a].ltrs) != null)
      // {
      //   this.dataSource.data[a].ltrs = this.dataSource.data[a].qty * this.dataSource.data[a].ltrs;
      // }      
      else if ((this.dataSource.data[a].fQty != null)) {
        qty = qty + this.dataSource.data[a].fQty;
      }
    }
    this.totalQty = qty;
    this.totalAmount = (amount != null) ? amount : null,
      this.totalLtrs = (totltrs != null) ? totltrs : 0,
      this.formData.patchValue({
        totalAmount: (amount != null) ? amount.toFixed(2) : null,
      });
  }

  save() {
    if (this.routeUrl != '' || this.dataSource.data.length == 0) {
      return;
    }
    let tableData = [];
    for (let d = 0; d < this.dataSource.data.length; d++) {
      if (this.dataSource.data[d]['productCode'] != '') {
        tableData.push(this.dataSource.data[d]);
      }
    }
    let content = '';
    let availStock = tableData.filter(stock => {
      if (stock.availStock == 0) {
        content = '0 Availablilty Stock';
        return stock;
      }
      if (stock?.qty == null && stock?.fQty == null) {
        content = 'qty or Fqty is null';
        return stock;
      }
      if ((stock.qty > stock.availStock) || (stock.fQty > stock.availStock)) {
        content = 'qty or Fqty cannot be greater than available stock';
        return stock;
      }
    });
    if (availStock.length) {
      this.alertService.openSnackBar(`This Product(${availStock[0].productCode}) ${content}`, Static.Close, SnackBar.error);
      return;
    }

    const dialogRef = this.dialog.open(SaveItemComponent, {
      width: '1024px',
      data: '',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.enableFileds();
        this.registerStockTransfer(tableData);
      }
    });

    // this.enableFileds();
    // this.registerStockTransfer(tableData);
  }

  enableFileds() {
    this.formData.controls['stockTransferNo'].enable();
    this.formData.controls['userName'].enable();
  }


  setProductName(name) {
    this.tableFormData.patchValue({
      productName: name.value,
    });
    this.setToFormModel(null, null, null);
  }



  registerStockTransfer(data) {
    const registerStockTransferUrl = this.apiConfigService.registerStockTransfer;
    const requestObj = { stockTransferMaster: this.formData.value, stockTransferDetail: data };
    this.apiService.apiPostRequest(registerStockTransferUrl, requestObj).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar('Stock Trasfer Created Successfully..', Static.Close, SnackBar.success);
          }
          this.spinner.hide();
          this.reset();
        }
      });
  }

  reset() {
    this.formData.reset();
    this.dataSource = new MatTableDataSource();
    this.formDataGroup();
  }

  exportToPdf() {
    const requestObj = { StockHdr: this.formData.value, StockDetail: this.dataSource.data };
    let tableUrl = this.apiConfigService.getStockTransferPrintReportData;
    const user = JSON.parse(localStorage.getItem('user'));
    this.params = this.params.append('userName', user.userName);
    this.params = this.params.append('fromBranchCode', this.formData.value.fromBranchCode);
    this.params = this.params.append('stockTransferNo', this.formData.value.stockTransferNo);
    this.apiService.apiGetRequest(tableUrl, this.params).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.StockList != null) {
              this.getTableArray = res.response['StockList'];
              this.tableHeaders = res.response['headerList'];
              this.footerData = res.response['footerList'];
              this.spinner.hide();
              let doc = new jsPDF('p', 'mm', 'a3');
              let columns = []; //["ID", "Name", "Country"];
              for (const key in this.getTableArray[0]) {
                columns.push(key);
              }
              let rows = [];
              for (var i: number = 0; i < this.dataSource.filteredData.length; i++) {
                rows[i] = [];
                let j = 0;
                for (const key in this.getTableArray[0]) {
                  rows[i][j] = this.dataSource.filteredData[i][key];
                  j++;
                }
              }

              autoTable(doc, {
                body: [
                  [{ content: 'StockTransfer' + ' Report', colSpan: 2, rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
                ],
                theme: 'plain'
              });
              let pipe = new DatePipe('en-US');
              let currentDate = new Date();

              let headerRows = [];
              for (var i: number = 0; i < this.tableHeaders.length; i++) {
                headerRows[i] = [];
                let j = 0;
                for (const key in this.tableHeaders[0]) {
                  headerRows[i][j] = this.tableHeaders[i][key];
                  j++;
                }
              }

              headerRows = [
                headerRows[0] ? headerRows[0].concat(headerRows[1]) : "",
                headerRows[2] ? headerRows[2].concat(headerRows[3]) : "",
                headerRows[4] ? headerRows[4].concat(headerRows[5]) : "",
                headerRows[6] ? headerRows[6].concat(headerRows[7]) : "",
                headerRows[8] ? headerRows[8].concat(headerRows[9]) : "",
                headerRows[10] ? headerRows[10].concat(headerRows[11]) : "",
                headerRows[12] ? headerRows[12].concat(headerRows[13]) : "",
                headerRows[14] ? headerRows[14].concat(headerRows[15]) : ""
              ];

              headerRows = headerRows.filter(arr => arr != "");
              autoTable(doc, {
                margin: { top: 10 },
                columnStyles: {
                  1: { halign: 'right' }
                },
                body: headerRows,
                theme: 'plain'
              })
              autoTable(doc, {
                head: [columns],
                body: rows,
                startY: (doc as any).lastAutoTable.finalY + 5
              });

              let footerRows = [];
              for (var i: number = 0; i < this.footerData.length; i++) {
                footerRows[i] = [];
                let j = 0;
                for (const key in this.footerData[0]) {
                  footerRows[i][j] = this.footerData[i][key];
                  j++;
                }
              }
              let updatedFooterRows = [];

              if (footerRows && footerRows.length) {
                footerRows.forEach((ft) => {
                  let temp = [];
                  ft.forEach(data => {
                    if (data != "") {
                      temp.push(data);
                    }
                  });
                  updatedFooterRows.push(temp);
                })
              }
              autoTable(doc, {
                body: updatedFooterRows,
                theme: 'plain',
                startY: (doc as any).lastAutoTable.finalY + 10
              })
              doc.save('StockTransfer' + 'Report.pdf');
            }
          }
        }
      });
  }

  back() {
    this.router.navigate(['/dashboard/transaction/stockTransfer']);
  }

}
