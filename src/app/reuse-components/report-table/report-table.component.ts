
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
import html2pdf from 'html2pdf.js';
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
    { id: '5', reportName: 'Shift wise fleet card account' },
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

  // Properties for PDF export
  currentDate = new Date();

  // Column config for formatting
  private amountColumnPatterns = [
    'debit', 'credit', 'qty', 'amount', 'total', 'price', 'value',
    'opening', 'closing', 'received', 'issued', 'balance', 'liters', 'CreditTotal', 'DebitToal',
    'cashqty', 'creditqty', 'totalqty', 'cashamt', 'creditamt', 'totalamt', 'CashSales', 'CreditSales', 'GrandTotal', 'TotalDebits',
    'TotalCredits', 'TotalReceipts', 'TotalPayments', 'Receipts', 'Payments', 'Closing', 'Density', 'InvoiceSales', 'Mtr.Diff', 'Opening', 'TotalSales', 'Variation', 'Consumption', 'Testing',
    'OpeningQty', 'InwardQty', 'OutwardQty', 'ClosingQty', 'PQty', 'nPAmount', 'pAmount', 'TotalPurchase', 'NPTotalQty', 'Credit', 'BalanceDue', 'TotalQty',
    "PumpNo", 'GrossAmount', 'SlipNo', 'CNG', 'GrossAmount', 'Sales', 'BookStock', 'PhyStock', 'Excess', 'Short', 'StockTransfer',
    "TotalInvoiceSales", 'TotalTesting', 'TotalTotalSales', 'TotalVariation'
  ];


  /**
   * Simplified PDF export using html2pdf
   * Converts the static HTML template to PDF
   */
  columnConfig: any = {

    AccountLedger: {
      description: {
        width: '300px',
        whiteSpace: 'normal'
      },
    },

    ProductPriceList: {

      productCode: {
        width: '100px',
        whiteSpace: 'normal'
      },

      AvailableQty: {
        width: '100px',
        whiteSpace: 'normal'
      },

      Price: {
        width: '100px',
        whiteSpace: 'normal'
      }
    },

    '24HrsMeterReading': {

      Variation: {
        width: '55px',
        whiteSpace: 'normal'
      },

      Density: {
        width: '40px',
        whiteSpace: 'normal'
      },

      Pump: {
        width: '35px',
        whiteSpace: 'normal'
      },

      Testing: {
        width: '40px',
        whiteSpace: 'normal'
      }

    },

    StockVerification: {

    Name: {
      width: '200px',
      whiteSpace: 'normal'
    },

    ProductCode: {
      width: '90px',
      whiteSpace: 'normal'
    },

    },

    StockLedger: {
      branchName: {
        width: '120px',
        whiteSpace: 'normal'
      }
    },

    Salesanalysisbybranch: {
      ItemName: {
        width: '200px',
        whiteSpace: 'normal'
      }
    },

    DailySales: {
      LedgerName: {
        width: '170px',
        whiteSpace: 'normal'
      },
      PumpNo: {
        width: '35px',
        whiteSpace: 'normal'
      },

      Qty: {
        width: '35px',
        whiteSpace: 'normal'
      }

    },

    ReceiptsAndPaymentsDetailed: {
      'Account Description': {
        width: '350px',
        whiteSpace: 'normal'
      }
    },

    ReceiptsAndPaymentsSummary: {
      'ledgerName': {
        width: '350px',
        whiteSpace: 'normal'
      }
    },

    SMSSummary: {
        qty: {
        width: '50px',
        whiteSpace: 'normal'
      },
        price: {
        width: '50px',
        whiteSpace: 'normal'
      },
      invoiceNo: {
        width: '100px',
        whiteSpace: 'normal'
      }
    },

    VehicalEnquiry: {
      qty: {
        width: '35px',
        whiteSpace: 'normal'
      },
      pumpNo: {
        width: '35px',
        whiteSpace: 'normal'
      },

      productName: {
        width: '200px',
        whiteSpace: 'normal'
      },

      branchName: {
        width: '120px',
        whiteSpace: 'normal'
      },

      invoiceNo: {
        width: '80px',
        whiteSpace: 'normal'
      }
    },

    Shift: {
      LedgerName: {
        width: '250px',
        whiteSpace: 'normal'
      },

      Description: {
        width: '400px',
        whiteSpace: 'normal'
      }
    }

    // description: {
    //   width: '300px',
    //   whiteSpace: 'normal'
    // },

    // ProductName: {
    //   width: '300px',
    //   whiteSpace: 'normal'
    // },

    // LedgerName: {
    //   width: '200px',
    //   whiteSpace: 'normal'
    // },

    // ItemName: {
    //   width: '250px',
    //   whiteSpace: 'normal'
    // },

    // Name: {
    //   width: '250px',
    //   whiteSpace: 'normal'
    // },


    // PumpNo: {
    //   width: '50px',
    //   whiteSpace: 'normal'
    // },




    // "Mtr.Diff": {
    //   width: '50px',
    //   whiteSpace: 'normal'
    // },

    // Issued: {
    //   width: '40px',
    //   whiteSpace: 'normal'
    // },


    // Received: {
    //   width: '55px',
    //   whiteSpace: 'normal'
    // },

    // "Opening Quantity": {
    //   width: '60px',
    //   whiteSpace: 'normal'
    // },

    // "Closing Quantity": {
    //   width: '60px',
    //   whiteSpace: 'normal'
    // },

    // Date: {
    //   width: '80px',
    //   whiteSpace: 'normal'
    // },

  };

  private dateColumnPatterns = ['date', 'invoicedate', 'plandate', 'targetdate'];

  showPrintableReport = false;

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
    public runtimeConfigService: RuntimeConfigService
  ) {

    this.model();

    activatedRoute.params.subscribe(params => {
      this.routeParam = params.id;
      this.tableHeaders = [];
      this.headerData = [];
      this.footerData = [];
      this.defaultValues();
      this.dateForm.reset();
      setTimeout(() => {
        this.model();
      });
      // this.dateForm.reset();
    });


  }

  model() {
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


    if (this.user?.role != '1') {
      this.dateForm.controls['selectedBranch'].disable();
    }
  }

  selectionChange() {

    if (this.routeParam == 'Shift') {
      this.defaultValues();
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

      // Get ordered keys from config
      const columnOrder = Object.keys(
        this.getBody
      ).filter(key => key !== 'headers' && key !== 'footer');

      return this.columnDefinitions
        .filter(cd => cd.hide)
        .sort((a, b) => {
          return columnOrder.indexOf(a.def) - columnOrder.indexOf(b.def);
        })
        .map(cd => cd.def);

      // return this.columnDefinitions.filter(cd => cd.hide).map(cd => cd.def);
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

  get getHeaders() {
    if(this.routeParam == 'Shift') {
      return this.runtimeConfigService.tableColumnsData[this.routeParam][this.dateForm.get('selectedReport')?.value]?.headers;
    }
    return this.runtimeConfigService.tableColumnsData[this.routeParam].headers;
  }

  get getFooter() {
    if(this.routeParam == 'Shift') {
      return this.runtimeConfigService.tableColumnsData[this.routeParam][this.dateForm.get('selectedReport')?.value]?.footer;
    }
    return this.runtimeConfigService.tableColumnsData[this.routeParam].footer;
  }

  get getBody() {
    if(this.routeParam == 'Shift') {
      return this.runtimeConfigService.tableColumnsData[this.routeParam][this.dateForm.get('selectedReport')?.value];
    }
    return this.runtimeConfigService.tableColumnsData[this.routeParam];
  }

  get getShiftName() {
    if(this.routeParam == 'Shift') {
      return this.Reports.find(r => r.id == this.dateForm.get('selectedReport')?.value)?.reportName;
    }
    return null;
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
    this.params = this.params.append('UserID', this.user.userName);//this.user.userName);
    this.params = this.params.append('userName', this.user.userName);//this.user.userName);
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

    let columns: string[] = [];

    for (const key in this.tableData[0]) {
      columns.push(key);
    }

    // ================= WORKBOOK =================

    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet('Report', {
      pageSetup: {
        fitToPage: true,
        paperSize: 11,
        orientation: 'landscape'
      }
    });

    // ================= TITLE =================

    let titleRow = worksheet.addRow([
      this.routeParam + ' Report'
    ]);

    titleRow.font = {
      name: 'Calibri',
      family: 4,
      size: 16,
      underline: 'single',
      bold: true
    };

    titleRow.alignment = {
      horizontal: 'center'
    };

    worksheet.mergeCells(1, 1, 2, columns.length);

    worksheet.addRow([]);

    // ================= HEADER DATA =================

    const configHeaders = this.getHeaders;

    if (
      configHeaders &&
      this.headerData != null &&
      this.headerData.length
    ) {

      const headerKeys = Object.keys(configHeaders);

      // First object
      const headerObj = this.headerData[0];

      // 2 fields per row
      for (let i = 0; i < headerKeys.length; i += 2) {

        const leftKey = headerKeys[i];
        const rightKey = headerKeys[i + 1];

        // ================= DATA ROW =================

        let valueRowData =
          new Array(columns.length).fill('');

        // Left side
        if (leftKey) {

          const leftLabel = this.translate.instant(
            this.getTranslationKey(leftKey)
          );

          valueRowData[0] =
            `${leftLabel}: ${headerObj[leftKey] ?? ''}`;
        }

        // Right side -> LAST COLUMN
        if (rightKey) {

          const rightLabel = this.translate.instant(
            this.getTranslationKey(rightKey)
          );

          valueRowData[columns.length - 1] =
            `${rightLabel}: ${headerObj[rightKey] ?? ''}`;
        }

        let valueRow =
          worksheet.addRow(valueRowData);

        // ================= SPACE ROW =================

        worksheet.addRow([]);

        // ================= STYLING =================

        valueRow.eachCell((cell) => {

          cell.font = {
            bold: true
          };

          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D9EAD3' }
          };

          cell.alignment = {
            vertical: 'middle',
            horizontal: 'left'
          };
        });

        // Left alignment
        valueRow.getCell(1).alignment = {
          horizontal: 'left',
          vertical: 'middle'
        };

        // Right alignment
        valueRow.getCell(columns.length).alignment = {
          horizontal: 'right',
          vertical: 'middle'
        };
      }
    }

    // ================= TABLE HEADER =================

    let headerRow = worksheet.addRow(
      columns.map(col =>
        this.translate.instant(
          this.getTranslationKey(col)
        )
      )
    );

    headerRow.eachCell((cell) => {

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      cell.font = {
        bold: true
      };

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'BDD7EE' }
      };

      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
    });

    // ================= COLUMN WIDTH =================

    worksheet.columns.forEach(col => {
      col.width = 20;
    });

    // ================= TABLE DATA =================

    let rows: any[] = [];

    for (
      let i = 0;
      i < this.dataSource.filteredData.length;
      i++
    ) {

      rows[i] = [];

      let j = 0;

      for (const key in this.tableData[0]) {

        rows[i][j] =
          this.dataSource.filteredData[i][key];

        j++;
      }
    }

    rows.forEach(d => {
      worksheet.addRow(d);
    });

    worksheet.addRow([]);

    // ================= FOOTER DATA =================

    let footerRows: any[] = [];

    const configFooter = this.getFooter;

    if (
      configFooter &&
      this.footerData != null &&
      this.footerData.length
    ) {

      for (let i = 0; i < this.footerData.length; i++) {

        footerRows[i] = [];

        const colspanValue =
          configFooter['colspan'] || 0;

        // Empty cells
        for (let j = 0; j < colspanValue; j++) {
          footerRows[i].push('');
        }

        // Totals label
        if (colspanValue > 0) {
          footerRows[i].push('Totals');
        }

        // Footer values
        for (const key in configFooter) {

          if (key !== 'colspan') {

            footerRows[i].push(
              this.footerData[i][key]
            );
          }
        }
      }
    }

    // ================= FOOTER STYLE =================

    footerRows.forEach(d => {

      let row = worksheet.addRow(d);

      row.eachCell((cell) => {

        cell.font = {
          bold: true
        };

        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    if (this.routeParam === '24HrsSaleValue') {
      let newFooterRows: any[] = [];
      newFooterRows[0] = [];
      newFooterRows[1] = [];
      newFooterRows[2] = [];
      newFooterRows[3] = [];

      const colspanValue = 4;
      // Empty cells
      for (let j = 0; j < colspanValue; j++) {
        newFooterRows[0].push('');
      }
      // Totals label
      if (colspanValue > 0) {
        newFooterRows[0].push('Lubes Total:');
      }
      newFooterRows[0].push(this.footerData[0]['LubesTotal']);
      newFooterRows[0].push(this.footerData[0]['CreditAmountTotal']);
      newFooterRows[0].push(this.footerData[0]['LubesTotal2']);

      // Empty cells
      for (let j = 0; j < colspanValue; j++) {
        newFooterRows[1].push('');
      }
      // Totals label
      if (colspanValue > 0) {
        newFooterRows[1].push('Cash Rec:');
      }
      newFooterRows[1].push(this.footerData[0]['CashReceipt']);
      newFooterRows[1].push(this.footerData[0]['CashReceipt1']);
      newFooterRows[1].push(this.footerData[0]['CashReceipt2']);

      // Empty cells
      for (let j = 0; j < colspanValue; j++) {
        newFooterRows[2].push('');
      }
      // Totals label
      if (colspanValue > 0) {
        newFooterRows[2].push('CNG:');
      }
      newFooterRows[2].push(this.footerData[0]['CNG']);
      newFooterRows[2].push(this.footerData[0]['CNG1']);
      newFooterRows[2].push(this.footerData[0]['CNG2']);

      // Empty cells
      for (let j = 0; j < colspanValue; j++) {
        newFooterRows[3].push('');
      }
      // Totals label
      if (colspanValue > 0) {
        newFooterRows[3].push('Grand Total:');
      }
      newFooterRows[3].push(this.footerData[0]['GrandCashAmount']);
      newFooterRows[3].push(this.footerData[0]['GrandCreditAmount']);
      newFooterRows[3].push(this.footerData[0]['GrandTotalAmount']);
      newFooterRows.forEach(d => {

        let row = worksheet.addRow(d);

        row.eachCell((cell) => {

          cell.font = {
            bold: true
          };

          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });
    }

    if (this.routeParam === 'IntimateSale') {
      let newFooterRows: any[] = [];
      newFooterRows[0] = [];
      newFooterRows[1] = [];
      newFooterRows[2] = [];
      newFooterRows[3] = [];

      const colspanValue = 6;
      // Empty cells
      for (let j = 0; j < colspanValue; j++) {
        newFooterRows[0].push('');
      }
      // Totals label
      if (colspanValue > 0) {
        newFooterRows[0].push('Total:');
      }
      newFooterRows[0].push(this.footerData[0]['TotalQty']);
      newFooterRows[0].push(this.footerData[0]['NPTotalQty']);

      // Empty cells
      for (let j = 0; j < colspanValue; j++) {
        newFooterRows[1].push('');
      }
      // Totals label
      if (colspanValue > 0) {
        newFooterRows[1].push('Total Purchases:');
      }
      newFooterRows[1].push(this.footerData[0]['TotalPurchase1']);
      newFooterRows[1].push(this.footerData[0]['TotalPurchase']);

      // Empty cells
      for (let j = 0; j < colspanValue; j++) {
        newFooterRows[2].push('');
      }
      // Totals label
      if (colspanValue > 0) {
        newFooterRows[2].push('Credit:');
      }
      newFooterRows[2].push(this.footerData[0]['Credit1']);
      newFooterRows[2].push(this.footerData[0]['Credit']);

      // Empty cells
      for (let j = 0; j < colspanValue; j++) {
        newFooterRows[3].push('');
      }
      // Totals label
      if (colspanValue > 0) {
        newFooterRows[3].push('Balance/Due:');
      }
      newFooterRows[3].push(this.footerData[0]['BalanceDue1']);
      newFooterRows[3].push(this.footerData[0]['BalanceDue']);
      newFooterRows.forEach(d => {

        let row = worksheet.addRow(d);

        row.eachCell((cell) => {

          cell.font = {
            bold: true
          };

          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });
    }

    if (this.routeParam === 'DailySales') {

      let newFooterRows: any[] = [];
      newFooterRows[0] = [];
      newFooterRows[1] = [];

      // Totals label
      newFooterRows[0].push('');
      newFooterRows[0].push('Cash Amount:');
      newFooterRows[0].push(this.footerData[0]['CashAmount']);
      newFooterRows[0].push('');
      newFooterRows[0].push('Lubes-Cash:');
      newFooterRows[0].push(this.footerData[0]['Lubes-Cash']);
      newFooterRows[0].push('');
      newFooterRows[0].push('Credit:');
      newFooterRows[0].push(this.footerData[0]['Lubes-Credit']);

      // Totals label
      newFooterRows[1].push('');
      newFooterRows[1].push('Credit Amount:');
      newFooterRows[1].push(this.footerData[0]['Credit Amount']);
      newFooterRows[1].push('');
      newFooterRows[1].push('Spares-Cash:');
      newFooterRows[1].push(this.footerData[0]['Spares-Cash']);
      newFooterRows[1].push('');
      newFooterRows[1].push('Credit:');
      newFooterRows[1].push(this.footerData[0]['Spares-Credit']);

      newFooterRows.forEach(d => {

        let row = worksheet.addRow(d);

        row.eachCell((cell) => {

          cell.font = {
            bold: true
          };

          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });


    }


    // ================= EXPORT =================

    workbook.xlsx.writeBuffer().then((data) => {

      let blob = new Blob(
        [data],
        {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      );

      fs.saveAs(
        blob,
        this.routeParam + 'Report.xlsx'
      );
    });
  }


  // ===== HELPER METHODS FOR PDF EXPORT =====

  /**
   * Check if a column should be formatted as amount/number
   */
  isAmountColumn(columnName: string): boolean {
    const colName = columnName.toLowerCase();
    return this.amountColumnPatterns.some(pattern => colName.includes(pattern.toLowerCase()));
  }

  /**
   * Check if a column should be formatted as date
   */
  isDateColumn(columnName: string): boolean {
    const colName = columnName.toLowerCase();
    return this.dateColumnPatterns.some(pattern => colName.includes(pattern));
  }

  /**
   * Get column alignment based on type
   */
  getColumnAlignment(columnName: string): string {
    const colName = columnName.toLowerCase();
    if (this.isAmountColumn(colName)) {
      return 'right';
    } else if (this.isDateColumn(colName)) {
      return 'center';
    }
    return 'left';
  }

  /**
   * Format cell value based on column type
   */
  formatCellValue(value: any, columnName: string): any {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (this.isAmountColumn(columnName)) {
      const num = Number(value);
      if (!isNaN(num)) {
        return num.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
    }

    if (this.isDateColumn(columnName)) {
      try {
        // Check if value is a valid date
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
        }
      } catch (e) {
        console.error('Error formatting date:', e);
      }
      return value;
    }

    return value;
  }

  /**
   * Get keys from header object
   */
  getSortedHeaderKeys(): string[] {

    // Order from common config
    const orderedKeys = Object.keys(this.getHeaders);
    return orderedKeys;
    // Return only available keys in same order
    // return orderedKeys.filter(
    //   key => header[key] !== undefined &&
    //     header[key] !== null &&
    //     header[key] !== ''
    // );
  }

  /**
   * Get keys from footer object using runtime config
   */
  getSortedFooterKeys(): string[] {
    // Order from common config
    const orderedKeys = Object.keys(this.getFooter);
    return orderedKeys;
  }

  keepOrder = () => 0;

  /**
   * Get keys from footer object
   */
  getFooterKeys(footer: any): string[] {
    return Object.keys(footer).filter(key => footer[key] !== '');
  }



  getColumnStyle(column: string): any {

    console.log('Getting style for column:', column);

    let config = { width: '', whiteSpace: '' };
    if (column === 'sno') {
      config = {
        width: '30px',
        whiteSpace: 'nowrap',
      };
    } else {
      config = this.columnConfig[this.routeParam] ? this.columnConfig[this.routeParam][column] || {} : {};
    }

    return {

      width: config.width || 'auto',

      maxWidth: config.width || 'auto',

      whiteSpace: config.whiteSpace || 'nowrap',

      wordBreak:
        config.whiteSpace === 'normal'
          ? 'break-word'
          : 'normal'

    };

  }

  /**
   * Safe concatenation of routeParam and key for translation
   * Converts symbol/number types to strings to avoid TS2469 operator error
   */
  getTranslationKey(key: string | number | symbol): string {
    return `${this.routeParam}.${String(key)}`;
  }



  exportToPdf() {
    this.spinner.show();
    setTimeout(() => {
      this.showPrintableReport = true;

      setTimeout(() => {

        const element = document.getElementById('printableReport').innerHTML;

        if (!element) {

          this.alertService.openSnackBar(
            'No report data to export',
            Static.Close,
            SnackBar.error
          );

          return;

        }

        const options = {

          margin: [4, 4, 4, 4] as [number, number, number, number],

          filename: `${this.routeParam}_Report_${new Date().getTime()}.pdf`,

          image: {
            type: 'png' as const,
            quality: 1
          },

          html2canvas: {

            scale: 2,

            useCORS: true,

            scrollY: 0,

            backgroundColor: '#ffffff',

            logging: false

          },

          jsPDF: {

            orientation: 'portrait' as const,

            unit: 'mm' as const,

            format: 'a4' as const,

            compress: true

          },

          pagebreak: {
            mode: ['css', 'legacy']
          }

        };

        // html2pdf()
        //   .set(options)
        //   .from(element)
        //   .save()
        //   .then(() => {
        //     this.showPrintableReport = false;
        //     this.spinner.hide();

        //   })
        //   .catch(() => {

        //     this.showPrintableReport = false;
        //     this.spinner.hide();

        //   });


        var w = window.open('', '_blank');
        // var html = document.getElementById('invoicePrintData').innerHTML;
        w.document.body.innerHTML = element;
        this.showPrintableReport = false;
        this.spinner.hide();

        w.print();

      });
    }, 500);


  }
  // ===== END OF HELPER METHODS =====

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
        this.tableData = this.tableData.map((row, index) => {
          return { sno: index + 1, ...row };
        });
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
