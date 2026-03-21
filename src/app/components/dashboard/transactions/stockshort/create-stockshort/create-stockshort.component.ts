import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../../services/common.service';
import { ApiConfigService } from '../../../../../services/api-config.service';

import { ApiService } from '../../../../../services/api.service';

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
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@Component({ 
    selector: 'app-create-stockshort',
    templateUrl: './create-stockshort.component.html',
    styleUrls: ['./create-stockshort.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, TypeaheadModule]
})
export class CreateStockshortsComponent implements OnInit {

  branchFormData: UntypedFormGroup;
  GetBranchesListArray = [];
  myControl = new UntypedFormControl();
  filteredOptions: Observable<any[]>;
  getAccountLedgerListArray = [];
  getAccountLedgerListNameArray = [];
  getSalesBranchListArray = [];
  branchesList = [];
  getmemberNamesArray = [];

  displayedColumns: string[] = ['productCode', 'productName', 'hsnNo', 'unitName', 'qty', 'rate', 'totalAmount',  'batchNo', 'delete'
  ];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  date = new Date((new Date().getTime() - 3888000000));
  modelFormData: UntypedFormGroup;
  tableFormData: UntypedFormGroup;
 // printBill: any;
  issueno = null;
  totalamount = null;
  tableFormObj = false;
  routeUrl = '';
  getProductByProductCodeArray = [];
  getProductByProductNameArray: any[];
  GetCostCentersListArray: any;
    stockshortNo: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.branchFormData = this.formBuilder.group({
      stockshortNo: [null],
      stockshortDate: [(new Date()).toISOString()],
      branchCode: [null],
      branchName: [null],
     stockshortMasterId:'0',
      shiftId: [null],
      userId: '0',
      userName: [null],
      employeeId: [null],
      serverDate: [null],
      costCenter: [null],
      narration: [null],
     // printBill: [false],

    });
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      //debugger;
      this.branchFormData.patchValue
        ({
          userId: user.userId,
          userName: user.userName,
          shiftId: user.shiftId
        })
    }
  }


  //ngOnInit()
  //{
  //  //debugger;
  //  this.formGroup();
  //  this.getBranchesList();
  //  this.GetCostCentersList();
  //  this.activatedRoute.params.subscribe(params => {
  //    console.log(params.id1);
  //    if (params.id1 != null) {
  //      this.routeUrl = params.id1;
  //      //this.disableForm(params.id1);
  //      this.getStockshortDeatilList(params.id1);
  //      let billHeader = JSON.parse(localStorage.getItem('selectedStockshort'));
  //      this.branchFormData.setValue(billHeader);
  //      console.log(billHeader);
  //    } else {
  //      //this.disableForm();
  //      const user = JSON.parse(localStorage.getItem('user'));
  //      if ((user.fromBranchCode) != null) {
  //        //this.frombrnchcode = user.fromBranchCode;
  //        this.branchFormData.patchValue({
  //          voucherNo: user.fromBranchCode,
  //        });
  //        this.genaratestockshortvocherNo(user.fromBranchCode);
  //      }
     
  //      this.addTableRow();
  //    }
  //  });
  //}

  ngOnInit() {
    //debugger;
    this.loadData();
    this.commonService.setFocus('costCenter');
    //debugger;
    //this.formGroup();
    //this.getBranchesList();
    //this.GetCostCentersList();
    //this.activatedRoute.params.subscribe(params => {
    //  console.log(params.id1);
    //  if (params.id1 != null) {
    //    this.routeUrl = params.id1;
    //    //this.disableForm(params.id1);
    //    this.getStockshortDeatilList(params.id1);
    //    let billHeader = JSON.parse(localStorage.getItem('selectedStockshort'));
    //    this.branchFormData.setValue(billHeader);
    //    console.log(billHeader);
    //  } else {
    //    //this.disableForm();
    //    const user = JSON.parse(localStorage.getItem('user'));
    //    if ((user.fromBranchCode) != null) {
    //      //this.frombrnchcode = user.fromBranchCode;
    //      this.branchFormData.patchValue({
    //        voucherNo: user.fromBranchCode,
    //      });
    //      this.genaratestockshortvocherNo(user.fromBranchCode);
    //    }

    //    this.addTableRow();
    //  }
    //});
  }

  loadData() {
    this.getBranchesList();
    this.GetCostCentersList();
    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != null) {
        this.routeUrl = params.id1;
        //this.disableForm(params.id1);
        this.getStockshortDeatilList(params.id1);
        let billHeader = JSON.parse(localStorage.getItem('selectedStockshort'));
        this.branchFormData.setValue(billHeader);
      } else {
        //this.disableForm();
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.branchCode != null) {
          this.branchFormData.patchValue({
            branchCode: user.branchCode,
            userId: user.seqId,
            userName: user.userName
          });
          this.setBranchCode();
          this.genaratestockshortvocherNo(user.branchCode);
          this.formGroup();
        }
        this.addTableRow();
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

  getStockshortDeatilList(id) {
    //debugger;
    const getInvoiceDeatilListUrl = [this.apiConfigService.getStockshortsDeatilList, id].join('/');
    this.apiService.apiGetRequest(getInvoiceDeatilListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.StockshortsDeatilList?.length) {
            this.dataSource = new MatTableDataSource(res.response['StockshortsDeatilList']);
            this.spinner.hide();
          }
        }
      });
  }


  getBranchesList() {
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

  GetCostCentersList() {
    const getCashPaymentBranchesListUrl = [this.apiConfigService.GetCostCentersList].join('/');
    this.apiService.apiGetRequest(getCashPaymentBranchesListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.CostCentersList?.length) {
              this.GetCostCentersListArray = res.response['CostCentersList'];
              this.spinner.hide();
            }
          }
        }
      });
  }


  //stockshortvocherno code;
  genaratestockshortvocherNo(branch?) {
    //debugger;
    let genarateVoucherNoUrl;
    if (branch != null) {
      genarateVoucherNoUrl = [this.apiConfigService.getstockshortvochernosList, branch].join('/');
    } else {
      genarateVoucherNoUrl = [this.apiConfigService.getstockshortvochernosList, this.branchFormData.get('branchCode').value].join('/');
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if ((res.response['stockshortVoucherNo'] != null)) {
              this.stockshortNo = res.response['stockshortVoucherNo']
              this.branchFormData.patchValue
                ({
                  stockshortNo: res.response['stockshortVoucherNo']
                });
              this.spinner.hide();
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
    //debugger;
    const tableObj =
    {
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
      stockshortNo: [null],
      stockshortDate: [null],
      shiftId: [null],
      userId: [null],
      employeeId: [null],
      productCode: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      hsnNo: '0',
      unit: [null],
      qty: [null],
      rate: [null],
      totalAmount: [null],
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
              if (res?.response?.Products != null) {
                this.getProductByProductCodeArray = res.response['Products'];
                this.spinner.hide();
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
    //debugger;
    if (value != null && value !== '') {
      const getProductByProductNameUrl = [this.apiConfigService.getProductByProductName].join('/');
      this.apiService.apiPostRequest(getProductByProductNameUrl, { productName: value }).subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              if (res?.response?.Products != null) {
                this.getProductByProductNameArray = res.response['Products'];
                this.spinner.hide();
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
  getdata(productCode) {
    //debugger;
    const branchCode = this.branchFormData.get('branchCode')?.value;
const pCode = productCode?.value;

if (branchCode != null && branchCode !== '' && pCode != null && pCode !== '') {

      const getBillingDetailsRcdUrl = [this.apiConfigService.GetProductListsforStockshortsList, productCode.value,
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

 
  //assign data
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
      return val;
    });
    this.setToFormModel(null, null, null);
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
    //debugger;
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

  //Save Code
  save() {
    //debugger;
    var index = this.dataSource.data.indexOf(1);
    this.dataSource.data.splice(index, 1);
    if (this.routeUrl != '') {
      return;
    }
    let availStock = this.dataSource.filteredData.filter(stock => {
      if (stock.availStock == 0 || ((stock.qty == null) && (stock.rate == null))) {
        return stock;
      }
    });
    if (availStock.length) {
      this.alertService.openSnackBar(`This Product(${availStock[0].productCode}) 0 Availablilty Stock`, Static.Close, SnackBar.error);
      return;
    }
    if (!this.tableFormObj) {
      this.dataSource.data.pop();
    }
    if (this.dataSource.data.length == 0) {
      return;
    }

    this.registerStackshorts();
  }

  registerStackshorts() {
    //debugger;
    const registerStackreceiptsUrl = [this.apiConfigService.registerStockshorts].join('/');
    const requestObj = { StockshortHdr: this.branchFormData.value, StockshortDtl: this.dataSource.data };
    this.apiService.apiPostRequest(registerStackreceiptsUrl, requestObj).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response != null)
          {
            this.alertService.openSnackBar('Stock Short Created Successfully..', Static.Close, SnackBar.success);
            this.branchFormData.reset();
          }
          this.reset();
          this.spinner.hide();
          //location.reload();
        }
      });
  }

  reset() {
    this.branchFormData.reset();
    this.dataSource = new MatTableDataSource();
    this.formGroup();
    const user = JSON.parse(localStorage.getItem('user'));
    this.branchFormData = this.formBuilder.group({
      stockshortDate: [(new Date()).toISOString()],
      branchCode: user.branchCode,
      stockshortNo: user.branchCode
    });
    this.ngOnInit();
    //this.genaratestockshortvocherNo(1);
  }
}
