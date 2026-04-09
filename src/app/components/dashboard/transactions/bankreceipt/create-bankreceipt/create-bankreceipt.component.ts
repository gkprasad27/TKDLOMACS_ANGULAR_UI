import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../../services/common.service';
import { ApiConfigService } from '../../../../../services/api-config.service';

import { ApiService } from '../../../../../services/api.service';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar, StatusCodes } from '../../../../../enums/common/common';
import { AlertService } from '../../../../../services/alert.service';
import { Static } from '../../../../../enums/common/static';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../directives/format-datepicker';
import { SaveItemComponent } from '../../../../../reuse-components/save-item/save-item.component';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-create-bankreceipt',
  templateUrl: './create-bankreceipt.component.html',
  styleUrls: ['./create-bankreceipt.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, TextFieldModule, TypeaheadModule]
})
export class CreateBankreceiptComponent implements OnInit {

  branchFormData: FormGroup;
  GetBranchesListArray = [];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  getAccountLedgerListArray = [];
  getAccountLedgerListNameArray = [];
  getSalesBranchListArray = [];
  branchesList = [];
  getmemberNamesArray = [];
  GetBPAccountLedgerListArray = [];
  GetBankPAccountLedgerListArray = [];

  displayedColumns: string[] = ['SlNo', 'toLedgerCode', 'toLedgerName', 'amount', 'delete'
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  date = new Date((new Date().getTime() - 3888000000));
  modelFormData: FormGroup;
  tableFormData: FormGroup;
  printBill: any;
  tableFormObj = false;
  routeUrl = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private router: Router,

    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,

  ) {
    this.branchFormData = this.formBuilder.group({
      voucherNo: [null, [Validators.required]],
      bankReceiptDate: [(new Date()).toISOString(), [Validators.required]],
      branchCode: [null, [Validators.required]],
      branchName: [null],
      shiftId: [null],
      userId: [null],
      userName: [null],
      employeeId: [null],
      totalAmount: [null],
      narration: [null],
      //printBill: [false],
      realized: [null],
      postingDate: [null, [Validators.required]],
      chequeNo: [null, [Validators.required]],
      bankLedgerCode: [null, [Validators.required]],
      bankLedgerId: [null],
      bankLedgerName: [null],
      serverDate: [null],
      bankReceiptMasterId: [0],
      branchId: [null],
      bankReceiptVchNo: [null]
    });

    const user = JSON.parse(localStorage.getItem('user'));

    if (user?.role != '1') {
      this.branchFormData.controls['branchCode'].disable();
    }

  }

  ngOnInit() {
    this.loadData();
    this.commonService.setFocus('bankLedgerName');
  }
  loadData() {
    this.getBankReceiptBranchesList();
    this.getBankRAccountLedgerList();
    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != null) {
        this.routeUrl = params.id1;
        this.disableForm(params.id1);
        this.getBankReceiptDetailsList(params.id1);
      } else {
        this.resetData();
      }
    });
  }

  resetData() {
    this.disableForm();
    this.addTableRow();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.branchCode != null) {
      this.branchFormData.patchValue({
        branchCode: +user.branchCode,
        branchId: +user.branchCode,
        userId: user.seqId,
        userName: user.userName,
        bankReceiptDate: (new Date()).toISOString(),
      });
      this.setBranchCode();
      this.genarateVoucherNo(user.branchCode);
      this.formGroup();
      this.branchFormData.patchValue({
        bankReceiptDate: (new Date()).toISOString()
      });
    }
  }

  getBankReceiptDetailsList(id) {
    const getBankReceiptDetailsListUrl = [this.apiConfigService.getBankReceiptDetailsList, id].join('/');
    this.apiService.apiGetRequest(getBankReceiptDetailsListUrl).subscribe(
      response => {
        const res = response;
            this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.BankReceiptDetails?.length) {
            this.dataSource = new MatTableDataSource(res.response['BankReceiptDetails']);
            this.dataSource.paginator = this.paginator;
          }
          if (res?.response?.bankReceiptData) {
            this.branchFormData.patchValue(res.response.bankReceiptData);
          }
        }
      });
  }

  disableForm(route?) {
    if (route != null) {
      this.branchFormData.controls['voucherNo'].disable();
      this.branchFormData.controls['postingDate'].disable();
      this.branchFormData.controls['branchCode'].disable();
      this.branchFormData.controls['bankReceiptDate'].disable();
      this.branchFormData.controls['totalAmount'].disable();
      this.branchFormData.controls['narration'].disable();
      this.branchFormData.controls['userName'].disable();
      this.branchFormData.controls['realized'].disable();
      this.branchFormData.controls['chequeNo'].disable();
      this.branchFormData.controls['bankLedgerCode'].disable();
    }

    // this.branchFormData.controls['voucherNo'].disable();
    // this.branchFormData.controls['totalAmount'].disable();
  }


  getBankReceiptBranchesList() {
    const getBankReceiptBranchesListUrl = [this.apiConfigService.getBankReceiptBranchesList].join('/');
    this.apiService.apiGetRequest(getBankReceiptBranchesListUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.BranchesList?.length > 0) {
              this.GetBranchesListArray = res.response['BranchesList'];
              if (this.branchFormData.get('branchCode').value != null) {
                this.setBranchCode();
              }
            }
          }
        }
      });
  }

  // getBRAccountLedgerList() {
  //   const getBRAccountLedgerListUrl = [this.apiConfigService.getBRAccountLedgerList].join('/');
  //   this.apiService.apiGetRequest(getBRAccountLedgerListUrl).subscribe(
  //     response => {
  //       const res = response;
  //       if (res != null && res.status === StatusCodes.pass) {
  //         if (res.response != null) {
  //           if (res?.response?.BranchesList?.length > 0) {
  //             this.GetBPAccountLedgerListArray = res.response['BranchesList'];
  //             this.spinner.hide();
  //           }
  //         }
  //       }
  //     });
  // }

  getBankRAccountLedgerList() {
    const getBankRAccountLedgerListUrl = [this.apiConfigService.getBankRAccountLedgerList].join('/');
    this.apiService.apiGetRequest(getBankRAccountLedgerListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.AccountLedgerList?.length > 0) {
              this.GetBankPAccountLedgerListArray = res.response['AccountLedgerList'];
              this.spinner.hide();
            }
          }
        }
      });
  }
  getBRAccountLedgerList(value) {
    if (value != null && value !== '') {
      const getBRAccountLedgerListUrl = [this.apiConfigService.getBRAccountLedgerList, value].join('/');
      this.apiService.apiGetRequest(getBRAccountLedgerListUrl).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.AccountLedgerList?.length > 0) {
                this.GetBPAccountLedgerListArray = res.response['AccountLedgerList'];
                //this.getCashPartyAccount();
              } else {
                this.GetBPAccountLedgerListArray = [];
              }
            }
            this.spinner.hide();
          }
        });
    } else {
      this.GetBPAccountLedgerListArray = [];
    }
  }

  setLedgerName(value) {
    const lname = this.GetBankPAccountLedgerListArray.filter(lCode => {
      if (lCode.id == this.branchFormData.get('bankLedgerCode').value) {
        return lCode;
      }
    });
    this.branchFormData.patchValue({
      bankLedgerName: lname?.[0] != null ? lname[0].text : null
    });
  }

  genarateVoucherNo(branch?) {
    let genarateVoucherNoUrl;
    if (branch != null) {
      genarateVoucherNoUrl = [this.apiConfigService.getBankReceiptVoucherNo, branch].join('/');
    } else {
      genarateVoucherNoUrl = [this.apiConfigService.getBankReceiptVoucherNo, this.branchFormData.get('branchCode').value].join('/');
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
    if (!this.GetBranchesListArray.length) {
      return;
    }
    const bname = this.GetBranchesListArray.filter(branchCode => {
      if (branchCode.id == this.branchFormData.get('branchCode').value) {
        return branchCode;
      }
    });
    if (bname.length) {
      this.branchFormData.patchValue({
        branchName: bname?.[0] != null ? bname[0].text : null,
        branchId: bname?.[0] != null ? bname[0].id : null
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
      const getAccountLedgerListUrl = [this.apiConfigService.getBPAccountLedgerList, value].join('/');
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
      const getAccountLedgerListUrl = [this.apiConfigService.getBRAccountLedgerListByName, value].join('/');
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

  setAccountName(value, index, id) {
    this.commonService.setFocus(id + index);
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
    // if (!this.tableFormObj) {
    //   this.dataSource.data.pop();
    //   console.log(this.dataSource.data);
    // }
    if (this.routeUrl != '' || this.branchFormData.invalid) {
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

    if (tableData.length == 0) {
      this.alertService.openSnackBar(`Product is not added`, Static.Close, SnackBar.error);
      return;
    }

    console.log(this.branchFormData, this.dataSource.data);
    const dialogRef = this.dialog.open(SaveItemComponent, {
      width: '1024px',
      data: '',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        // this.enableFileds();
        this.registerBankReceipt(tableData);
      }
    });
    // this.registerBankReceipt(tableData);
  }

  reset() {
    this.branchFormData.reset();
    this.dataSource = new MatTableDataSource();
    this.formGroup();
    this.resetData();
    this.commonService.setFocus('bankLedgerName');
  }

  registerBankReceipt(data) {
    var index = this.dataSource.data.indexOf(1);
    this.dataSource.data.splice(index, 1);
    const obj = this.branchFormData.getRawValue();
    obj.bankReceiptDate = this.commonService.formatDate(this.branchFormData.get('bankReceiptDate').value);
    obj.postingDate = this.commonService.formatDate(this.branchFormData.get('postingDate').value);
    obj.bankPaymentMasterId = 0;
    const registerBankReceiptUrl = [this.apiConfigService.registerBankReceipt].join('/');
    const requestObj = { BankreceiptHdr: obj, BankreceiptDetail: data };
    this.apiService.apiPostRequest(registerBankReceiptUrl, requestObj).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar('Bank Receipt Created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }


  back() {
    this.router.navigate(['dashboard/transactions/bankreceipt']);
  }

}
