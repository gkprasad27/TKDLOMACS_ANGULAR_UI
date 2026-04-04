import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { ApiConfigService } from '../../../../services/api-config.service';

import { ApiService } from '../../../../services/api.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';
import { UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrintComponent } from '../../../../reuse-components/print/print.component';
import { PrintPetrolComponent } from '../../../../reuse-components/printPetrol/printPetrol.component';
import { SaveItemComponent } from '../../../../reuse-components/save-item/save-item.component';
var curValue = require("multilingual-number-to-words");
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { HostListener } from '@angular/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../directives/format-datepicker';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class SalesInvoiceComponent implements OnInit {

  branchFormData: FormGroup;

  branchesBillingList: any[] = [];
  branchesList: any[] = [];
  getStateListArray: any[] = [];
  disableSlipList: any[] = [];
  disablePump: any[] = [];
  itemsLength: any[] = [];
  getCashPartyAccountListArray: any[] = [];

  routeUrl = '';


  myControl = new FormControl();
  getmemberNamesArray: any[] = [];
  getProductByProductCodeArray: any[] = [];
  getProductByProductNameArray: any[] = [];
  getVechielsArray: any[] = [];
  getPumpsArray: any[] = [];
  getSalesBranchListArray: any[] = [];
  memberNamesList: any[] = [];
  displayedColumns: string[] = ['SlNo', 'productCode', 'productName', 'hsnNo', 'pumpNo', 'qty', 'fQty',
    'slipNo', 'unitName', 'discount', 'taxGroupName', 'rate', 'grossAmount', 'availStock', 'delete'
  ];
  dataSource: MatTableDataSource<any>;
  isSaveDisabled = false;
  date = new Date((new Date().getTime() - 3888000000));
  modelFormData: UntypedFormGroup;
  tableFormData: UntypedFormGroup;
  printBill = false;
  taxPercentage: any;
  setFocus: any;
  tableLength = 6;
  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));
  GetPumpsListArray: any;
  pumpList = [];
  getCustomerGstNumListArray: any[];
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.formDataGroup();
  }


  formDataGroup() {
    this.branchFormData = this.formBuilder.group({
      branchCode: [null],
      branchName: [null],
      invoiceDate: [(new Date()).toISOString()],
      invoiceNo: [0, Validators.required],
      ledgerCode: ['100'],
      vehicleRegNo: [null],
      stateCode: [null],
      memberName: [null],
      customerGstin: [null],
      paymentMode: [null],
      mobile: [null],
      generalNo: [null],
      amountInWords: [null],
      totalAmount: [null],
      totaltaxAmount: [null],
      invoiceMasterId: [0],
      voucherNo: [null],
      voucherTypeId: [null],
      ledgerId: [null],
      ledgerName: [null],
      vehicleId: [null],
      memberCode: [null],
      customerName: [null],
      suppliedTo: [null],
      accountBalance: [null],
      shiftId: [null],
      userId: [null],
      userName: [null],
      employeeId: [null],
      discount: [0.00],
      grandTotal: [null],
      totalCgst: [null],
      totalSgst: [null],
      totalIgst: [null],
      otherAmount1: [null],
      otherAmount2: [null],
      roundOffPlus: [null],
      roundOffMinus: [null],
      serverDateTime: [null],
      isSalesReturned: [null],
      isManualEntry: [null],
      manualInvoiceNo: [null],
      isSalesReturnInvoice: [null]
    });

    const user = JSON.parse(localStorage.getItem('user'));

    if (user?.role != '1') {
      this.branchFormData.controls['invoiceDate'].disable();
    }
  }

  ngOnInit() {
    this.allApis();
    this.commonService.setFocus('ledgerCode');
  }
  allApis() {
    const getBranchesListUrl = this.apiConfigService.getBillingBranchesList;
    const getMasterBranchesListUrl = this.apiConfigService.getBranchesList;
    const getStateListUrl = this.apiConfigService.getStateList;
    const getSlipListUrl = '../../../../../../assets/settings/bill.json';
    const getPerchaseListUrl = '../../../../../../assets/settings/perchase.json';
    const getPerchaseBranchListUrl = '../../../../../../assets/settings/perchase-branch.json';

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getBranchesListUrl),
        this.apiService.apiGetRequest(getMasterBranchesListUrl),
        this.apiService.apiGetRequest(getStateListUrl),
        this.apiService.apiGetRequest(getSlipListUrl),
        this.apiService.apiGetRequest(getPerchaseListUrl),
        this.apiService.apiGetRequest(getPerchaseBranchListUrl)
      ]).subscribe(([branchesList, masterBranchesList, stateList, slipList, perchaseList, perchaseBranchList]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(branchesList) && branchesList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(branchesList.response)) {
            this.branchesBillingList = branchesList.response['BranchesList'];
            this.setBranchCode();
          }
        }

        if (!this.commonService.checkNullOrUndefined(masterBranchesList) && masterBranchesList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(masterBranchesList.response)) {
            this.branchesList = masterBranchesList.response['branchesList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(stateList) && stateList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(stateList.response)) {
            this.getStateListArray = stateList.response['StateList'];
            if (this.branchFormData.get('stateCode').value != null) {
              this.getSelectedState();
            }
          }
        }

        if (!this.commonService.checkNullOrUndefined(slipList)) {
          this.disableSlipList = slipList;
        }

        if (!this.commonService.checkNullOrUndefined(perchaseList)) {
          this.disablePump = perchaseList;
        }

        if (!this.commonService.checkNullOrUndefined(perchaseBranchList)) {
          this.itemsLength = perchaseBranchList;
        }


      });
    });

    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != 'New') {
        this.routeUrl = params.id1;
        if (params.value != null) {
          this.getInvoiceDeatilList(params.value);
        }
        this.disableForm(params.id1);
      } else {
        this.resetData();
      }
    });

  }

  resetData() {
    this.addTableRow();
    // this.getCashPartyAccountList("100");
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.branchCode != null) {
      this.branchFormData.patchValue({
        branchCode: +user.branchCode,
        userId: user.seqId,
        userName: user.userName
      });
      this.branchFormData.patchValue({
        stateCode: 37,
        stateName: 'ANDHRA PRADESH'
      });
      // this.getCashPartyAccount();
      this.setBranchCode();
      this.genarateBillNo(user.branchCode);
      this.formGroup();
      this.getCashPartyAccountList();
    }
    this.disableForm();
  }

  formGroup() {
    this.tableFormData = this.formBuilder.group({
      invoiceNo: [null],
      invoiceDate: [null],
      stateCode: [null],
      shiftId: [null],
      userId: [null],
      employeeId: [null],
      productId: [null],
      hsnNo: [null],
      productCode: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      rate: [null],
      productGroupId: [null],
      productGroupCode: [null],
      pumpID: [null],
      pumpNo: [null],
      qty: [null],
      fQty: [null],
      slipNo: [null],
      unitId: [null],
      unitName: [null],
      discount: [0.00],
      taxGroupId: [null],
      taxGroupCode: [null],
      taxGroupName: [null],
      taxStructureId: [null],
      taxStructureCode: [null],
      cgst: [null],
      sgst: [null],
      igst: [null],
      grossAmount: [null],
      totalGST: [null],
      availStock: [null],
    });
  }

  setBranchCode() {
    const bname = this.branchesBillingList.filter(branchCode => {
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

  getSelectedState() {
    const getSelectedStateUrl = [this.apiConfigService.getSelectedState, this.branchFormData.get('stateCode').value].join('/');
    this.apiService.apiGetRequest(getSelectedStateUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.StateList?.length > 0) {
              const taxP = res.response['StateList'][0];
              this.branchFormData.patchValue({
                stateCode: taxP.stateCode
              });
              if (taxP.igst == 0) {
                this.taxPercentage = true;
              } else {
                this.taxPercentage = false;
              }
              this.calculateAmount();
            }
          }
        }
      });
  }

  calculateAmount(row?, index?) {
    if (row != null) {
      if (row?.qty != null && row.qty !== '') {
        this.dataSource.data[index].grossAmount = (row.qty * row.rate).toFixed(2);
      } else if ((row.fQty != null) && (row.fQty != '')) {
        this.dataSource.data[index].grossAmount = (0 * row.rate).toFixed(2);
      }
    }
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    let totaltaxAmount = 0;
    let totalAmount = 0;
    for (let a = 0; a < this.dataSource.data.length; a++) {
      if (this.dataSource.data[a].grossAmount) {
        let tax = (this.taxPercentage) ? (this.dataSource.data[a].cgst + this.dataSource.data[a].sgst) : this.dataSource.data[a].igst;
        let amountTax = (+this.dataSource.data[a].grossAmount * 100) / (tax + 100);
        let totalTax = (+this.dataSource.data[a].grossAmount - amountTax);
        totalAmount = totalAmount + amountTax;
        totaltaxAmount = totaltaxAmount + totalTax;
      }
    }
    this.branchFormData.patchValue({
      totalAmount: totalAmount != null ? totalAmount.toFixed(2) : null,
      totaltaxAmount: totaltaxAmount != null ? totaltaxAmount.toFixed(2) : null,
    });
    this.branchFormData.patchValue({
      grandTotal: (totalAmount + totaltaxAmount).toFixed(2),
      totalCgst: (this.taxPercentage) ? (totaltaxAmount / 2).toFixed(2) : 0,
      totalSgst: (this.taxPercentage) ? (totaltaxAmount / 2).toFixed(2) : 0,
      totalIgst: (!this.taxPercentage) ? (totaltaxAmount).toFixed(2) : 0,
    });
    this.branchFormData.patchValue({
      amountInWords: curValue.lakhWord(this.branchFormData.get('grandTotal').value)[0],
    });
  }

  getCashPartyAccountList() {
    if (this.branchFormData.get('ledgerCode').value != null && this.branchFormData.get('ledgerCode').value !== '') {
      const getCashPartyAccountListUrl = [this.apiConfigService.getCashPartyAccountList, this.branchFormData.get('ledgerCode').value].join('/');
      this.apiService.apiGetRequest(getCashPartyAccountListUrl).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.CashPartyAccountList?.length > 0) {
                this.getCashPartyAccountListArray = res.response['CashPartyAccountList'];
                this.getCashPartyAccount();
              } else {
                this.getCashPartyAccountListArray = [];
              }
            }
          }
        });
    } else {
      this.getCashPartyAccountListArray = [];
    }
  }


  getCashPartyAccount() {
    const getCashPartyAccountUrl = [this.apiConfigService.getCashPartyAccount, this.branchFormData.get('ledgerCode').value].join('/');
    this.apiService.apiGetRequest(getCashPartyAccountUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.CashPartyAccount != null) {
              this.branchFormData.patchValue({
                ledgerName: res.response['CashPartyAccount']['ledgerName'],
                paymentMode: res.response['CashPartyAccount']['crOrDr'],
                ledgerId: res.response['CashPartyAccount']['ledgerId'],
                // mobile: res.response['CashPartyAccount']['mobile'],
                // customerGstin: res.response['CashPartyAccount']['tin']
              });
              this.getAccountBalance(res.response['CashPartyAccount']['accountGroupId']);
              this.spinner.hide();
            }
            if (this.branchFormData.get('ledgerCode').value != '100') {
              this.branchFormData.patchValue({
                mobile: res.response['CashPartyAccount']['mobile'],
                customerGstin: res.response['CashPartyAccount']['tin']
              });
            }
            if (this.branchFormData.get('ledgerCode').value != '2295') {
              this.branchFormData.patchValue({
                mobile: res.response['CashPartyAccount']['mobile'],
                customerGstin: res.response['CashPartyAccount']['tin']
              });
            }
            if (this.branchFormData.get('ledgerCode').value != '2403') {
              this.branchFormData.patchValue({
                mobile: res.response['CashPartyAccount']['mobile'],
                customerGstin: res.response['CashPartyAccount']['tin']
              });
            }
          }
        }
      });
  }

  getAccountBalance(accountGroupId) {
    const ledgerCode = this.branchFormData.get('ledgerCode')?.value;

    if (ledgerCode != null && ledgerCode !== '') {
      const getAccountBalanceUrl = [this.apiConfigService.getAccountBalance, this.branchFormData.get('ledgerCode').value].join('/');
      this.apiService.apiGetRequest(getAccountBalanceUrl).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.AccountBalance != null) {
                this.branchFormData.patchValue({
                  accountBalance: res.response['AccountBalance']
                });
                if (accountGroupId === 7576 && res.response['AccountBalance'] <= 0) {
                  this.isSaveDisabled = true;
                  this.alertService.openSnackBar(`Advance Party Account Balance Should not Be Less Than or Equal To Zero(${accountGroupId}) code`, Static.Close, SnackBar.error);
                } else {
                  this.isSaveDisabled = false;
                }
              }
            }
          }
        });
    }
  }

  getInvoiceDeatilList(id) {
    const getInvoiceDeatilListUrl = [this.apiConfigService.getInvoiceDeatilList, id].join('/');
    this.apiService.apiGetRequest(getInvoiceDeatilListUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.InvoiceDetailList?.length > 0) {
            this.dataSource = new MatTableDataSource(res.response['InvoiceDetailList']);
          }
          if (res?.response?.invoiceMasterData != null) {
            this.branchFormData.patchValue(res.response['invoiceMasterData']);
          }
          if (this.routeUrl == 'return') {
            this.generateSalesReturnInvNo();
          }
        }
      });
  }

  generateSalesReturnInvNo() {
    const generateSalesReturnInvNoUrl = [this.apiConfigService.generateSalesReturnInvNo, this.branchFormData.get('branchCode').value].join('/');
    this.apiService.apiGetRequest(generateSalesReturnInvNoUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.SalesReturnInvNo != null) {
              this.branchFormData.patchValue({
                isSalesReturnInvoice: res.response['SalesReturnInvNo']
              });
            }
          }
        }
      });
  }

  disableForm(route?) {
    if (route != null) {
      this.branchFormData.controls['ledgerCode'].disable();
      this.branchFormData.controls['branchCode'].disable();
      this.branchFormData.controls['invoiceDate'].disable();
      this.branchFormData.controls['vehicleRegNo'].disable();
      this.branchFormData.controls['stateCode'].disable();
      this.branchFormData.controls['paymentMode'].disable();
      this.branchFormData.controls['memberName'].disable();
      this.branchFormData.controls['customerGstin'].disable();
      this.branchFormData.controls['generalNo'].disable();
      this.branchFormData.controls['suppliedTo'].disable();
      this.branchFormData.controls['customerName'].disable();
      this.branchFormData.controls['mobile'].disable();
    }

    this.branchFormData.controls['invoiceNo'].disable();
    this.branchFormData.controls['accountBalance'].disable();
    this.branchFormData.controls['totalAmount'].disable();
    this.branchFormData.controls['ledgerName'].disable();
    this.branchFormData.controls['grandTotal'].disable();
    this.branchFormData.controls['totaltaxAmount'].disable();
    this.branchFormData.controls['paymentMode'].disable();
    this.branchFormData.controls['totalCgst'].disable();
    this.branchFormData.controls['totalSgst'].disable();
    this.branchFormData.controls['totalIgst'].disable();
    this.branchFormData.controls['amountInWords'].disable();
    this.branchFormData.controls['userName'].disable();
  }

  addTableRow() {
    const tableObj = {
      productCode: '', productName: '', hsnNo: '', pumpNo: '', qty: '', fQty: '', slipNo: '', unitName: '',
      discount: 0.00, taxGroupName: '', rate: '', grossAmount: '', availStock: '', delete: '', text: 'obj'
    };
    if (this.dataSource != null) {
      this.dataSource.data.push(tableObj);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    } else {
      this.dataSource = new MatTableDataSource([tableObj]);
    }
    this.commonService.setFocus(this.setFocus);
  }

  genarateBillNo(branch?) {
    let flag = false;
    const branchList = JSON.parse(localStorage.getItem('branchList'));
    for (let b = 0; b < branchList.length; b++) {
      if (this.branchFormData.get('branchCode').value == branchList[b]) {
        flag = true;
      }
    }
    if (!flag) {
      this.alertService.openSnackBar(`You are not eligible to use this Branch(${this.branchFormData.get('branchCode').value}) code`, Static.Close, SnackBar.error);
      this.branchFormData.patchValue({
        branchCode: null,
        branchName: null,
        invoiceNo: null
      });
    } else {
      this.setBranchCode();
      this.setBranchLength();
      let generateBillUrl;
      if (branch != null) {
        generateBillUrl = [this.apiConfigService.generateBillNo, branch].join('/');
      } else {
        generateBillUrl = [this.apiConfigService.generateBillNo, this.branchFormData.get('branchCode').value].join('/');
      }
      this.apiService.apiGetRequest(generateBillUrl).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.BillNo != null) {
                this.branchFormData.patchValue({
                  invoiceNo: res.response['BillNo']
                });
                // this.getAccountBalance();
              }
            }
          } else if (res.status === StatusCodes.fail) {
            this.branchFormData.patchValue({
              invoiceNo: null
            });
          }
        });
    }
  }

  setBranchLength() {
    let flag = true;
    for (let b = 0; b < this.itemsLength.length; b++) {
      if (this.branchFormData.get('branchCode').value == this.itemsLength[b]) {
        this.tableLength = 3;
        flag = false;
        break;
      }
    }
    if (flag) {
      this.tableLength = 6;
    }
  }

  disabledPump(code) {
    if (this.disablePump.length > 0) {
      for (let p = 0; p < this.disablePump.length; p++) {
        if (this.disablePump[p] == code) {
          return false;
        }
      }
      return true;
    }
    return true;
  }

  setLedgerName() {
    const lname = this.getCashPartyAccountListArray.filter(lCode => {
      if (lCode.id == this.branchFormData.get('ledgerCode').value) {
        return lCode;
      }
    });
    this.branchFormData.patchValue({
      ledgerName: lname?.[0] != null ? lname[0].text : null
    });
    this.getCashPartyAccount();
    this.commonService.setFocus('vehicleRegNo');
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F2') {
      this.commonService.setFocus('productCode0');
    }
  }

  getmemberNames(value) {
    if (value != null && value !== '') {
      const getmemberNamesUrl = [this.apiConfigService.getmemberNames, value].join('/');
      this.apiService.apiGetRequest(getmemberNamesUrl).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.Members?.length) {

                this.getmemberNamesArray = res.response['Members'];
              } else {
                this.getmemberNamesArray = [];
              }
            }
          }
        });
    } else {
      this.getmemberNamesArray = [];
    }
  }

  getVechiels(value) {
    this.branchFormData.patchValue({
      memberCode: null,
      memberName: null,
      // mobile: null,
      generalNo: null,
      vehicleId: null
    })
    if (value != null && value !== '') {
      const getVechielsUrl = [this.apiConfigService.getVechiels, value, this.branchFormData.get('memberCode').value].join('/');
      this.apiService.apiGetRequest(getVechielsUrl).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.Members?.length) {

                this.getVechielsArray = res.response['Members'];
              } else {
                this.getVechielsArray = [];
              }
            }
          }
        });
    } else {
      this.getVechielsArray = [];
    }
  }

  getCustomerGstNumList(value) {
    if (value != null && value !== '') {
      const getCashPartyAccountListUrl = [this.apiConfigService.getCustomerGstNumList, value].join('/');
      this.apiService.apiGetRequest(getCashPartyAccountListUrl).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.CustomerGstNum != null) {
                this.branchFormData.patchValue({
                  customerGstin: res.response['CustomerGstNum']['customerGstin'],
                });

              }
            }
          }
        });
    }
  }

  setMemberName(member) {
    this.branchFormData.patchValue({
      memberCode: member.item.id,
      mobile: member.item.phoneNo
    });
  }

  disableSlipVal(column) {
    let flag = true;
    for (let s = 0; s < this.disableSlipList.length; s++) {
      if (this.disableSlipList[s] == column) {
        flag = false;
        return false;
      }
    }
    if (flag) {
      return true;
    }
  }

  setBackGroundColor(value, disabled, prop) {
    console.log(value, disabled, prop);
    if (disabled) {
      return '';
    } else if (value == 0) {
      return '';
    }
    if ((this.disableSlipList) != null) {
      if (value == null && this.disableSlipList.length) {
        let flag = true;
        for (let s = 0; s < this.disableSlipList.length; s++) {
          if (this.disableSlipList[s] == prop) {
            flag = false;
          }
        }
        if (flag) {
          return '';
        } else {
          return 'flash-light';
        }
      } else {
        return '';
      }
    }
  }

  setToFormModel(text, column, value) {
    if (text == 'obj') {
      this.tableFormData.patchValue({
        [column]: value
      });
    }
    if (this.tableFormData.valid) {
      if (this.dataSource.data.length < this.tableLength) {
        if (this.dataSource.data[this.dataSource.data.length - 1].productCode != '') {
          this.addTableRow();
        }
        this.formGroup();
      }
    }
  }

  clearQty(index, value, column, row) {
    if (row.availStock < value) {
      this.alertService.openSnackBar(`This Product(${row.productCode}) qty or Fqty cannot be greater than available stock`, Static.Close, SnackBar.error);
      this.dataSource.data[index].qty = null;
      this.dataSource.data[index].fQty = null;
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

  getProductByProductCode(value) {
    if (value != null && value !== '') {
      const getProductByProductCodeUrl = this.apiConfigService.getProductByProductCode;
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { productCode: value }).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.Products != null) {
                this.getProductByProductCodeArray = res.response['Products'];
              }
            }
          }
        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }

  getmemberNamesByCode(event) {
    console.log(event);
    const getmemberNamesByCodeUrl = [this.apiConfigService.getmemberNamesByCode, event.item.memberCode].join('/');
    this.apiService.apiGetRequest(getmemberNamesByCodeUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.Members != null) {
              this.branchFormData.patchValue({
                memberCode: res.response['Members']['memberCode'],
                memberName: res.response['Members']['memberName'],
                mobile: res.response['Members']['phoneNo'],
                generalNo: res.response['Members']['generalNo'],
                vehicleId: event.item.id
              });
              //this.getAccountBalance();
            }
          }
        }
      });
  }


  getBillingDetailsRcd(productCode, index, id) {
    this.setFocus = id + index;
    this.commonService.setFocus(id + index);
    // if (this.checkProductCode(productCode, index)) {
    const branchCode = this.branchFormData.get('branchCode')?.value;
    const pCode = productCode?.value;

    if (branchCode != null && branchCode !== '' && pCode != null && pCode !== '') {

      const getBillingDetailsRcdUrl = this.apiConfigService.getBillingDetailsRcd;
      this.apiService.apiPostRequest(getBillingDetailsRcdUrl, { productCode: productCode.value, branchCode: this.branchFormData.get('branchCode').value }).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.BillingDetailsSection != null) {
                this.billingDetailsSection(res.response['BillingDetailsSection'], index);
                this.getProductByProductCodeArray = [];
              }
            }
          }
        });
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

  billingDetailsSection(obj, index) {
    if (obj?.availStock == null || obj.availStock === 0) {
      this.alertService.openSnackBar(`This Product(${obj.productCode}) available stock is 0`, Static.Close, SnackBar.error);
    }
    obj.text = 'obj';
    if(obj.qty == 0) {
      obj.qty = '';
    }
    this.dataSource.data[index] = obj;
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.tableFormData.patchValue({
      productCode: obj.productCode,
      productName: obj.productName
    });
    // this.dataSource.data = this.dataSource.data.map(val => {
    //   if (val.productCode == obj.productCode) {
    //     this.tableFormData.patchValue({
    //       productCode: obj.productCode,
    //       productName: obj.productName
    //     });
    //     val = obj;
    //   }
    //   val.text = 'obj';
    //   return val;
    // });
    // if (this.disableSlipValData(obj)) {
    this.setToFormModel(null, null, null);
    // }
    this.commonService.setFocus(this.setFocus);
  }

  getProductByProductName(value) {
    if (value != null && value !== '') {
      const getProductByProductNameUrl = this.apiConfigService.getProductByProductName;
      this.apiService.apiPostRequest(getProductByProductNameUrl, { productName: value }).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.Products != null) {
                this.getProductByProductNameArray = res.response['Products'];
              }
            }
          }
        });
    } else {
      this.getProductByProductNameArray = [];
    }
  }

  getPupms(pump, productCode) {
    const pNumber = +pump;
    if (!isNaN(pNumber)) {
      const branchCode = this.branchFormData.get('branchCode')?.value;

      if (branchCode != null && branchCode !== '' &&
        pump != null && pump !== '' &&
        productCode != null && productCode !== '') {
        const getPupmsUrl = [this.apiConfigService.getPupms, pump, this.branchFormData.get('branchCode').value, productCode].join('/');
        this.apiService.apiGetRequest(getPupmsUrl).subscribe(
          response => {
            const res = response;
            this.spinner.hide();
            if (res != null && res.status === StatusCodes.pass) {
              if (res.response != null) {
                if (res?.response?.PumpsList != null) {
                  this.getPumpsArray = res.response['PumpsList'];
                }
              }
            }
            if (this.getPumpsArray.length == 0) {
              this.alertService.openSnackBar('Select Valid PumpNo', Static.Close, SnackBar.error);
            }
          });
      } else {
        this.getPumpsArray = [];
      }
    } else {
      this.alertService.openSnackBar('Only Number', Static.Close, SnackBar.error);
    }
  }

  // getPumpsList(productCode) {
  //   const getPumpsListUrl = [this.apiConfigService.getPumps, this.branchFormData.get('branchCode').value, productCode].join('/');
  //   this.apiService.apiGetRequest(getPumpsListUrl).subscribe(
  //     response => {
  //       const res = response;
  //      this.spinner.hide();
  //       if (res != null && res.status === StatusCodes.pass) {
  //         if (res.response != null) {
  //           if (res?.response?.PumpsList != null && res.response['PumpsList'].length) {
  //             this.GetPumpsListArray = res.response['PumpsList'];
  //             this.setBranchCode();
  //           }
  //         }
  //       }
  //     });
  // }

  setProductName(name, column) {
    this.tableFormData.patchValue({
      productName: name.value
    });
    // if (this.disableSlipValData(column)) {
    this.setToFormModel(null, null, null);
    // }
  }

  print() {
    this.enableFileds();
    const requestObj = { InvoiceHdr: this.branchFormData.value, InvoiceDetail: this.dataSource.data, Branches: this.branchesList, BranchCode: this.branchFormData.get('branchCode').value };
    if (requestObj.InvoiceDetail || requestObj.InvoiceHdr)
      this.printBill = true;
    //if (this.printBill) {

    //  this.dialog.open(PrintComponent, {
    //    width: '1024px',
    //    data: requestObj,
    //    disableClose: true
    //  });
    //}
    if (this.printBill) {
      if (this.branchFormData.get('branchCode').value == 2 || (this.branchFormData.get('branchCode').value == 3) || (this.branchFormData.get('branchCode').value == 4) || (this.branchFormData.get('branchCode').value == 7)) {
        this.dialog.open(PrintPetrolComponent, {
          width: '1024px',
          data: requestObj,
          disableClose: true
        });
      }
      else {
        this.dialog.open(PrintComponent, {
          width: '1024px',
          data: requestObj,
          disableClose: true
        });
      }

    }
  }

  save() {
    if (this.routeUrl == 'return') {
      this.registerInvoiceReturn();
      return;
    }
    if (this.routeUrl != '' || this.dataSource.data.length == 0) {
      return;
    }
    let tableData = [];
    for (let d = 0; d < this.dataSource.data.length; d++) {
      if (this.dataSource.data[d]['productCode'] != '') {
        this.dataSource.data[d]['invoiceNo'] = this.branchFormData.get('invoiceNo').value;
        tableData.push(this.dataSource.data[d]);
      }
    }
    let content = '';
    let availStock = tableData.filter(stock => {
      if (stock.availStock == 0) {
        content = '0 Availablilty Stock';
        return stock;
      }
      if ((stock?.qty == null || stock?.qty <= 0) && (stock?.fQty == null || stock?.fQty <= 0)) {
        content = 'qty or Fqty is null/0';
        return stock;
      }
      if ((stock.qty > stock.availStock) || (stock.fQty > stock.availStock)) {
        content = 'qty or Fqty cannot be greater than available stock';
        return stock;
      }
      if (stock.productCode == 'D') {
        if ((stock.slipNo == null)) {
          content = 'SlipNo is null';
          return stock;
        }
      }
      if (stock.productCode == 'D' || stock.productCode == 'P' || stock.productCode == 'XP'|| stock.productCode == 'CNG'|| stock.productCode == 'XG'|| stock.productCode == 'X1') {
        if ((stock.pumpNo == null)) {
          content = 'PumpNo is null';
          return stock;
        }
      }
      if ((stock.pumpNo != null)) {
        if (this.getPumpsArray.length == 0) {
          content = 'PumpNo is not valid';
          return stock;
        }
      }

    });
    if (availStock.length) {
      this.alertService.openSnackBar(`This Product(${availStock[0].productCode}) ${content}`, Static.Close, SnackBar.error);
      return;
    }
    if(this.branchFormData.get('invoiceNo').value == null || this.branchFormData.get('invoiceNo').value == '' || this.branchFormData.get('invoiceNo').value == 0) {
      this.alertService.openSnackBar("Invoice No can't be empty", Static.Close, SnackBar.error);
      return;
    }
    // if(this.branchFormData.get('ledgerCode').value !== '100' && (+(this.branchFormData.get('accountBalance').value) < +(this.branchFormData.get('grandTotal').value))) {
    //   this.alertService.openSnackBar("Your Balance is low Please Add Balance", Static.Close, SnackBar.error);
    //   return;
    // }
    const allowedLedgerCodes = ['100', '2295', '2696', '2600', '2041', '2403'];

if (
  !allowedLedgerCodes.includes(this.branchFormData.get('ledgerCode').value) &&
  (+this.branchFormData.get('accountBalance').value < +this.branchFormData.get('grandTotal').value)
) {
  this.alertService.openSnackBar(
    "Your Balance is low Please Add Balance",
    Static.Close,
    SnackBar.error
  );
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
        this.registerInvoice(tableData);
        this.isSaveDisabled = true;
      }
    });
  }

  enableFileds() {
    this.branchFormData.controls['invoiceNo'].enable();
    this.branchFormData.controls['accountBalance'].enable();
    this.branchFormData.controls['totalAmount'].enable();
    this.branchFormData.controls['ledgerName'].enable();
    this.branchFormData.controls['grandTotal'].enable();
    this.branchFormData.controls['totaltaxAmount'].enable();
    this.branchFormData.controls['paymentMode'].enable();
    this.branchFormData.controls['totalCgst'].enable();
    this.branchFormData.controls['totalSgst'].enable();
    this.branchFormData.controls['totalIgst'].enable();
    this.branchFormData.controls['amountInWords'].enable();
    this.branchFormData.controls['userName'].enable();
  }

  enableEditFields() {
    this.branchFormData.controls['ledgerCode'].enable();
    this.branchFormData.controls['branchCode'].enable();
    this.branchFormData.controls['invoiceDate'].enable();
    this.branchFormData.controls['vehicleRegNo'].enable();
    this.branchFormData.controls['stateCode'].enable();
    this.branchFormData.controls['paymentMode'].enable();
    this.branchFormData.controls['memberName'].enable();
    this.branchFormData.controls['customerGstin'].enable();
    this.branchFormData.controls['generalNo'].enable();
    this.branchFormData.controls['suppliedTo'].enable();
    this.branchFormData.controls['customerName'].enable();
    this.branchFormData.controls['mobile'].enable();
  }

  reset() {
    this.branchFormData.reset();
    this.dataSource = new MatTableDataSource();
    this.getVechielsArray = [];
    this.formDataGroup();
    this.resetData();
  }

  registerInvoice(data) {
    this.branchFormData.patchValue({
      paymentMode: 0
    });
    let obj = { ...this.branchFormData.getRawValue() };
    obj.invoiceDate = this.commonService.formatDate(this.branchFormData.get('invoiceDate').value);
    obj.paymentMode = 0;
    data.map(val => val.qty = val.qty != null && val.qty != '' ? +val.qty : 0);
    const registerInvoiceUrl = this.apiConfigService.registerInvoice;
    const requestObj = { InvoiceHdr: obj, InvoiceDetail: data, Branches: this.branchesList, BranchCode: this.branchFormData.get('branchCode').value };
    this.apiService.apiPostRequest(registerInvoiceUrl, requestObj).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar('Billing Successfully..', Static.Close, SnackBar.success);
            if (this.printBill) {
              if (this.branchFormData.get('branchCode').value == 2 || (this.branchFormData.get('branchCode').value == 3) || (this.branchFormData.get('branchCode').value == 4) || (this.branchFormData.get('branchCode').value == 7)) {
                this.dialog.open(PrintPetrolComponent, {
                  width: '1024px',
                  data: requestObj,
                  disableClose: true
                });
              }
              else {
                this.dialog.open(PrintComponent, {
                  width: '1024px',
                  data: requestObj,
                  disableClose: true
                });
              }
            }
          }
          this.reset();
        }
      });
  }

  registerInvoiceReturn() {
    const registerInvoiceReturnUrl = [this.apiConfigService.registerInvoiceReturn, this.branchFormData.value.isSalesReturnInvoice, this.branchFormData.get('invoiceMasterId').value].join('/');
    this.apiService.apiGetRequest(registerInvoiceReturnUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar('Billing Return Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
        }
      });
  }

  check(event: KeyboardEvent) {
    // 31 and below are control keys, don't block them.
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

  back() {
    this.router.navigate(['/dashboard/transaction/salesInvoice']);
  }




  // disableSlipValData(column) {
  //   if (this.disableSlipVal(column.productCode)) {
  //     return true;
  //   } else if ((column.slipNo == null)) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }


}
