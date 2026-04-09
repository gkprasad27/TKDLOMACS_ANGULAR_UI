import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { ApiConfigService } from '../../../../services/api-config.service';

import { ApiService } from '../../../../services/api.service';

import { MatTableDataSource } from '@angular/material/table';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
var curValue = require("multilingual-number-to-words");
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../directives/format-datepicker';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class PurchaseReturnComponent implements OnInit {

  branchFormData: FormGroup;
  getBranchesListArray = [];
  getCashPartyAccountListArray = [];
  myControl = new FormControl();
  getStateListArray = [];
  getProductByProductCodeArray = [];
  getProductByProductNameArray = [];
  getPupmsArray = [];
  getSalesBranchListArray = [];
  memberNamesList = [];
  branchesList = [];
  itemsLength = [];
  calculateLiters: any;
  displayedColumns: string[] = ['SlNo', 'productCode', 'productName', 'hsnNo', 'unitName', 'qty',
    'fQty', 'totalLiters', 'tankNo', 'rate', 'discount', 'grossAmount', 'delete'
  ];
  dataSource: MatTableDataSource<any>;

  date = new Date((new Date().getTime() - 3888000000));
  modelFormData: FormGroup;
  tableFormData: FormGroup;
  printBill = false;
  routeUrl = '';
  taxPercentage: any;
  tableLength = 6;
  isPurchaseReturnInvoice: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {

    this.formDataGroup();
  }

  formDataGroup() {
    this.branchFormData = this.formBuilder.group({
      purchaseReturnId: [null],
      purchaseReturnInvNo: [null],
      purchaseReturnInvDate: [null],
      purchaseMasterInvId: [null],
      branchCode: [null],
      branchName: [null],
      voucherNo: [null],
      voucherTypeId: [null],
      purchaseInvNo: [0],
      supplierInvNo: [null],
      purchaseInvDate: [(new Date()).toISOString()],
      serverDateTime: [null],
      ledgerId: [null],
      ledgerName: [null],
      ledgerCode: ['100'],
      paymentMode: [null],
      stateCode: [null],
      stateName: [null],
      gstin: [null],
      shiftId: [null],
      userId: [null],
      userName: [null],
      employeeId: [null],
      discount: [null],
      grandTotal: [null],
      totalCgst: [null],
      totalSgst: [null],
      totalIgst: [null],
      totaltaxAmount: [null],
      otherAmount1: [null],
      otherAmount2: [null],
      roundOffPlus: [null],
      roundOffMinus: [null],
      totalAmount: [null],
      amountInWords: [null],
      narration: [null]
    });
  }

  ngOnInit() {
    this.allApis();
  }


  allApis() {
    const getBranchesListUrl = this.apiConfigService.getBillingBranchesList;
    // const getMasterBranchesListUrl = this.apiConfigService.getBranchesList;
    const getStateListUrl = this.apiConfigService.getStateList;
    // const getSlipListUrl = '../../../../../../assets/settings/bill.json';
    const getPerchaseListUrl = '../../../../../../assets/settings/perchase.json';
    // const getPerchaseBranchListUrl = '../../../../../../assets/settings/perchase-branch.json';

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getBranchesListUrl),
        // this.apiService.apiGetRequest(getMasterBranchesListUrl),
        this.apiService.apiGetRequest(getStateListUrl),
        // this.apiService.apiGetRequest(getSlipListUrl),
        this.apiService.apiGetRequest(getPerchaseListUrl),
        // this.apiService.apiGetRequest(getPerchaseBranchListUrl)
      ]).subscribe(([branchesList, stateList, perchaseList]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(branchesList) && branchesList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(branchesList.response)) {
            this.getBranchesListArray = branchesList.response['BranchesList'];
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
            if (this.branchFormData.get('stateCode').value != null) {
              this.getSelectedState();
            }
          }
        }

        // if (!this.commonService.checkNullOrUndefined(slipList)) {
        //   this.disableSlipList = slipList;
        // }

        if (!this.commonService.checkNullOrUndefined(perchaseList)) {
          this.calculateLiters = perchaseList;
        }

        // if (!this.commonService.checkNullOrUndefined(perchaseBranchList)) {
        //   this.itemsLength = perchaseBranchList;
        // }


      });
    });

    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != 'New') {
        this.routeUrl = params.id1;
        this.disableForm(params.id1);
        this.getPurchaseReturnsDetails(params.value);
      } else {
        this.disableForm();
        this.addTableRow();
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
          this.setBranchCode();
          this.genarateBillNo(user.branchCode);
          this.formGroup();
          this.getCashPartyAccountList();
        }
      }
    });

  }


  formGroup() {
    this.tableFormData = this.formBuilder.group({
      purchaseInvDetailId: [null],
      purchaseInvId: [null],
      voucherNo: [null],
      purchaseNo: [null],
      purchaseDate: [null],
      stateCode: [null],
      serverDateTime: [null],
      shiftId: [null],
      userId: [null],
      employeeId: [null],
      productId: [null],
      productCode: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      hsnNo: [null],
      unitId: [null],
      unitName: [null],
      qty: [null],
      fQty: [null],
      barrel: [null],
      batchNo: [null],
      tankId: [null],
      tankNo: [null],
      totalLiters: [null],
      rate: [null],
      discount: [null],
      grossAmount: [null],
      taxGroupId: [null],
      taxGroupCode: [null],
      taxStructureId: [null],
      taxStructureCode: [null],
      cgst: [null],
      sgst: [null],
      igst: [null],
      totalGst: [null],
      totalAmount: [null],
    });
  }


  setBranchCode() {
    const bname = this.getBranchesListArray.filter(branchCode => {
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
    const getSelectedStateUrl = [this.apiConfigService.getSelectedState,  this.branchFormData.get('stateCode').value].join('/');
    this.apiService.apiGetRequest(getSelectedStateUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.StateList?.length > 0) {
              const taxP = res.response['StateList'][0];
              this.branchFormData.patchValue({
                stateCode: taxP.stateCode,
                StateName: taxP.stateName
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
    })
    this.branchFormData.patchValue({
      amountInWords: curValue.lakhWord(this.branchFormData.get('grandTotal').value)[0],
    });
  }


  getPurchaseReturnsDetails(id) {
    const getPurchaseReturnsDetailsUrl = [this.apiConfigService.getPurchaseReturnsDetails, id].join('/');
    this.apiService.apiGetRequest(getPurchaseReturnsDetailsUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.PurchaseReturnDetails?.length > 0) {
            this.dataSource = new MatTableDataSource(res.response['PurchaseReturnDetails']);
          }
          if (res?.response?.invoiceMasterData != null) {
            this.branchFormData.patchValue(res.response['invoiceMasterData']);
            this.branchFormData.patchValue({
              paymentMode: res.response['invoiceMasterData']['paymentMode'] == 1 ? 'Credit' : res.response['invoiceMasterData']['paymentMode'] == 2 ? 'Debit' : null
            });
          }
        }
      });
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
                ledgerId: res.response['CashPartyAccount']['ledgerId'],
                paymentMode: res.response['CashPartyAccount']['crOrDr'],
                gstin: res.response['CashPartyAccount']['tin']
              });
            }
          }
        }
      });
  }

  disableForm(route?) {
    if (route != null) {
      this.branchFormData.controls['branchCode'].disable();
      this.branchFormData.controls['purchaseInvDate'].disable();
      this.branchFormData.controls['ledgerCode'].disable();
      this.branchFormData.controls['purchaseInvDate'].disable();
      this.branchFormData.controls['stateCode'].disable();
      this.branchFormData.controls['supplierInvNo'].disable();
      this.branchFormData.controls['gstin'].disable();
      this.branchFormData.controls['narration'].disable();
    }
    this.branchFormData.controls['paymentMode'].disable();
    this.branchFormData.controls['purchaseInvNo'].disable();
    this.branchFormData.controls['totalAmount'].disable();
    this.branchFormData.controls['totaltaxAmount'].disable();
    this.branchFormData.controls['grandTotal'].disable();
    this.branchFormData.controls['totalCgst'].disable();
    this.branchFormData.controls['totalSgst'].disable();
    this.branchFormData.controls['totalIgst'].disable();
    this.branchFormData.controls['amountInWords'].disable();
    this.branchFormData.controls['userName'].disable();
    this.branchFormData.controls['ledgerName'].disable();
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

  setBranchLenght() {
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
        purchaseInvNo: null
      });
    } else {
      this.setBranchCode();
      this.setBranchLenght();
      let generateBillUrl;
      if (branch != null) {
        generateBillUrl = [this.apiConfigService.getPurchasePurchaseReturnInvNo, branch].join('/');
      } else {
        generateBillUrl = [this.apiConfigService.getPurchasePurchaseReturnInvNo, this.branchFormData.get('branchCode').value].join('/');
      }
      this.apiService.apiGetRequest(generateBillUrl).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.PurchaseInvoiceNo != null) {
                // this.branchFormData.patchValue({
                //   purchaseInvNo: res.response['PurchaseInvoiceNo']
                // });
                this.isPurchaseReturnInvoice = res.response['PurchaseInvoiceNo'];
              }
            }
          } else if (res.status === StatusCodes.fail) {
            this.branchFormData.patchValue({
              purchaseInvNo: null
            });
          }
        });
    }
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




  addTableRow() {
    const tableObj = {
      productCode: '', productName: '', hsnNo: '', unitName: '', qty: '', fQty: '', totalLiters: '', tankNo: '',
      rate: '', discount: 0.00, grossAmount: '', delete: '', text: 'obj'
    };
    if (this.dataSource != null) {
      this.dataSource.data.push(tableObj);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    } else {
      this.dataSource = new MatTableDataSource([tableObj]);
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

  setLiters(index, value, column, row) {
    for (let l = 0; l < this.calculateLiters.length; l++) {
      if (this.calculateLiters[l] == column) {
        this.dataSource.data[index]['totalLiters'] = value * 1000;
      }
    }
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
      const getProductByProductCodeUrl = [this.apiConfigService.getProductByProductCode, value].join('/');
      this.apiService.apiGetRequest(getProductByProductCodeUrl).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.products != null) {
                this.getProductByProductCodeArray = res.response['products'];
              }
            }
          }
        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }


  getProductDeatilsSectionRcd(productCode, index) {
    // if (this.checkProductCode(productCode, index)) {
    const branchCode = this.branchFormData.get('branchCode')?.value;
    const pCode = productCode?.value;

    if (branchCode != null && branchCode !== '' && pCode != null && pCode !== '') {

      const getProductDeatilsSectionRcdUrl = [this.apiConfigService.getProductDeatilsSectionRcd,
      this.branchFormData.get('branchCode').value, productCode.value].join('/');
      this.apiService.apiGetRequest(getProductDeatilsSectionRcdUrl).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if ((res.response['ProductDeatilsSectionRcd'] != null)) {
                this.billingDetailsSection(res.response['ProductDeatilsSectionRcd'], index);
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
  //   if ((code.value != null)) {
  //     for (let c = 0; c < this.dataSource.data.length; c++) {
  //       if ((this.dataSource.data[c].productCode == code.value) && c != index) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   }
  // }


  billingDetailsSection(obj, index) {
    if ((obj.availStock == null) || (obj.availStock == 0)) {
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
    //  
      // val.text = 'obj';
      // if(val.qty == 0) {
      //   val.qty = '';
      // }
      // return val;
    // });
    this.setToFormModel(null, null, null);
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
              if (res?.response?.products != null) {
                this.getProductByProductNameArray = res.response['products'];
              }
            }
          }
        });
    } else {
      this.getProductByProductNameArray = [];
    }
  }

  setProductName(name) {
    this.tableFormData.patchValue({
      productName: name.value
    });
    this.setToFormModel(null, null, null);
  }

  print() {

  }

  save() {
    // if (this.routeUrl != '' || this.dataSource.data.length == 0) {
    //   return;
    // }
    // let tableData = [];
    // for (let d = 0; d < this.dataSource.data.length; d++) {
    //   if (this.dataSource.data[d]['productCode'] != '') {
    //     tableData.push(this.dataSource.data[d]);
    //   }
    // }
    // let content = '';
    // let availStock = tableData.filter(stock => {
    //   if (stock.availStock == 0) {
    //     content = '0 Availablilty Stock';
    //     return stock;
    //   }
    //   if (stock?.qty == null && stock?.fQty == null) {
    //     content = 'qty or Fqty is null';
    //     return stock;
    //   }
    //   if ((stock.qty > stock.availStock) || (stock.fQty > stock.availStock)) {
    //     content = 'qty or Fqty cannot be greater than available stock';
    //     return stock;
    //   }
    // });
    // if (availStock.length) {
    //   this.alertService.openSnackBar(`This Product(${availStock[0].productCode}) ${content}`, Static.Close, SnackBar.error);
    //   return;
    // }
    this.enableFileds();
  }

  enableFileds() {
    this.branchFormData.controls['purchaseInvNo'].enable();
    this.branchFormData.controls['totalAmount'].enable();
    this.branchFormData.controls['totaltaxAmount'].enable();
    this.branchFormData.controls['grandTotal'].enable();
    this.branchFormData.controls['totalCgst'].enable();
    this.branchFormData.controls['totalSgst'].enable();
    this.branchFormData.controls['totalIgst'].enable();
    this.branchFormData.controls['paymentMode'].enable();
    this.branchFormData.controls['amountInWords'].enable();
    this.branchFormData.controls['userName'].enable();
    this.branchFormData.controls['ledgerName'].enable();
  }

  reset() {
    this.branchFormData.reset();
    this.dataSource = new MatTableDataSource();
    this.formDataGroup();
  }

  back() {
    this.router.navigate(['/dashboard/transaction/purchaseReturn']);
  }


}

