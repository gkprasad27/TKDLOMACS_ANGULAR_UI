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
  selector: 'app-create-stockissues',
  templateUrl: './create-stockissues.component.html',
  styleUrls: ['./create-stockissues.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, TextFieldModule, TypeaheadModule]
})
export class CreateStockissuesComponent implements OnInit {

  branchFormData: FormGroup;
  GetBranchesListArray = [];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  getAccountLedgerListArray = [];
  getAccountLedgerListNameArray = [];
  getSalesBranchListArray = [];
  branchesList = [];
  getmemberNamesArray = [];
  fromBranchCode = null;
  setFocus = '';

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
  orders: any;
  GettoBranchesListArray: any;
  toBranchCode: any;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router,

    private spinner: NgxSpinnerService,
  ) {
    this.branchFormData = this.formBuilder.group({
      issueNo: [null, [Validators.required]],
      issueDate: [null, [Validators.required]],
      fromBranchCode: [null, [Validators.required]],
      fromBranchName: [null],
      toBranchCode: [null],
      toBranchName: [null, [Validators.required]],
      serverDateTime: [null],
      shiftId: [null],
      userId: [0],
      userName: [null],
      employeeId: [null],
      remarks: [null],
      operatorStockIssueId: [0],
      // printBill: [false],

    });
    //String data= null;
    const user = JSON.parse(localStorage.getItem('user'));
    if ((user != null)) {
      this.branchFormData.patchValue({
        userId: user.userId,
        userName: user.userName,
        shiftId: user.shiftId
      })
    }
  }

  loadData() {
    // this.gettingtobranches();
    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != null) {
        this.routeUrl = params.id1;
        //this.disableForm(params.id1);
        this.getStockissuesDeatilList(params.id1);
        this.gettingtobranches();
      } else {
        this.resetData();
      }
    });
  }

  resetData() {
    //this.disableForm();
    const user = JSON.parse(localStorage.getItem('user'));
    if ((user.branchCode != null)) {
      this.branchFormData.patchValue
        ({
          fromBranchCode: +user.branchCode,
          userId: user.seqId,
          userName: user.userName,
          receiptDate: (new Date()).toISOString(),
          operatorStockIssueId: 0
        });
      this.genaratebranchcode();
      ////this.setBranchCode();
      ////this.genarateVoucherNo(user.branchCode);
      this.formGroup();
      ////this.gettingtobranches();
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


  //issueno code;
  genaratebranchcode(branch?) {
    let genaratebranchNoUrl;
    if ((branch != null)) {
      genaratebranchNoUrl = [this.apiConfigService.getbranchesnosList, branch].join('/');
    }
    else {
      genaratebranchNoUrl = [this.apiConfigService.getbranchesnosList, this.branchFormData.get('fromBranchCode').value].join('/');
    }
    this.apiService.apiGetRequest(genaratebranchNoUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if ((res.response['branchno'] != null)) {
              this.fromBranchCode = res.response['branchno']
              console.log(res.response['branchno']);
              this.branchFormData.patchValue({
                fromBranchCode: res.response['branchno']
              });
              this.setBranchCode();
              this.genarateVoucherNo(this.fromBranchCode);
              this.gettingtobranches();
            }
          }
        }
      });

    //this.gettingtobranches();
  }

  ngOnInit() {
    this.loadData();
    this.commonService.setFocus('productCode0');
    this.getCashPaymentBranchesList();
  }

  getStockissuesDeatilList(id) {
    const getInvoiceDeatilListUrl = [this.apiConfigService.getStockissuesDeatilList, id].join('/');
    this.apiService.apiGetRequest(getInvoiceDeatilListUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.StockissuesDeatilList?.length) {
            this.dataSource = new MatTableDataSource(res.response['StockissuesDeatilList']);
          }
          if (res?.response.StockissuesData) {
            this.branchFormData.patchValue(res?.response.StockissuesData);
            this.branchFormData.patchValue({
              fromBranchCode: +res?.response?.StockissuesData['fromBranchCode']
            })
          }
        }
      });
  }

  getCashPaymentBranchesList() {
    const getCashPaymentBranchesListUrl = [this.apiConfigService.GetBranchesList].join('/');
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
  genarateVoucherNo(branch?) {
    let genarateVoucherNoUrl;
    if (branch != null) {
      genarateVoucherNoUrl = [this.apiConfigService.getStockissuesnosList, branch].join('/');
    }
    else {
      genarateVoucherNoUrl = [this.apiConfigService.getStockissuesnosList, this.branchFormData.get('fromBranchCode').value].join('/');
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if ((res.response['StackissueNo'] != null)) {
              this.issueno = res.response['StackissueNo']
              this.branchFormData.patchValue({
                issueNo: res.response['StackissueNo']
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
      gettingtobranchesListUrl = [this.apiConfigService.GetToBranchesList].join('/');
    }
    else {
      gettingtobranchesListUrl = [this.apiConfigService.gettingtobranchesList, this.branchFormData.get('fromBranchCode').value].join('/');
    }
    this.apiService.apiGetRequest(gettingtobranchesListUrl).subscribe(
      response => {
        const res = response;
              this.spinner.hide();
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.branch?.length) {
              this.toBranchCode = res.response['branch']
              this.branchFormData.patchValue({
                toBranchName: res.response['branch']
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
      issueNo: [null],
      issueDate: [null],
      shiftId: [null],
      userId: [null],
      employeeId: [null],
      productCode: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      hsnNo: [0],
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


  //getProductByProductCode(value) {
  //  if (value != null && value !== '') {
  //    const getProductByProductCodeUrl = [this.apiConfigService.getProductByProductCode, value].join('/');
  //    this.apiService.apiGetRequest(getProductByProductCodeUrl).subscribe(
  //      response => {
  //        const res = response;
  //        if (res != null && res.status === StatusCodes.pass) {
  //          if (res.response != null) {
  //            if (res?.response?.Products != null) {
  //              this.getProductByProductCodeArray = res.response['Products'];
  //              this.spinner.hide();
  //            }
  //          }
  //        }
  //      });
  //  } else {
  //    this.getProductByProductCodeArray = [];
  //  }
  //}

  ////Autocomplete code
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
      const getBillingDetailsRcdUrl = [this.apiConfigService.GetProductLists, productCode.value,
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
    if (tableData.length == 0) {
      this.alertService.openSnackBar(`Product is not added`, Static.Close, SnackBar.error);
      return;
    }

    this.registerStackissues();
  }

  registerStackissues() {
    var index = this.dataSource.data.indexOf(1);
    this.dataSource.data.splice(index, 1);
    const obj = this.branchFormData.getRawValue();
    const registerInvoiceUrl = [this.apiConfigService.registerStockissues].join('/');
    const requestObj = { StockissueHdr: obj, StockissueDtl: this.dataSource.data };
    this.apiService.apiPostRequest(registerInvoiceUrl, requestObj).subscribe(
      response => {
        const res = response;
        this.spinner.hide();
        if (res?.status === StatusCodes.pass) {
          if (res?.response != null) {
            this.alertService.openSnackBar('Stock Issues Created Successfully..', Static.Close, SnackBar.success);
            //this.branchFormData.reset();
          }
          this.reset();
        }
      });
  }

  reset() {
    this.branchFormData.reset();
    this.dataSource = new MatTableDataSource();
    this.resetData();
    this.commonService.setFocus('productCode0');
  }

  back() {
    this.router.navigate(['dashboard/transactions/stockissues']);
  }

}
