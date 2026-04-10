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
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-create-purchaserequisitionapproval',
  templateUrl: './create-purchaserequisitionapproval.component.html',
  styleUrls: ['./create-purchaserequisitionapproval.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, TextFieldModule, TypeaheadModule]
})
export class CreatePurchaseRequisitionapprovalComponent implements OnInit {

  branchFormData: FormGroup;
  GetBranchesListArray = [];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  getAccountLedgerListArray = [];
  getAccountLedgerListNameArray = [];
  getSalesBranchListArray = [];
  branchesList = [];
  getmemberNamesArray = [];

  //displayedColumns: string[] = ['productCode', 'productName', 'hsnNo', 'unitName', 'qty', 'availbleQtyinBranch', 'availbleQtyinGowdown', 'approvedQty', 'rate', 'grossAmount', 'availStock', 'batchNo', 'delete'
  //];
  displayedColumns: string[] = ['productCode', 'productName', 'qty', 'availbleQtyinBranch', 'availbleQtyinGowdown', 'approvedQty', 'delete'
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
  compiniesList: any;
  setFocus: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private router: Router,

    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
    this.branchFormData = this.formBuilder.group({
      //receiptNo: [null],
      company: [null],
      branch: [null],
      requisitionNo: [null],
      requisitionDate: [(new Date()).toISOString()],
      id: '0',
    });
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      this.branchFormData.patchValue
        ({
          userId: user.userId,
          userName: user.userName,
          shiftId: user.shiftId
        })
    }

    if (user?.role != '1') {
      this.branchFormData.controls['branch'].disable();
    }
  }
  ngOnInit() {
    this.loadData();
    this.getCompiniesList();
    this.getBranchesList();
  }

  loadData() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != null) {
        this.routeUrl = params.id1;
        //this.disableForm(params.id1);
        this.getprreqDeatilList(params.id1);
        let billHeader = JSON.parse(localStorage.getItem('selectedstockissues'));
        console.log(billHeader);
        this.branchFormData.setValue(billHeader);
      } else {
        //this.disableForm();
        if (user?.branchCode != null) {
          this.branchFormData.patchValue({
            fromBranchCode: +user.branchCode,
            branch: +user.branchCode,
            userId: user.seqId,
            userName: user.userName
          });
          this.setBranchCode();
          this.genaratereceiptNo(user.branchCode);
          this.formGroup();
        }
        this.addTableRow();
      }
    });
  }

  setBranchCode() {
    if (!this.GetBranchesListArray.length) {
      return;
    }
    const bname = this.GetBranchesListArray.filter(fromBranchCode => {
      if (fromBranchCode.id == this.branchFormData.get('branch').value) {
        return fromBranchCode;
      }
    });
    if (bname.length) {
      this.branchFormData.patchValue({
        fromBranchName: bname?.[0] != null ? bname[0].text : null
      });
    }
  }



  getprreqDeatilList(id) {
    const getInvoiceDeatilListUrl = [this.apiConfigService.getprreqDeatilList, id].join('/');
    this.apiService.apiGetRequest(getInvoiceDeatilListUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res?.response?.PrreqDeatilList?.length) {
            this.dataSource = new MatTableDataSource(res.response['PrreqDeatilList']);
            ////console.log(res.response['StockissuesDeatilList']);
            this.spinner.hide();
          }
        }
      });
  }
  getCompiniesList() {
    const getCompiniesListList = [this.apiConfigService.getCompaniesList].join('/');
    this.apiService.apiGetRequest(getCompiniesListList)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              console.log(res);
              this.compiniesList = res.response['CompaniesList'];
            }
          }
          this.spinner.hide();
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
              if (this.branchFormData.get('branch').value != null) {
                this.setBranchCode();
              }
            }
          }
        }

      });
  }

  //issueno code;
  genaratereceiptNo(branch?) {
    //;
    //setbranch
    let genarateVoucherNoUrl;
    if (branch != null) {
      genarateVoucherNoUrl = [this.apiConfigService.getprreqreceiptnosList, branch].join('/');
    } else {
      genarateVoucherNoUrl = [this.apiConfigService.getprreqreceiptnosList, this.branchFormData.get('branch').value].join('/');
    }
    this.apiService.apiGetRequest(genarateVoucherNoUrl).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            if (res?.response?.StackissueNo != null) {
              this.receiptNo = res.response['StackissueNo']
              this.branchFormData.patchValue
                ({
                  requisitionNo: res.response['StackissueNo']
                });
              this.spinner.hide();
            }
          }
        }
      });
    //this.gettingtobranches();
  }



  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.getmemberNamesArray.filter(option => option.text.toLowerCase().includes(filterValue));
  }

  addTableRow() {
    const tableObj =
    {
      productCode: '', productName: '', qty: '', availbleQtyinBranch: '', availbleQtyinGowdown: '', approvedQty: '', delete: '', text: 'obj'
      // productCode: '', productName: '', hsnNo: '', unit: '', qty: '', availbleQtyinBranch: '', availbleQtyinGowdown: '', approvedQty:'', rate: '', grossAmount: '', availStock: '', availStockinbranch: '', batchNo: '', delete: '', text: 'obj'
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
      productCode: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      qty: [null],
      availbleQtyinBranch: [null],
      availbleQtyinGowdown: [null],
      approvedQty: [null],
      availStock: [null],
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
      //this.tableFormObj = false;
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

  //Autocomplete code
  getProductByProductName(value) {
    ;
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
    //set branch
    const branch = this.branchFormData.get('branch')?.value;

    if (branch != null && branch !== '' &&
      productCode?.value != null && productCode.value !== '') {
      const getBillingDetailsRcdUrl = [this.apiConfigService.GetProductListsforpreq, productCode.value,
      this.branchFormData.get('branch').value].join('/');
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
    console.log(obj);
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
      if (val.qty == 0) {
        val.qty = '';
      }
      return val;
    });
    this.setToFormModel(null, null, null);
    this.commonService.setFocus(this.setFocus);
  }

  setProductName(name) {
    ;
    this.tableFormData.patchValue
      ({
        productName: name.value
      });
    this.setToFormModel(null, null, null);
  }


  //Calaculating code
  //calculateAmount(row, index) {
  //  ;
  //  let amount = 0;
  //  for (let a = 0; a < this.dataSource.data.length; a++) {
  //    if (this.dataSource.data[a].qty) {
  //      amount = (this.dataSource.data[a].qty) * (this.dataSource.data[a].rate);
  //      this.dataSource.data[a]['grossAmount'] = amount;
  //    }
  //  }
  //  this.tableFormData.patchValue
  //    ({
  //      grossAmount: amount

  //    });
  //}

  //Save Code
  save() {
    if (this.routeUrl != '') {
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


    this.registerpurreq();
  }

  registerpurreq() {
    const registerStackreceiptsUrl = [this.apiConfigService.registerPurchaserequisitionaaprovalDetails].join('/');
    const requestObj = { PurreqHdr: this.branchFormData.value, PurreqDetail: this.dataSource.data };
    this.apiService.apiPostRequest(registerStackreceiptsUrl, requestObj).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar('PurchaseRequisitionapproval Created Successfully..', Static.Close, SnackBar.success);
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
    this.branchFormData.patchValue({
      requisitionDate: [(new Date()).toISOString()],
    });
    this.loadData();
  }


  back() {
    this.router.navigate(['dashboard/transactions/purchaserequisition']);
  }

}
