import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
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

@Component({ 
  selector: 'app-create-stockreceipt',
  templateUrl: './create-stockreceipt.component.html',
  styleUrls: ['./create-stockreceipt.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, TextFieldModule, TypeaheadModule]
})
export class CreateStockreceiptsComponent implements OnInit {

  branchFormData: UntypedFormGroup;
  GetBranchesListArray = [];
  myControl = new UntypedFormControl();
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
  modelFormData: UntypedFormGroup;
  tableFormData: UntypedFormGroup;
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
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.branchFormData = this.formBuilder.group
      ({
      receiptNo: [null],
      receiptDate: [(new Date()).toISOString()],
      fromBranchCode: [null],
      fromBranchName: [null],
      toBranchCode: [null],
      toBranchName: [null],
      serverDateTime: [null],
      shiftId: [null],
        userId: '0',
      operatorStockReceiptId: '0',
      userName: [null],
      employeeId: [null],
      remarks: [null],
      //printBill: [false],

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
  ngOnInit()
  {
    this.loadData();
    this.commonService.setFocus('productCode');
  }

  loadData() {
    //debugger;
    const user = JSON.parse(localStorage.getItem('user'));
    this.getBranchesList();
    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != null) {
        this.routeUrl = params.id1;
        //this.disableForm(params.id1);
        this.getStockreceiptDeatilList(params.id1);
        let billHeader = JSON.parse(localStorage.getItem('selectedstockissues'));
        this.branchFormData.setValue(billHeader);
        this.gettingtobranches();
      } else
      {
        //this.disableForm();
        if (user?.branchCode != null) {
          this.branchFormData.patchValue({
            fromBranchCode: +user.branchCode,
            userId: user.seqId,
            userName: user.userName
          });
          this.setBranchCode();
          this.genaratereceiptNo(user.branchCode);
          this.formGroup();
          //this.gettingtobranches();
          // this.settoBranchCode();
        }
        this.addTableRow();
      }
    });
  }

  setBranchCode() {
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



  getStockreceiptDeatilList(id)
  {
    //debugger;
    const getInvoiceDeatilListUrl = [this.apiConfigService.getStockreceiptDeatilList, id].join('/');
    this.apiService.apiGetRequest(getInvoiceDeatilListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.StockreceiptDeatilList?.length) {
            this.dataSource = new MatTableDataSource(res.response['StockreceiptDeatilList']);
            this.spinner.hide();
          }
        }
      });
  }

  getBranchesList()
  {
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



  //issueno code;
  genaratereceiptNo(branch?) {
    //debugger;
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
              this.branchFormData.patchValue
                ({
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
    //debugger;
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
          if (res?.response != null)
          {
            console.log(res.response['branch']);
            if (res?.response?.branch?.length)
            {
              this.toBranchCode = res.response['branch']
              this.branchFormData.patchValue({
                  toBranchCode: res.response['branch']
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
    //debugger;
    const tableObj =
    {
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
  
  //Autocomplete code
  getProductByProductName(value)
  {
    //debugger;
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

  //getProductByProductName(value) {
  //  debugger;
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
    this.commonService.setFocus(this.setFocus);
  }

  setProductName(name)
  {
    //debugger;
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
    //debugger;
    var index = this.dataSource.data.indexOf(1);
    this.dataSource.data.splice(index, 1);
    if (this.routeUrl != '') {
      return;
    }
    let availStock = this.dataSource.filteredData.filter(stock => {
      if (stock.availStock == 0 || ((stock.qty == null) && (stock.rate == null)))
      {
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
    
    this.registerStackreceipts();
  }

  registerStackreceipts() {
    //debugger;
    const registerStackreceiptsUrl = [this.apiConfigService.registerStockreceipts].join('/');
    const requestObj = { StackreceiptsHdr: this.branchFormData.value, StackreceiptsDetail: this.dataSource.data };
    this.apiService.apiPostRequest(registerStackreceiptsUrl, requestObj).subscribe(
      response => {
        const res = response;
        if (res?.status === StatusCodes.pass)
        {
          if (res.response != null) {
            this.alertService.openSnackBar('Stock Receipt Created Successfully..', Static.Close, SnackBar.success);
           // this.branchFormData.reset();
          }
        }
        this.reset();
        this.spinner.hide();
      });
  }

  reset() {
    this.branchFormData.reset();
    this.dataSource = new MatTableDataSource();
    this.formGroup();
    const user = JSON.parse(localStorage.getItem('user'));
    this.genaratereceiptNo(user.branchCode);
    this.gettingtobranches();
    this.branchFormData = this.formBuilder.group
      ({
        receiptDate: [(new Date()).toISOString()],
        fromBranchCode: (user.branchCode != null) ? user.branchCode : user.branchCode,
        receiptNo: [null],
        toBranchCode: [null]
        
      });
    
    this.ngOnInit();
  }

}
