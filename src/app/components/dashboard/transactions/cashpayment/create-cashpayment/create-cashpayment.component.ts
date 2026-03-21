import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../../services/common.service';
import { ApiConfigService } from '../../../../../services/api-config.service';

import { ApiService } from '../../../../../services/api.service';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar, StatusCodes } from '../../../../../enums/common/common';
import { AlertService } from '../../../../../services/alert.service';
import { Static } from '../../../../../enums/common/static';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../directives/format-datepicker';
import { SaveItemComponent } from '../../../../../reuse-components/save-item/save-item.component';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@Component({ 
    selector: 'app-create-cashpayment',
    templateUrl: './create-cashpayment.component.html',
    styleUrls: ['./create-cashpayment.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, TextFieldModule, TypeaheadModule]
})
export class CreateCashpaymentComponent implements OnInit {

  branchFormData: UntypedFormGroup;
  GetBranchesListArray = [];
  myControl = new UntypedFormControl();
  filteredOptions: Observable<any[]>;
  getAccountLedgerListArray = [];
  getAccountLedgerListNameArray = [];
  getSalesBranchListArray = [];
  branchesList = [];
  getmemberNamesArray = [];

  displayedColumns: string[] = ['SlNo', 'toLedgerCode', 'toLedgerName', 'amount', 'delete'
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  date = new Date((new Date().getTime() - 3888000000));
  modelFormData: UntypedFormGroup;
  tableFormData: UntypedFormGroup;
  printBill: any;
  tableFormObj = false;
  routeUrl = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,

  ) {
    this.branchFormData = this.formBuilder.group({
      voucherNo: [null],
      cashPaymentDate: [(new Date()).toISOString()],
      branchCode: [null],
      branchName: [null],
      shiftId: [null],
      userId: [null],
      userName: [null],
      employeeId: [null],
      totalAmount: [null],
      narration: [null],
      //printBill: [false],
      cashPaymentMasterId: [null],
      branchId: [null],
      cashPaymentVchNo: [null],
      fromLedgerId: [null],
      fromLedgerCode: [null],
      fromLedgerName: [null],
      serverDate: [null]
    });

  }

  ngOnInit() {
    this.loadData();
    this.commonService.setFocus('toLedgerCode');
  }

  loadData() {
    this.getCashPaymentBranchesList();
    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != null) {
        this.routeUrl = params.id1;
        this.disableForm(params.id1);
        this.getCashPaymentDetailsList(params.id1);
        let billHeader = JSON.parse(localStorage.getItem('selectedBill'));
        this.branchFormData.setValue(billHeader);
      } else {
        this.disableForm();
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.branchCode != null) {
          this.branchFormData.patchValue({
            branchCode: user.branchCode,
            userId: user.seqId,
            userName: user.userName
          });
          this.setBranchCode();
          this.genarateVoucherNo(user.branchCode);
          this.formGroup();
          this.branchFormData.patchValue({
            cashPaymentDate: (new Date()).toISOString()
          });
        }
        this.addTableRow();
      }
    });
  }

  getCashPaymentDetailsList(id) {
    const getCashPaymentDetailsListUrl = [this.apiConfigService.getCashPaymentDetailsList, id].join('/');
    this.apiService.apiGetRequest(getCashPaymentDetailsListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.CashpaymentDetails?.length) {
            this.dataSource = new MatTableDataSource(res.response['CashpaymentDetails']);
            this.spinner.hide();
          }
        }
      });
  }

  disableForm(route?) {
    if (route != null) {
      this.branchFormData.controls['voucherNo'].disable();
      //this.branchFormData.controls['ledgerCode'].disable();
      this.branchFormData.controls['branchCode'].disable();
      this.branchFormData.controls['cashPaymentDate'].disable();
      this.branchFormData.controls['userName'].disable();
      this.branchFormData.controls['narration'].disable();
      this.branchFormData.controls['totalAmount'].disable();
    }

    //this.branchFormData.controls['voucherNo'].disable();
    // this.branchFormData.controls['totalAmount'].disable();
  }


  getCashPaymentBranchesList() {
    const getCashPaymentBranchesListUrl = [this.apiConfigService.getCashPaymentBranchesList].join('/');
    this.apiService.apiGetRequest(getCashPaymentBranchesListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.BranchesList?.length > 0) {
              this.GetBranchesListArray = res.response['BranchesList'];
              this.spinner.hide();
            }
          }
        }
      });
  }

  genarateVoucherNo(branch?) {
    let genarateVoucherNoUrl;
    if (branch != null) {
      genarateVoucherNoUrl = [this.apiConfigService.getCashPaymentVoucherNo, branch].join('/');
    } else {
      genarateVoucherNoUrl = [this.apiConfigService.getCashPaymentVoucherNo, this.branchFormData.get('branchCode').value].join('/');
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.BranchesList != null) {
              this.branchFormData.patchValue({
                voucherNo: res.response['BranchesList']
              });
              this.spinner.hide();
            }
          }
        }
      });
  }

  setBranchCode() {
    const bname = this.GetBranchesListArray.filter(branchCode => {
      if (branchCode.id == this.branchFormData.get('branchCode').value) {
        return branchCode;
      }
    });
    if (bname.length) {
      this.branchFormData.patchValue({
        branchName: bname?.[0] != null ? bname[0].text : null
      });
    }
  }
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.getmemberNamesArray.filter(option => option.text.toLowerCase().includes(filterValue));
  }

  addTableRow() {
    const tableObj = {
      toLedgerCode: '', toLedgerName: '', amount: '', delete: '', text: 'obj'
    };
    if (this.dataSource != null) {
      this.dataSource.data.push(tableObj);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    } else {
      this.dataSource = new MatTableDataSource([tableObj]);
    }
    this.dataSource.paginator = this.paginator;
  }

  formGroup() {
    this.tableFormData = this.formBuilder.group({
      voucherNo: [null],
      cashPaymentDate: [null],
      shiftId: [null],
      userId: [null],
      employeeId: [null],
      toLedgerCode: [null, [Validators.required]],
      toLedgerName: [null, [Validators.required]],
      amount: [null],
    });
  }

  setToFormModel(text, column, value) {
    this.tableFormObj = true;
    if (text == 'obj') {
      this.tableFormData.patchValue({
        [column]: value
      });
    }
    if (this.tableFormData.valid) {
      this.addTableRow();
      this.formGroup();
      this.tableFormObj = false;
    }
  }

  clearQty(index, value, column) {
    this.dataSource.data[index].qty = null;
    this.dataSource.data[index].fQty = null;
    this.dataSource.data[index][column] = value;
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
  }

  deleteRow(i) {
    this.dataSource.data = this.dataSource.data.filter((value, index, array) => {
      return index !== i;
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.calculateAmount();
  }

  getAccountByAccountCode(value) {
    if (value != null && value !== '') {
      const getAccountLedgerListUrl = [this.apiConfigService.getAccountLedgerList, value].join('/');
      this.apiService.apiGetRequest(getAccountLedgerListUrl).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.AccountLedgerList != null) {
                this.getAccountLedgerListArray = res.response['AccountLedgerList'];
                this.spinner.hide();
              }
            }
          }
        });
    } else {
      this.getAccountLedgerListArray = [];
    }
  }

  getAccountByAccountName(value) {
    if (value != null && value !== '') {
      const getAccountLedgerListUrl = [this.apiConfigService.getAccountLedgerListByName, value].join('/');
      this.apiService.apiGetRequest(getAccountLedgerListUrl).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.AccountLedgerList != null) {
                this.getAccountLedgerListArray = res.response['AccountLedgerList'];
                this.spinner.hide();
              }
            }
          }
        });
    } else {
      this.getAccountLedgerListArray = [];
    }
  }

  calculateAmount(row?, index?) {
    let amount = 0;
    for (let a = 0; a < this.dataSource.data.length; a++) {
      if (this.dataSource.data[a].amount) {
        amount = amount + this.dataSource.data[a].amount;
      }
    }
    this.branchFormData.patchValue({
      totalAmount: amount
    });

  }

  setAccountCode(value) {
    let flag = true;
    for (let t = 0; t < this.getAccountLedgerListArray.length; t++) {
      if (this.getAccountLedgerListArray[t]['text'] == value.value) {
        for (let d = 0; d < this.dataSource.data.length; d++) {
          if (this.dataSource.data[d]['toLedgerName'] == this.getAccountLedgerListArray[t]['text']) {
            this.dataSource.data[d]['toLedgerCode'] = this.getAccountLedgerListArray[t]['id'];
            this.tableFormData.patchValue({
              toLedgerCode: this.getAccountLedgerListArray[t].id,
              toLedgerName: this.getAccountLedgerListArray[t].text
            });
            flag = false;
            break;
          }
        }
      }
    }
    if (flag) {
      this.dataSource.data[this.dataSource.data.length - 1].toLedgerName = value.value;
      for (let t = 0; t < this.getAccountLedgerListArray.length; t++) {
        if (this.getAccountLedgerListArray[t]['text'] == value.value) {
          for (let d = 0; d < this.dataSource.data.length; d++) {
            if (this.dataSource.data[d]['toLedgerName'] == this.getAccountLedgerListArray[t]['text']) {
              this.dataSource.data[d]['toLedgerCode'] = this.getAccountLedgerListArray[t]['id'];
              this.tableFormData.patchValue({
                toLedgerCode: this.getAccountLedgerListArray[t].id,
                toLedgerName: this.getAccountLedgerListArray[t].text
              });
              break;
            }
          }
        }
      }
    }
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  setAccountName(value) {
    let flag = true;
    for (let t = 0; t < this.getAccountLedgerListArray.length; t++) {
      if (this.getAccountLedgerListArray[t]['id'] == value.value) {
        for (let d = 0; d < this.dataSource.data.length; d++) {
          if (this.dataSource.data[d]['toLedgerCode'] == this.getAccountLedgerListArray[t]['id']) {
            this.dataSource.data[d]['toLedgerName'] = this.getAccountLedgerListArray[t]['text'];
            this.tableFormData.patchValue({
              toLedgerCode: this.getAccountLedgerListArray[t].id,
              toLedgerName: this.getAccountLedgerListArray[t].text
            });
            flag = false;
          }
        }
      }
    }
    if (flag) {
      this.dataSource.data[this.dataSource.data.length - 1].toLedgerCode = value.value;
      for (let t = 0; t < this.getAccountLedgerListArray.length; t++) {
        if (this.getAccountLedgerListArray[t]['id'] == value.value) {
          for (let d = 0; d < this.dataSource.data.length; d++) {
            if (this.dataSource.data[d]['toLedgerCode'] == this.getAccountLedgerListArray[t]['id']) {
              this.dataSource.data[d]['toLedgerName'] = this.getAccountLedgerListArray[t]['text'];
              this.tableFormData.patchValue({
                toLedgerCode: this.getAccountLedgerListArray[t].id,
                toLedgerName: this.getAccountLedgerListArray[t].text
              });
            }
          }
        }
      }
    }
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource.data, this.tableFormData);
    //this.setToFormModel();

  }
  save() {
    if (this.routeUrl != '' || this.dataSource.data.length == 0) {
      return;
    }
    let tableData = [];
    for (let d = 0; d < this.dataSource.data.length; d++) {
      if (this.dataSource.data[d]['toLedgerCode'] != '') {
        tableData.push(this.dataSource.data[d]);
      }
    }
    let content = '';
    if (!tableData.length) {
      content = 'Account code is required'
      this.alertService.openSnackBar(`${content}`, Static.Close, SnackBar.error);
      return;
    }
    let accountLedger = tableData.filter(ledger => {
      if (ledger.amount == '') {
        content = "Amount shouldn't be Empty"
        return ledger
      }
    });
    if (accountLedger.length) {
      this.alertService.openSnackBar(`This Product(${accountLedger[0].toLedgerCode}) ${content}`, Static.Close, SnackBar.error);
      return;
    }
    let totalAmount = null;
    this.dataSource.data.forEach(element => {
      totalAmount = element.amount + totalAmount;
    });

    const dialogRef = this.dialog.open(SaveItemComponent, {
      width: '1024px',
      data: '',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // this.enableFileds();
        this.registerCashPayment(tableData);
      }
    });
    // this.registerCashPayment(tableData);
  }

  reset() {
    this.branchFormData.reset();
    this.dataSource = new MatTableDataSource();
    this.formGroup();
    this.loadData();
  }

  registerCashPayment(data) {
    this.branchFormData.patchValue({
      cashPaymentMasterId: 0,
      cashPaymentDate: this.commonService.formatDate(this.branchFormData.get('cashPaymentDate').value)
    });
    const registerCashPaymentUrl = [this.apiConfigService.registerCashPayment].join('/');
    const requestObj = { CashpaymentHdr: this.branchFormData.value, CashpaymentDetail: data };
    this.apiService.apiPostRequest(registerCashPaymentUrl, requestObj).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar('Cash Payment Created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }

}
