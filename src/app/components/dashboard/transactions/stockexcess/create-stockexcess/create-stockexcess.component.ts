import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
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
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../directives/format-datepicker';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@Component({ 
    selector: 'app-create-stockexcess',
    templateUrl: './create-stockexcess.component.html',
    styleUrls: ['./create-stockexcess.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, TextFieldModule, TypeaheadModule]
})
export class CreateStockExcessComponent implements OnInit {

  branchFormData: FormGroup;
  GetBranchesListArray = [];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  getProductByProductCodeArray = [];
  getProductByProductNameArray = [];
  getStockExcessListArray = [];
  branchesList = [];
  getmemberNamesArray=[];

  displayedColumns: string[] = ['SlNo','productCode', 'productName', 'hsnNo', 'unitName', 'qty', 'rate', 'totalAmount',  'batchNo', 'delete'
  ];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  date = new Date((new Date().getTime() - 3888000000));
  modelFormData: FormGroup;
  tableFormData: FormGroup;
  printBill: any;
  tableFormObj = false;
  routeUrl = '';
  setFocus: any;

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
      stockExcessNo: [null],
      stockExcessDate: [(new Date()).toISOString()],
      branchCode: [null],
      branchName: [null],
      shiftId: [null],
      userId: [null],
      userName: [null],
      employeeId: [null],
      narration: [null],
      //printBill: [false],
      stockExcessMasterId:[null],
      costCenter:[null],
      serverDate:[null]
    });

      const user = JSON.parse(localStorage.getItem('user'));

    if (user?.role != '1') {
      this.branchFormData.controls['branchCode'].disable();
    }
  }

  ngOnInit() {
    this.loadData();
    this.commonService.setFocus('costCenter');
    this.getStockExcessBranchesList();
    this.getStockExcessCostCentersList();
  }

  loadData() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != null) {
        this.routeUrl = params.id1;
        this.disableForm(params.id1);
        this.getStockExcessDetailsList(params.id1);
        let billHeader = JSON.parse(localStorage.getItem('selectedBill'));
        this.branchFormData.setValue(billHeader);
      } else {
        this.disableForm();
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.branchCode != null) {
          this.branchFormData.patchValue({
            branchCode: +user.branchCode,
            userId: user.seqId,
            userName: user.userName
          });
          this.setBranchCode();
          this.genarateVoucherNo(user.branchCode);
          this.formGroup();
        }
	this.addTableRow();
      }
    });
  }

  getStockExcessDetailsList(id) {
    const getStockExcessDetailsListUrl = [this.apiConfigService.getStockExcessDetailsList, id].join('/');
    this.apiService.apiGetRequest(getStockExcessDetailsListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.StockExcessDetails?.length) {
            this.dataSource = new MatTableDataSource(res.response['StockExcessDetails']);
            this.spinner.hide();
          }
        }
      });
  }

  disableForm(route?) {
    if (route != null) {
      this.branchFormData.controls['stockExcessNo'].disable();
      this.branchFormData.controls['branchCode'].disable();
      this.branchFormData.controls['stockExcessDate'].disable();
      this.branchFormData.controls['userName'].disable();
      this.branchFormData.controls['narration'].disable();
      this.branchFormData.controls['costCenter'].disable();
    }

    //this.branchFormData.controls['voucherNo'].disable();
    // this.branchFormData.controls['totalAmount'].disable();
  }


  getStockExcessBranchesList() {
    const getStockExcessBranchesListUrl = [this.apiConfigService.getStockExcessBranchesList].join('/');
    this.apiService.apiGetRequest(getStockExcessBranchesListUrl).subscribe(
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
      genarateVoucherNoUrl = [this.apiConfigService.getstockexcessNo, branch].join('/');
    } else {
      genarateVoucherNoUrl = [this.apiConfigService.getstockexcessNo, this.branchFormData.get('branchCode').value].join('/');
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if ((res.response['stockexcessNo'] != null)) {
              this.branchFormData.patchValue({
                stockExcessNo: res.response['stockexcessNo']
              });
              this.spinner.hide();
            }
          }
        }
      });
  }

  getStockExcessCostCentersList() {
    const getStockExcessCostCentersListUrl = [this.apiConfigService.getStockExcessCostCentersList].join('/');
    this.apiService.apiGetRequest(getStockExcessCostCentersListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.CostCentersList?.length) {
              this.getStockExcessListArray = res.response['CostCentersList'];
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
      productCode: '', productName: '', hsnNo: '', unit: '', qty: '', rate: '', totalAmount: '', batchNo: '', delete: '', text: 'obj'
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
      stockExcessNo: [null],
      stockExcessDate: [null],
      shiftId: [null],
      userId: [null],
      employeeId: [null],
      productCode: [null, [Validators.required]],
      productName: [null, [Validators.required]],
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
    console.log(this.dataSource);
  }

  getProductByProductCode(value) {
    if (value != null && value !== '') {
      const getProductByProductCodeUrl = [this.apiConfigService.getProductByProductCode].join('/');
      this.apiService.apiPostRequest(getProductByProductCodeUrl, { productCode: value }).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.products != null) {
                this.getProductByProductCodeArray = res.response['products'];
                this.spinner.hide();
              }
            }
          }
        });
    } else {
      this.getProductByProductCodeArray = [];
    }
  }

 calculateAmount(row, index) {
  let amount = 0;
  for (let a = 0; a < this.dataSource.data.length; a++) {
    if (this.dataSource.data[a].qty) {
      amount = (this.dataSource.data[a].qty) * (this.dataSource.data[a].rate);
      this.dataSource.data[a]['totalAmount'] = amount;
    }
  }
  this.tableFormData.patchValue
    ({
      totalAmount: amount

    });
}

getProductByProductName(value) {
  if (value != null && value !== '') {
    const getProductByProductNameUrl = [this.apiConfigService.getProductByProductName].join('/');
    this.apiService.apiPostRequest(getProductByProductNameUrl, { productName: value }).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.products != null) {
              this.getProductByProductNameArray = res.response['products'];
              this.spinner.hide();
            }
          }
        }
      });
  } else {
    this.getProductByProductNameArray = [];
  }
}

  getdata(productCode, index, id) {
    this.setFocus = id + index;
    const branchCode = this.branchFormData.get('branchCode')?.value;
const pCode = productCode?.value;

if (branchCode != null && branchCode !== '' && pCode != null && pCode !== '') {

      const getBillingDetailsRcdUrl = [this.apiConfigService.getProductListsforStockexcessList, productCode.value,
        this.branchFormData.get('branchCode').value].join('/');
      this.apiService.apiGetRequest(getBillingDetailsRcdUrl).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.productsList != null) {
                this.DetailsSection(res.response['productsList']);
                this.spinner.hide();
              }
            }
          }
        });
    }
  }

  DetailsSection(obj) {
    this.dataSource.data = this.dataSource.data.map(val => {
      if (val.productCode == obj.productCode) {
        this.tableFormData.patchValue
          ({
            productCode: obj.productCode,
            productName: obj.productName
          });
        val = obj;
      }
      val.text = 'obj';
      if(val.qty == 0) {
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

  save() {
    // if (!this.tableFormObj) {
    //   this.dataSource.data.pop();
    //   console.log(this.dataSource.data);
    // }
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
    let totalAmount = null;
    this.dataSource.data.forEach(element => {
      totalAmount = element.amount + totalAmount;
    });
  
    console.log(this.branchFormData, this.dataSource.data);

    this.registerStockexcess(tableData);
  }

  reset() {
    this.branchFormData.reset();
    this.dataSource = new MatTableDataSource();
    this.formGroup();
    this.loadData();
  }

  registerStockexcess(data) {
    this.branchFormData.patchValue({
      stockExcessMasterId: 0
    });
    const registerStockexcessUrl = [this.apiConfigService.registerStockexcess].join('/');
    const requestObj = { StockexcessHdr: this.branchFormData.value, StockexcessDtl: data };
    this.apiService.apiPostRequest(registerStockexcessUrl, requestObj).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar('Stock Excess Created Successfully..', Static.Close, SnackBar.success);
          }
          this.reset();
          this.spinner.hide();
        }
      });
  }


  back() {
      this.router.navigate(['dashboard/transactions/stockexcess']);
  }

}
