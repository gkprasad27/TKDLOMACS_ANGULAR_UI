import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../../services/common.service';
import { ApiConfigService } from '../../../../../services/api-config.service';

import { ApiService } from '../../../../../services/api.service';

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

@Component({
  selector: 'app-create-stockreceipt',
  templateUrl: './create-stockreceipt.component.html',
  styleUrls: ['./create-stockreceipt.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, TextFieldModule, TypeaheadModule]
})
export class CreateStockreceiptsComponent implements OnInit {

  branchFormData: FormGroup;
  GetBranchesListArray = [];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  getAccountLedgerListArray = [];
  getAccountLedgerListNameArray = [];
  getSalesBranchListArray = [];
  branchesList = [];
  getmemberNamesArray = [];

  displayedColumns: string[] = ['productCode', 'productName', 'hsnNo', 'unitName', 'qty', 'rate', 'grossAmount', 'availStock', 'batchNo', 'delete'
  ];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  date = new Date((new Date().getTime() - 3888000000));
  modelFormData: FormGroup;
  tableFormData: FormGroup;
  // printBill: any;
  issueno = null;
  totalamount = null;
  tableFormObj = false;
  routeUrl = '';
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];
  receiptNo: any;
  GettoBranchesListArray: any;
  toBranchCode: any;
  setFocus = '';
  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private router: Router,

    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.branchFormData = this.formBuilder.group({
      receiptNo: [null, [Validators.required]],
      receiptDate: [null, [Validators.required]],
      fromBranchCode: [null, [Validators.required]],
      fromBranchName: [null],
      toBranchCode: [null, [Validators.required]],
      toBranchName: [null],
      serverDateTime: [null],
      shiftId: [null],
      userId: 0,
      operatorStockReceiptId: 0,
      userName: [null],
      employeeId: [null],
      remarks: [null],
      //printBill: [false],

    });
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this.branchFormData.patchValue({
        userId: user.userId,
        userName: user.userName,
        shiftId: user.shiftId
      })
    }
  }
  ngOnInit() {
    this.loadData();
    this.commonService.setFocus('productCode');
  }

  loadData() {
    this.getBranchesList();
    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != null) {
        this.routeUrl = params.id1;
        //this.disableForm(params.id1);
        this.getStockreceiptDeatilList(params.id1);
        this.gettingtobranches();
      } else {
        this.resetData();
      }
    });
  }

  resetData() {
    const user = JSON.parse(localStorage.getItem('user'));
    //this.disableForm();
    if (user?.branchCode != null) {
      this.branchFormData.patchValue({
        fromBranchCode: +user.branchCode,
        userId: user.seqId,
        userName: user.userName,
        receiptDate: (new Date()).toISOString(),
        operatorStockReceiptId: 0
      });
      this.setBranchCode();
      this.genaratereceiptNo(user.branchCode);
      this.formGroup();
      //this.gettingtobranches();
      // this.settoBranchCode();
    }
    this.addTableRow();
  }

  setBranchCode() {
    if (!this.GetBranchesListArray.length) {
      return;
    }
    const bname = this.GetBranchesListArray.filter(fromBranchCode => {
      if (fromBranchCode.id == this.branchFormData.get('fromBranchCode').value) {
        return fromBranchCode;
      }
    });
    if (bname.length) {
      this.branchFormData.patchValue({
        fromBranchName: bname?.[0] != null ? bname[0].text : null
      });
    }
  }



  getStockreceiptDeatilList(id) {
    const getInvoiceDeatilListUrl = [this.apiConfigService.getStockreceiptDeatilList, id].join('/');
    this.apiService.apiGetRequest(getInvoiceDeatilListUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.StockreceiptDeatilList?.length) {
            this.dataSource = new MatTableDataSource(res.response['StockreceiptDeatilList']);
          }
          if (res?.response?.StockreceiptData) {
            this.branchFormData.patchValue(res?.response?.StockreceiptData);
            this.branchFormData.patchValue({
              fromBranchCode: +res?.response?.StockreceiptData['fromBranchCode']
            })
          }
        }
      });
  }

  getBranchesList() {
    const getCashPaymentBranchesListUrl = [this.apiConfigService.getCashPaymentBranchesList].join('/');
    this.apiService.apiGetRequest(getCashPaymentBranchesListUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.BranchesList?.length > 0) {
              this.GetBranchesListArray = res.response['BranchesList'];
              if (this.branchFormData.get('fromBranchCode').value != null) {
                this.setBranchCode();
              }
            }
          }
        }

      });
  }



  //issueno code;
  genaratereceiptNo(branch?) {
    let genarateVoucherNoUrl;
    if (branch != null) {
      genarateVoucherNoUrl = [this.apiConfigService.getStockissuesreceiptnosList, branch].join('/');
    } else {
      genarateVoucherNoUrl = [this.apiConfigService.getStockissuesreceiptnosList, this.branchFormData.get('fromBranchCode').value].join('/');
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if ((res.response['ReceiptNo'] != null)) {
              this.receiptNo = res.response['ReceiptNo']
              this.branchFormData.patchValue({
                receiptNo: res.response['ReceiptNo']
              });
            }
          }
        }
      });
    this.gettingtobranches();
  }

  //tobranch Name;
  gettingtobranches() {
    let gettingtobranchesListUrl;
    if (this.branchFormData.get('fromBranchCode').value == null) {
      gettingtobranchesListUrl = [this.apiConfigService.GetToBranchesStockreceiptsList].join('/');
    }
    else {
      gettingtobranchesListUrl = [this.apiConfigService.gettingtobranchesListforstockreceipt, this.branchFormData.get('fromBranchCode').value].join('/');
    }
    this.apiService.apiGetRequest(gettingtobranchesListUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response != null) {
            console.log(res.response['branch']);
            if (res?.response?.branch) {
              this.toBranchCode = res.response['branch']
              const [code, name] = res.response['branch'] && res.response['branch'].split('-');
              this.branchFormData.patchValue({
                toBranchCode: res.response['branch'],
                toBranchName: name,
              });
              //this.GettoBranchesListArray = res.response['branch'];
            }
          }
        }
      });

  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.getmemberNamesArray.filter(option => option.text.toLowerCase().includes(filterValue));
  }

  addTableRow() {
    const tableObj = {
      productCode: '', productName: '', hsnNo: '', unit: '', qty: '', rate: '', grossAmount: '', availStock: '', batchNo: '', delete: '', text: 'obj'
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
      receiptNo: [null],
      receiptDate: [null],
      shiftId: [null],
      userId: [null],
      employeeId: [null],
      productCode: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      hsnNo: '0',
      unit: [null],
      qty: [null],
      rate: [null],
      grossAmount: [null],
      availStock: [null],
      batchNo: [null],
      delete: [null],
    });
  }


  setToFormModel(text, column, value) {
    this.tableFormObj = true;
    if (text == 'obj') {
      this.tableFormData.patchValue
        ({
          [column]: value
        });
    }
    if (this.tableFormData.valid) {
      this.addTableRow();
      this.formGroup();
      this.tableFormObj = false;
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
    this.dataSource.paginator = this.paginator;
  }


  deleteRow(i) {
    this.dataSource.data = this.dataSource.data.filter((value, index, array) => {
      return index !== i;
    });
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource);
  }


  getProductByProductCode(value) {
    if (value != null && value !== '') {
      const getProductByProductCodeUrl = [this.apiConfigService.getProductByProductCode].join('/');
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { productCode: value }).subscribe(
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

  //Autocomplete code
  getProductByProductName(value) {
    if (value != null && value !== '') {
      const getProductByProductNameUrl = [this.apiConfigService.getProductByProductName].join('/');
      this.apiService.apiPostRequest(getProductByProductNameUrl, { productName: value }).subscribe(
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

  //getProductByProductName(value) {
  //  if (value != null && value !== '') {
  //    const getProductByProductNameUrl = [this.apiConfigService.getProductByProductName, value].join('/');
  //    this.apiService.apiGetRequest(getProductByProductNameUrl).subscribe(
  //      response => {
  //        const res = response;
  //        if (res != null && res.status === StatusCodes.pass) {
  //          if (res.response != null) {
  //            if (res?.response?.Products != null) {
  //              this.getProductByProductNameArray = res.response['Products'];
  //              this.spinner.hide();
  //            }
  //          }
  //        }
  //      });
  //  } else {
  //    this.getProductByProductNameArray = [];
  //  }
  //}

  //Code based getting data
  getdata(productCode, index, id) {
    this.setFocus = id + index;
    const fromBranchCode = this.branchFormData.get('fromBranchCode')?.value;

    if (fromBranchCode != null && fromBranchCode !== '' &&
      productCode?.value != null && productCode.value !== '') {
      const getBillingDetailsRcdUrl = [this.apiConfigService.GetProductListsforStockreceipts, productCode.value,
      this.branchFormData.get('fromBranchCode').value].join('/');
      this.apiService.apiGetRequest(getBillingDetailsRcdUrl).subscribe(
        response => {
          const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.productsList != null) {
                this.DetailsSection(res.response['productsList']);
              }
            }
          }
        });
    }
  }

  //assign data
  DetailsSection(obj) {
    this.dataSource.data = this.dataSource.data.map(val => {
      if (val.productCode == obj.productCode) {
        this.tableFormData.patchValue({
          productCode: obj.productCode,
          productName: obj.productName
        });
        val = obj;
      }
      val.text = 'obj';
      if (val.qty == 0) {
        val.qty = '';
      }
      return val;
    });
    this.setToFormModel(null, null, null);
    this.commonService.setFocus(this.setFocus);
  }

  setProductName(name) {
    this.tableFormData.patchValue
      ({
        productName: name.value
      });
    this.setToFormModel(null, null, null);
  }


  //Calaculating code
  calculateAmount(row, index) {
    let amount = 0;
    for (let a = 0; a < this.dataSource.data.length; a++) {
      if (this.dataSource.data[a].qty) {
        amount = (this.dataSource.data[a].qty) * (this.dataSource.data[a].rate);
        this.dataSource.data[a]['grossAmount'] = amount;
      }
    }
    this.tableFormData.patchValue
      ({
        grossAmount: amount

      });
  }

  //Save Code
  save() {
    if (this.routeUrl != '' || this.branchFormData.invalid) {
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
      if ((stock?.qty == null || stock?.qty <= 0)) {
        content = 'Please enter valid Quantity';
        return stock;
      }
      if (stock.availStock == 0 || ((stock.qty == null) && (stock.rate == null))) {
        content = 'Availablilty Stock is 0';
        return stock;
      }
    });
    if (availStock.length) {
      this.alertService.openSnackBar(`This Product(${availStock[0].productCode}) ${content}`, Static.Close, SnackBar.error);
      return;
    }
    if (!this.tableFormObj) {
      this.dataSource.data.pop();
    }
    if (this.dataSource.data.length == 0) {
      this.alertService.openSnackBar(`Product is not added`, Static.Close, SnackBar.error);
      return;
    }
    var index = this.dataSource.data.indexOf(1);
    this.dataSource.data.splice(index, 1);
    this.registerStackreceipts();
  }

  registerStackreceipts() {
    const registerStackreceiptsUrl = [this.apiConfigService.registerStockreceipts].join('/');
    const requestObj = { StackreceiptsHdr: this.branchFormData.getRawValue(), StackreceiptsDetail: this.dataSource.data };
    this.apiService.apiPostRequest(registerStackreceiptsUrl, requestObj).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res?.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar('Stock Receipt Created Successfully..', Static.Close, SnackBar.success);
          }
        }
        this.reset();
      });
  }

  reset() {
    this.dataSource = new MatTableDataSource();
    this.branchFormData.reset();
    this.resetData();
    this.commonService.setFocus('productCode0');
  }


  back() {
    this.router.navigate(['dashboard/transactions/stockreceipt']);
  }

}
