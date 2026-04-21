
import {
  Component, OnInit, ViewChild, Input, OnChanges,
  ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnDestroy
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';

import { ActivatedRoute } from '@angular/router';
import { DeleteItemComponent } from '../delete-item/delete-item.component';
import { SearchFilterTableComponent } from '../search-filter-table/search-filter-table.component';
import { NgxSpinnerService } from 'ngx-spinner';
// search

import { FormGroup, FormControl, AbstractControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject, pipe } from 'rxjs';
import { take, takeUntil, map } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { User } from '../../models/common/user';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ReportsInnerTableComponent } from '../reports-inner-table/reports-inner-table.component';
import { ApiService } from 'src/app/services/api.service';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { runInThisContext } from 'vm';
import { ReportsService } from 'src/app/components/dashboard/reports/reports.service';
import { SnackBar, StatusCodes } from 'src/app/enums/common/common';
import moment from 'moment';
import { style } from '@angular/animations';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AlertService } from 'src/app/services/alert.service';
import { RuntimeConfigService } from 'src/app/services/runtime-config.service';
import { Static } from 'src/app/enums/common/static';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, TypeaheadModule, NgxDaterangepickerMd]
})
export class ReportTableComponent implements OnInit, OnChanges {
  selectedDate = { start: moment().add(-1, 'day'), end: moment().add(0, 'day') };
  GetBankPAccountLedgerListArray = [];
  GetProductListArray = [];
  public tableMultiCtrl: FormControl = new FormControl();
  public filteredTableMulti: ReplaySubject<any> = new ReplaySubject<any>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected onDestroy = new Subject<void>();

  dateForm: FormGroup;
  params = new HttpParams();
  @Input() tableData: any;
  @Input() headerData: any = [];
  @Input() footerData: any;
  @Output() generateTable = new EventEmitter();

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  highlightedRows = [];
  columnDefinitions = [];
  filterColData = [];

  keys = [];
  index: any;
  user: User;
  routeParam: any;
  excelUrl: any;
  Reports = [
    // { id: '1', reportName: 'Shift Report' },
    { id: '2', reportName: 'Shift wise Meter Reading' },
    { id: '3', reportName: 'Shift wise sales stock' },
    { id: '4', reportName: 'Shift wise hdfc bank account' },
    { id: '5', reportName: 'Shift wise  fleet card account' },
    { id: '6', reportName: 'Shift wise daily sales report' },
    { id: '7', reportName: 'Shift wise Sale Value' },
    { id: '8', reportName: 'Shift wise ICICI SWIPE RECEIVABLES A/c' },
    { id: '9', reportName: 'Shift wise PINE LAB' },
    { id: '10', reportName: 'Shift wise PAYTM' }
  ];
  AccountLedgers = [];
  ReportBranches = [];
  ReportPGList = [];
  ReportSGList = [];
  Products = [];

  tableHeaders: any = [];
  SearchCriteria = [
    { id: 'branchCode', parameter: 'Branch Code' },
    { id: 'shiftId', parameter: 'Shift Id' },
    { id: 'userId', parameter: 'User Id' }
  ];
  search = [];
  ReportsType = [
    { id: '1', reportName: 'Product Price List All Branch Report' },
    { id: '2', reportName: 'Product Price List By Branch Report' }
  ];
  TrialBalanceReportType = [
    { id: '1', reportName: 'Trial Balance Report' },
    { id: '2', reportName: 'Trial Balance Group Report' }
  ];
  ClosingBalanceReportType = [
    { id: '1', reportName: 'Credit' },
    { id: '2', reportName: 'Debit' },
    { id: '3', reportName: 'Both' }
  ];
  FourColumnReportType = [
    { id: '1', reportName: 'FourColumn Cash Book By Branch' },
    { id: '2', reportName: 'FourColumn Cash Book COnsolidate' }
  ];
  GroupName = [
    { id: 'Spares', parameter: 'Spares' },
    { id: 'Lubes', parameter: 'Lubes' },
    { id: 'Fuels', parameter: 'Fuels' }
  ];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private reportsService: ReportsService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private runtimeConfigService: RuntimeConfigService
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));

    this.dateForm = this.formBuilder.group({
      selected: [null],
      formDate: ['', Validators.required],
      toDate: ['', Validators.required],
      selectedReport: [''],
      selectedAccountLedger: [''],
      ledgerName: [''],
      selectedBranch: [+this.user.branchCode],
      selectedProduct: [],
      selectedCriteria: [''],
      vehicleRegNo: [null],
      search: [null],
      selectedReportType: [''],
      selectedTrialReportType: [''],
      selectedClosingReportType: [''],
      fromAccountLedger: [''],
      toAccountLedger: [''],
      RO: [null],
      selectedFourColumnReportType: [''],
      selectedGroupName: [''],
      selectedSupplierGroup: ['']
    }, { validator: this.checkDates });

    activatedRoute.params.subscribe(params => {
      this.routeParam = params.id;
      this.tableHeaders = [];
      // this.dateForm.reset();
    });

    const user = JSON.parse(localStorage.getItem('user'));

    if (user?.role != '1') {
      this.dateForm.controls['selectedBranch'].disable();
    }

  }
  checkDates(group: FormGroup) {
    if (group.controls.formDate.value < group.controls.toDate.value) {
      return { notValid: true }
    }
    return null;
  }
  defaultValues() {
    this.params = new HttpParams();
    this.dataSource = new MatTableDataSource();
    this.highlightedRows = [];
    this.columnDefinitions = [];
    this.keys = [];
    this.index = null;
    this.filterColData = [];
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  checkboxCheck(index) {

    this.filterColData[index] = {
      def: this.filterColData[index].def,
      label: this.filterColData[index].label, hide: !this.filterColData[index].hide
    };

  }

  checkCheckBoxvalue(event) {
    this.dateForm.patchValue({
      RO: event.checked
    })
  }

  saveChanges() {
    this.columnDefinitions = this.filterColData.slice(0);
    this.filterColData = [];
  }
  getDisplayedColumns(): string[] {
    if (this.tableData != null) {
      return this.columnDefinitions.filter(cd => cd.hide).map(cd => cd.def);
    }
  }
  toggleSelectAll(selectAllValue: boolean) {
    this.filteredTableMulti.pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.tableMultiCtrl.patchValue(val);
        } else {
          this.tableMultiCtrl.patchValue([]);
        }
      });
  }


  allApis() {
    const getReportBranchList = this.apiConfigService.getReportBranchList;
    const getReportPGList = this.apiConfigService.getReportPGList;
    const getReportSGList = this.apiConfigService.getReportSGList;
    const getAccountLedgersList = this.apiConfigService.getAccountLedgersList;

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin({
        reportBranchList: this.apiService.apiGetRequest(getReportBranchList),
        reportPGList: this.apiService.apiGetRequest(getReportPGList),
        reportSGList: this.apiService.apiGetRequest(getReportSGList),
        accountLedgersList: this.apiService.apiGetRequest(getAccountLedgersList),
      }).subscribe(res => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(res.accountLedgersList) && res.accountLedgersList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.accountLedgersList.response)) {
            this.AccountLedgers = res.accountLedgersList.response['accountLedgerList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(res.reportBranchList) && res.reportBranchList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.reportBranchList.response)) {
            this.ReportBranches = [{ branchCode: null, branchName: null }, ...res.reportBranchList.response['reportBranchesList']];
          }
        }

        if (!this.commonService.checkNullOrUndefined(res.reportPGList) && res.reportPGList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.reportPGList.response)) {
            this.ReportPGList = res.reportPGList.response['reportPGList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(res.reportSGList) && res.reportSGList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(res.reportSGList.response)) {
            this.ReportSGList = res.reportSGList.response['reportSGList'];
          }
        }


      });
    });

  }

  // getProductsList() {
  //   const getLoginUrl = [this.apiConfigService.getStockProducts].join('/');
  //   this.apiService.apiGetRequest(getLoginUrl)
  //     .subscribe(
  //       response => {
  //         const res = response;
  //         if (res?.status === 'PASS') {
  //           if ((res.response['productList'] != null)) {
  //             this.Products = res.response['productList'];
  //           }
  //         }
  //       });
  // }

  getProductsList(value) {
    if (value != null && value !== '') {
      const getProductListUrl = [this.apiConfigService.getStockProducts, value].join('/');
      this.apiService.apiGetRequest(getProductListUrl).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.ProductList?.length) {
                this.GetProductListArray = res.response['ProductList'];
                //this.getCashPartyAccount();
              } else {
                this.GetProductListArray = [];
              }
            }
            this.spinner.hide();
          }
        });
    } else {
      this.GetProductListArray = [];
    }
  }

  getBankPAccountLedgerList(value) {
    if (value != null && value !== '') {
      const getBankPAccountLedgerListUrl = [this.apiConfigService.getBPAccountLedgerList, value].join('/');
      this.apiService.apiGetRequest(getBankPAccountLedgerListUrl).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.AccountLedgerList?.length > 0) {
                res.response['AccountLedgerList'].forEach((a: any) => a.display = a.id + ' - ' + a.text);
                this.GetBankPAccountLedgerListArray = res.response['AccountLedgerList'];
                //this.getCashPartyAccount();
              } else {
                this.GetBankPAccountLedgerListArray = [];
              }
            }
          }
        });
    } else {
      this.GetBankPAccountLedgerListArray = [];
    }
  }

  setLedgerName(value) {
    const lname = this.GetBankPAccountLedgerListArray.find(lCode => lCode.display == this.dateForm.get('selectedAccountLedger').value);
    this.dateForm.patchValue({
      selectedAccountLedger: lname ? lname.display : null,
      ledgerName: lname ? lname.text : null
    });
  }

  setProductName(value) {
    const pname = this.GetProductListArray.filter(pCode => {
      if (pCode.id == this.dateForm.get('selectedProduct').value) {
        return pCode;
      }
    });
    this.dateForm.patchValue({
      selectedProduct: (pname[0] != null) ? pname[0].id : null
    });
  }


  GenerateReport() {

    if (this.dateForm.invalid) {
      let flag = false;
      const controls = this.dateForm.controls;
      for (const name in controls) {
        if (controls.hasOwnProperty(name)) {
          const control = controls[name];
          if (control.errors && control.errors['required']) {
            flag = true;
            console.log('First required error in control:', name);
            this.alertService.openSnackBar(
              `${this.runtimeConfigService.tableColumnsData['report'][name]} is required`,
              Static.Close,
              SnackBar.error
            );
            break; // stop at first required error
          }
        }
      }
      if (flag) {
        return;
      }
    }

    this.dateForm.patchValue({
      formDate: this.commonService.formatReportDate(this.dateForm.value.formDate),
      toDate: this.commonService.formatReportDate(this.dateForm.value.toDate),
      selectedReport: this.dateForm.get('selectedReport').value,
      selectedAccountLedger: this.dateForm.get('selectedAccountLedger').value,
      selectedBranch: this.dateForm.get('selectedBranch').value,
      selectedProduct: this.dateForm.get('selectedProduct').value,
      vehicleRegNo: this.dateForm.get('vehicleRegNo').value,
      selectedCriteria: this.dateForm.get('selectedCriteria').value,
      search: this.dateForm.get('search').value,
      selectedReportType: this.dateForm.get('selectedReportType').value,
      selectedTrialReportType: this.dateForm.get('selectedTrialReportType').value,
      selectedClosingReportType: this.dateForm.get('selectedClosingReportType').value,
      fromAccountLedger: this.dateForm.get('fromAccountLedger').value,
      toAccountLedger: this.dateForm.get('toAccountLedger').value,
      RO: this.dateForm.get('RO').value,
      selectedFourColumnReportType: this.dateForm.get('selectedFourColumnReportType').value,
      selectedGroupName: this.dateForm.get('selectedGroupName').value,
      selectedSupplierGroup: this.dateForm.get('selectedSupplierGroup').value,
    })
    this.params = new HttpParams();
    this.params = this.params.append('UserID', 'admin');//this.user.userName);
    this.params = this.params.append('userName', 'admin');//this.user.userName);
    this.params = this.params.append('companyId', 0);//this.user.userName);this.params = this.params.append('fromDate', this.dateForm.get('formDate')?.value);
    this.params = this.params.append('fromDate', this.dateForm.get('formDate').value);
    this.params = this.params.append('toDate', this.dateForm.get('toDate')?.value);
    this.params = this.params.append('reportID', this.dateForm.get('selectedReport')?.value);
    // this.params = this.params.append('shiftId', this.dateForm.get('selectedReport')?.value);

    const lname = this.GetBankPAccountLedgerListArray.length && this.GetBankPAccountLedgerListArray.find(lCode => lCode.display == this.dateForm.get('selectedAccountLedger').value);
    this.params = this.params.append('ledgerCode', lname?.id);
    this.params = this.params.append('ledgerName', this.dateForm.get('ledgerName')?.value);
    this.params = this.params.append('branchCode', +this.dateForm.get('selectedBranch')?.value);
    this.params = this.params.append('branchID', +this.dateForm.get('selectedBranch')?.value);
    this.params = this.params.append('productCode', this.dateForm.get('selectedProduct')?.value);
    this.params = this.params.append('selectedCriteria', this.dateForm.get('selectedCriteria')?.value);
    this.params = this.params.append('search', this.dateForm.get('search')?.value);
    this.params = this.params.append('vehicleRegNo', this.dateForm.get('vehicleRegNo')?.value);
    this.params = this.params.append('reportType', this.dateForm.get('selectedReportType')?.value);
    this.params = this.params.append('TrialreportType', this.dateForm.get('selectedTrialReportType')?.value);
    this.params = this.params.append('ClosingreportType', this.dateForm.get('selectedClosingReportType')?.value);
    this.params = this.params.append('fromLedgerCode', this.dateForm.get('fromAccountLedger')?.value);
    this.params = this.params.append('toLedgerCode', this.dateForm.get('toAccountLedger')?.value);
    this.params = this.params.append('RO', this.dateForm.get('RO')?.value);
    this.params = this.params.append('fourColumnreportType', this.dateForm.get('selectedFourColumnReportType')?.value);
    this.params = this.params.append('GroupName', this.dateForm.get('selectedGroupName')?.value);
    this.params = this.params.append('SupplierGroup', this.dateForm.get('selectedSupplierGroup')?.value);
    if (this.dateForm.value.selectedCriteria == "shiftId") {
      this.params = this.params.append('shiftId', this.dateForm.value.search);
    } else {
      this.params = this.params.append('shiftId', this.dateForm.value.selectedReport);
    }
    if (this.routeParam == 'Shift' && this.dateForm.value.selectedCriteria == 'branchCode') {
      this.reportsService.branchCode = this.dateForm.value.search;
      this.reportsService.dynamicData.url = `${this.apiConfigService.getDefaultShiftReport}/${this.reportsService.branchCode}`;
    }
    if (this.routeParam == 'Shift' && this.dateForm.value.selectedCriteria != 'branchCode') {
      this.reportsService.branchCode = this.dateForm.value.search;
      this.reportsService.dynamicData.url = `${this.apiConfigService.getDefaultShiftReport}/${null}`;
    }
    // else
    // {
    //    this.params = this.params.append('vehicleRegNo', this.dateForm.value.vehicleRegNo);
    // }

    this.generateTable.emit(this.params);

    this.dateForm.controls['formDate'].setValue(new Date(this.dateForm.controls['formDate'].value));
    this.dateForm.controls['toDate'].setValue(new Date(this.dateForm.controls['toDate'].value));
  }

  exportToExcel(): void {
    let columns = [];
    for (const key in this.tableData[0]) {
      columns.push(key);
    }
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Report', {
      pageSetup: { fitToPage: true, paperSize: 11, orientation: 'landscape' }
    });
    //Add Row and formatting
    let titleRow = worksheet.addRow([this.routeParam + ' Report']);
    titleRow.font = { name: 'Calibri', family: 4, size: 16, underline: 'single', bold: true }
    titleRow.alignment = { horizontal: 'center' }
    worksheet.mergeCells(1, 1, 2, columns.length);
    worksheet.addRow([]);

    let headerRows = [];
    for (var i: number = 0; i < this.headerData.length; i++) {
      headerRows[i] = [];
      let j = 0;
      for (const key in this.headerData[0]) {
        headerRows[i][j] = this.headerData[i][key];
        j++;
      }
    }

    headerRows.forEach(d => {
      let row = worksheet.addRow(d);
    });

    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row

    let headerRow = worksheet.addRow(columns);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        cell.font = { bold: true }
    })
    worksheet.columns.forEach(col => {
      col.width = 20;
    }

    )
    let rows = [];
    for (var i: number = 0; i < this.dataSource.filteredData.length; i++) {
      rows[i] = [];
      let j = 0;
      for (const key in this.tableData[0]) {
        rows[i][j] = this.dataSource.filteredData[i][key];
        j++;
      }
    }
    rows.forEach(d => {
      let row = worksheet.addRow(d);
    });
    worksheet.addRow([]);
    //Adding fooer Rows
    let footerRows = [];
    for (var i: number = 0; i < this.footerData.length; i++) {
      footerRows[i] = [];
      let j = 0;
      for (const key in this.footerData[0]) {
        footerRows[i][j] = this.footerData[i][key];
        j++;
      }
    }

    footerRows.forEach(d => {
      let row = worksheet.addRow(d);
    });
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.routeParam + 'Report.xlsx');
    });
  }

  exportToPdf() {

  const buildColumns = () => Object.keys(this.tableData[0] || {});

  const buildRows = () =>
    this.dataSource.filteredData.map((row: any) =>
      Object.keys(this.tableData[0] || {}).map(key => row[key])
    );

  const buildHeaderRows = () => {
    let headerRows: any[] = this.tableHeaders.map((row: any) =>
      Object.keys(this.tableHeaders[0] || {}).map(key => row[key])
    );

    return headerRows
      .map((row, i) =>
        (i % 2 === 0 && headerRows[i + 1])
          ? row.concat(headerRows[i + 1])
          : null
      )
      .filter(r => r);
  };

  const buildFooterRows = () => {
    return this.footerData
      .map((row: any) =>
        Object.keys(this.footerData[0] || {})
          .map(key => row[key])
          .filter(val => val !== "")
      )
      .filter((row: any[]) => row.length);
  };

  const addCommonHeader = (doc: any, title: string) => {
    autoTable(doc, {
      body: [[{
        content: `THE KRISHNA DISTRICT LORRY OWNERS MUTUALLY AIDED CO-OPERATIVE STORES LIMITED\n\n${title}`,
        colSpan: 20,
        styles: { halign: 'center', fontStyle: 'bold', fontSize: 14 }
      }]],
      theme: 'plain'
    });
  };

  const addPageNumbers = (doc: any, title: string) => {
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);

      doc.text(title, 10, doc.internal.pageSize.height - 10);

      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 10,
        doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }
  };

  // ---------------- MAIN ----------------

  let columns = buildColumns();
  let rows = buildRows();
  let headerRows = buildHeaderRows();
  let footerRows = buildFooterRows();

  // 🔥 SMART ORIENTATION
  const isLandscape = columns.length > 5;

  const isLargeFormat =
    this.routeParam === 'Product Wise Monthly Purchase' ||
    this.routeParam === 'BranchWise Monthly SalesByLiters' ||
    this.routeParam === 'ProductMonthWise PurchaseLtrs';

  let doc: any = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: isLargeFormat ? 'a3' : 'a4'
  });

  // Title
  let name = '';

  if (this.routeParam === 'Shift') {
    const obj = this.Reports.find((rr: any) => rr.id === this.dateForm.value.selectedReport);
    name = obj?.reportName || this.routeParam;
  }
  else if (this.routeParam === 'Four Column Cash Book') {
    const obj = this.FourColumnReportType.find((rr: any) => rr.id === this.dateForm.value.selectedFourColumnReportType);
    name = obj?.reportName || this.routeParam;
  }
  else {
    name = this.routeParam;
  }

  addCommonHeader(doc, name);

  // Header section
  autoTable(doc, {
    margin: { top: 20 },
    body: headerRows,
    theme: 'plain'
  });

  // 🔥 CALCULATE WIDTH FIT
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20; // 10 left + 10 right
  const usableWidth = pageWidth - margin;
  const colWidth = usableWidth / columns.length;

  // 🔥 DYNAMIC COLUMN STYLES
  const columnStyles: any = {};
  columns.forEach((_: any, i: number) => {
    columnStyles[i] = { cellWidth: colWidth };
  });

  // 🔥 MAIN TABLE (FULL FIX)
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: (doc as any).lastAutoTable.finalY + 10,
    theme: 'grid',

    styles: {
      fontSize: columns.length > 8 ? 6 : 8,   // adaptive font
      cellPadding: 2,
      overflow: 'linebreak',
      halign: 'center'
    },

    headStyles: {
      fillColor: [220, 220, 220],
      textColor: 0,
      halign: 'center'
    },

    tableWidth: usableWidth,
    columnStyles: columnStyles
  });

  // Separator line
  doc.setLineWidth(0.2);
  doc.line(
    10,
    (doc as any).lastAutoTable.finalY + 5,
    doc.internal.pageSize.width - 10,
    (doc as any).lastAutoTable.finalY + 5
  );

  // Footer table
  if (footerRows.length) {
    autoTable(doc, {
      body: footerRows,
      theme: 'plain',
      startY: (doc as any).lastAutoTable.finalY + 10
    });
  }

  // Page footer
  addPageNumbers(doc, name);

  doc.save(name + '.pdf');
}

  openDialog(val, row?) {
    if (this.routeParam == 'Shift') {
      this.dateForm.patchValue({
        formDate: this.commonService.formatReportDate(this.dateForm.get('formDate').value),
        toDate: this.commonService.formatReportDate(this.dateForm.get('toDate').value),
        selectedReport: this.dateForm.get('selectedReport').value,
        selectedAccountLedger: this.dateForm.get('selectedAccountLedger').value
      })
      if (this.dateForm.value.selectedReport == "") {
        alert("Please select a shift report type");
        return false;
      }
      else {
        if (this.dateForm.value.fromDate == "") {
          alert("Please select From Date");
          return false;
        }
        else {
          if (this.dateForm.value.toDate == "") {
            alert("Please select To Date");
            return false;
          }
          else {
            let data;
            if (row != null) {
              data = { action: val, item: row };
              this.highlightedRows = [row];
            } else {
              data = { action: val, item: this.highlightedRows[0] };
            }
            if (data.action === 'Edit' && this.highlightedRows.length) {
              this.params = new HttpParams();
              //params = params.append('UserID',this.user.userName);
              this.params = this.params.append('fromDate', this.dateForm.value.formDate);
              this.params = this.params.append('toDate', this.dateForm.value.toDate);
              this.params = this.params.append('reportID', this.dateForm.value.selectedReport);
              this.params = this.params.append('ledgerCode', this.dateForm.value.selectedAccountLedger);
              this.params = this.params.append('shiftId', data.item.ShiftID)

              let tableUrl = this.reportsService.getRouteUrls('InnerShift');
              const getUrl = [tableUrl.url].join('/');
              this.apiService.apiReportGetRequest(getUrl, this.params)
                .subscribe(
                  response => {
                    let innerReportName = this.Reports[this.dateForm.get('selectedReport').value - 2].reportName;
                    const res = response;
                    if (res != null && res.status === StatusCodes.pass) {
                      if (res.response != null) {
                        const dialogRef = this.dialog.open(ReportsInnerTableComponent, {
                          width: '1024px',
                          height: '500px',
                          data: { gridData: res.response[tableUrl.listName], reportName: innerReportName, headerData: this.headerData, footerData: this.footerData },
                          panelClass: 'custom-dialog-container',
                          disableClose: true
                        });
                      }
                    }
                  }, error => {

                  });
              this.spinner.hide();
            }
          }
        }
      }
    }
  }
  highlightRows(row, i) {
    if (this.highlightedRows.length) {
      if (this.index === i) {
        this.highlightedRows = [];
        this.index = null;
      } else {
        this.highlightedRows = [];
        this.highlightedRows.push(row);
        this.index = i;
      }
    } else {
      this.highlightedRows = [];
      this.highlightedRows.push(row);
      this.index = i;
    }
  }

  ngOnChanges() {
    this.columnDefinitions = [];
    this.keys = [];

    if (this.tableData != null) {
      if (this.tableData.length > 0) {
        this.dataSource = new MatTableDataSource(this.tableData);
      }
    }

    if (this.dataSource != null) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if ((this.tableData != null) && this.tableData.length > 0) {

      // tslint:disable-next-line:forin
      for (const key in this.tableData[0]) {
        this.keys.push({ col: key });
      }

      this.keys.forEach(cols => {
        const obj = {
          def: cols.col, label: cols.col, hide: true
        };
        this.columnDefinitions.push(obj);
      });
    }

    console.log(this.columnDefinitions);


    this.generateTableHeaders();

  }
  ngAfterViewInit() {
    // this.multiSelect.open();
    this.cdr.detectChanges();
  }
  ngOnInit() {
    this.allApis();
  }

  generateTableHeaders() {
    this.tableHeaders = [];
    if (this.headerData && this.headerData.length) {
      this.headerData.forEach((header) => {
        for (let key in header) {
          if (header[key] != "") {
            this.tableHeaders.push({ 'column': header[key] })
          }
        }
      })
    }
  }

  ngOnDestroy() {
    this.tableData = [];
    this.tableHeaders = [];
  }

}
