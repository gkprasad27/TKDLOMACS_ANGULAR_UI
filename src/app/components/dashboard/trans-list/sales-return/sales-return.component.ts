import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { ApiConfigService } from '../../../../services/api-config.service';

import { ApiService } from '../../../../services/api.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrintComponent } from '../../../../reuse-components/print/print.component';
var curValue = require("multilingual-number-to-words");
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../directives/format-datepicker';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class SalesReturnComponent implements OnInit {

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
  getmemberNamesArray = [];
  getProductByProductCodeArray = [];
  getProductByProductNameArray = [];
  getVechielsArray = [];
  getPupmsArray = [];
  getSalesBranchListArray = [];
  memberNamesList = [];
  displayedColumns: string[] = ['SlNo', 'productCode', 'productName', 'hsnNo', 'pumpNo', 'qty', 'fQty',
    'slipNo', 'unitName', 'discount', 'taxGroupName', 'rate', 'grossAmount', 'availStock', 'delete'
  ];
  dataSource: MatTableDataSource<any>;

  date = new Date((new Date().getTime() - 3888000000));
  modelFormData: FormGroup;
  tableFormData: FormGroup;
  printBill = false;
  taxPercentage: any;
  isSalesReturnInvoice: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {

    this.formDataGroup();
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  formDataGroup() {
    this.branchFormData = this.formBuilder.group({
      branchCode: [null],
      branchName: [null],
      invoiceDate: [(new Date()).toISOString()],
      invoiceNo: [0],
      invoiceMasterReturnId: [null],
      invoiceReturnNo: [null],
      invoiceReturnDate: [null],
      ledgerCode: [null],
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
      invoiceMasterId: [null],
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
      // isSalesReturned: [null],
      isManualEntry: [null],
      manualInvoiceNo: [null],
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
    // const getMasterBranchesListUrl = this.apiConfigService.getBranchesList;
    const getStateListUrl = this.apiConfigService.getStateList;
    const getSlipListUrl = '../../../../../../assets/settings/bill.json';
    const getPerchaseListUrl = '../../../../../../assets/settings/perchase.json';
    // const getPerchaseBranchListUrl = '../../../../../../assets/settings/perchase-branch.json';

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getBranchesListUrl),
        // this.apiService.apiGetRequest(getMasterBranchesListUrl),
        this.apiService.apiGetRequest(getStateListUrl),
        this.apiService.apiGetRequest(getSlipListUrl),
        this.apiService.apiGetRequest(getPerchaseListUrl),
        // this.apiService.apiGetRequest(getPerchaseBranchListUrl)
      ]).subscribe(([branchesList, stateList, slipList, perchaseList]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(branchesList) && branchesList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(branchesList.response)) {
            this.branchesBillingList = branchesList.response['BranchesList'];
            this.setBranchCode();
          }
        }

        // if (!this.commonService.checkNullOrUndefined(masterBranchesList) && masterBranchesList.status === StatusCodes.pass) {
        //   if (!this.commonService.checkNullOrUndefined(masterBranchesList.response)) {
        //     this.branchesList = masterBranchesList.response['branchesList'];
        //   }
        // }

        if (!this.commonService.checkNullOrUndefined(stateList) && stateList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(stateList.response)) {
            this.getStateListArray = stateList.response['StateList'];
            this.branchFormData.patchValue({
              stateCode: '37'
            });
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

        // if (!this.commonService.checkNullOrUndefined(perchaseBranchList)) {
        //   this.itemsLength = perchaseBranchList;
        // }

        this.getCashPartyAccountList("100", false);

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
        this.addTableRow();
        // this.getCashPartyAccountList("100");
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.branchCode != null) {
          this.branchFormData.patchValue({
            branchCode: +user.branchCode,
            userId: user.seqId,
            userName: user.userName,
            ledgerCode: "100"
          });
          this.branchFormData.patchValue({
            stateCode: '37',
            stateName: 'ANDHRA PRADESH'
          });
          // this.getCashPartyAccount();
          this.setBranchCode();
          this.genarateBillNo(user.branchCode);
          this.formGroup();
        }
        this.disableForm();
      }
    });

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
    const getSelectedStateUrl = [this.apiConfigService.getSelectedState,
    this.branchFormData.get('stateCode').value].join('/');
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
            }
          }
        }
      });
  }


  calculateAmount(row, index) {
    if (row?.qty != null && row.qty !== '') {
      this.dataSource.data[index].grossAmount = (row.qty * row.rate).toFixed(2);
    } else if ((row.fQty != null) && (row.fQty != '')) {
      this.dataSource.data[index].grossAmount = (0 * row.rate).toFixed(2);
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


  getCashPartyAccountList(value, flag = true) {
    if (value != null && value !== '') {
      const getCashPartyAccountListUrl = [this.apiConfigService.getCashPartyAccountList, value].join('/');
      this.apiService.apiGetRequest(getCashPartyAccountListUrl).subscribe(
        response => {
          const res = response;
            this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.CashPartyAccountList?.length > 0) {
                this.getCashPartyAccountListArray = res.response['CashPartyAccountList'];
                if (flag) {
                  this.getCashPartyAccount();
                }
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
    const getCashPartyAccountUrl = [this.apiConfigService.getCashPartyAccount,
    this.branchFormData.get('ledgerCode').value].join('/');
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
                ledgerId: res.response['CashPartyAccount']['ledgerId']
              });
              this.getAccountBalance();
            }
          }
        }
      });
  }


  getAccountBalance() {
    const ledgerCode = this.branchFormData.get('ledgerCode')?.value;
    if (ledgerCode != null && ledgerCode !== '') {
      const getAccountBalanceUrl = [this.apiConfigService.getAccountBalance,
      this.branchFormData.get('ledgerCode').value].join('/');
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
              }
            }
          }
        });
    }
  }

  getInvoiceDeatilList(id) {
    const getInvoiceDeatilListUrl = [this.apiConfigService.getInvoiceReturnDetail, id].join('/');
    this.apiService.apiGetRequest(getInvoiceDeatilListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.InvoiceReturnDtlsList?.length) {
            this.dataSource = new MatTableDataSource(res.response['InvoiceReturnDtlsList']);
          }
          if (res?.response?.invoiceMasterData != null) {
            this.branchFormData.patchValue(res.response['invoiceMasterData']);
          }
        }
      });
  }


  generateSalesReturnInvNo(branchCode, invoice) {
    const generateSalesReturnInvNoUrl = [this.apiConfigService.generateSalesReturnInvNo, branchCode].join('/');
    this.apiService.apiGetRequest(generateSalesReturnInvNoUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.SalesReturnInvNo != null) {
              this.isSalesReturnInvoice = res.response['SalesReturnInvNo'];
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


  disabledPump(code) {
    if (this.disablePump != null) {
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

  // disableSlipValData(column) {
  //   if (this.disableSlipVal(column.productCode)) {
  //     return true;
  //   } else if ((column.slipNo == null)) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }


  setBackGroundColor(value, disabled) {
    if (disabled) {
      return '';
    } else if (value == 0) {
      return '';
    } else if (value == '' || value == null) {
      return 'flash-light';
    } else {
      return '';
    }
  }


  setToFormModel(text, column, value) {
    if (text == 'obj') {
      this.tableFormData.patchValue({
        [column]: value
      });
    }
    if (this.tableFormData.valid) {
      if (this.dataSource.data.length < 6) {
        this.addTableRow();
        this.formGroup();
      }
    }
  }

  clearQty(index, value, column, row) {
    this.dataSource.data[index].qty = null;
    this.dataSource.data[index].fQty = null;
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
              this.getAccountBalance();
            }
          }
        }
      });
  }


  getBillingDetailsRcd(productCode, index) {
    // if (this.checkProductCode(productCode, index)) {
    const branchCode = this.branchFormData.get('branchCode')?.value;

    if (branchCode != null && branchCode !== '' &&
      productCode?.value != null && productCode.value !== '') {
      const getBillingDetailsRcdUrl = [this.apiConfigService.getBillingDetailsRcd, productCode.value,
      this.branchFormData.get('branchCode').value].join('/');
      this.apiService.apiGetRequest(getBillingDetailsRcdUrl).subscribe(
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
  }

  getProductByProductName(value) {
    if (value != null && value !== '') {
      const getProductByProductNameUrl = [this.apiConfigService.getProductByProductName, value].join('/');
      this.apiService.apiGetRequest(getProductByProductNameUrl).subscribe(
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

  getPupms(pump) {
    const pNumber = +pump;
    if (!isNaN(pNumber)) {
      const branchCode = this.branchFormData.get('branchCode')?.value;

      if (branchCode != null && branchCode !== '' &&
        pump != null && pump !== '') {
        const getPupmsUrl = [this.apiConfigService.getPupms, pump,
        this.branchFormData.get('branchCode').value].join('/');
        this.apiService.apiGetRequest(getPupmsUrl).subscribe(
          response => {
            const res = response;
              this.spinner.hide();
            if (res != null && res.status === StatusCodes.pass) {
              if (res.response != null) {
                if (res?.response?.PumpsList != null) {
                  this.getPupmsArray = res.response['PumpsList'];
                }
              }
            }
          });
      } else {
        this.getPupmsArray = [];
      }
    } else {
      this.alertService.openSnackBar('Only Number', Static.Close, SnackBar.error);
    }
  }

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
    const requestObj = { InvoiceHdr: this.branchFormData.value, InvoiceDetail: this.dataSource.data };
    if (this.printBill) {
      this.dialog.open(PrintComponent, {
        width: '1024px',
        data: requestObj,
        disableClose: true
      });
    }
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
    this.enableFileds();
    this.registerInvoice(tableData);
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

  reset() {
    this.branchFormData.reset();
    this.dataSource = new MatTableDataSource();
    this.formDataGroup();
  }

  registerInvoice(data) {
    this.branchFormData.patchValue({
      paymentMode: 0,
      invoiceDate: this.commonService.formatDate(this.branchFormData.get('invoiceDate').value)
    });
    const registerInvoiceUrl = this.apiConfigService.registerInvoice;
    const requestObj = { InvoiceHdr: this.branchFormData.value, InvoiceDetail: data };
    this.apiService.apiPostRequest(registerInvoiceUrl, requestObj).subscribe(
      response => {
        const res = response;
          this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar('Billing Successfully..', Static.Close, SnackBar.success);
            if (this.printBill) {
              this.dialog.open(PrintComponent, {
                width: '1024px',
                data: requestObj,
                disableClose: true
              });
            }
          }
          this.reset();
        }
      });
  }

  registerInvoiceReturn() {
    const registerInvoiceReturnUrl = [this.apiConfigService.registerInvoiceReturn, this.isSalesReturnInvoice, this.branchFormData.get('invoiceMasterId').value].join('/');
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


  back() {
    this.router.navigate(['/dashboard/transaction/salesReturn']);
  }

}
