import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { ApiConfigService } from '../../../../services/api-config.service';

import { ApiService } from '../../../../services/api.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { AlertService } from '../../../../services/alert.service';
import { Static } from '../../../../enums/common/static';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({ 
  selector: 'app-purchase-requisition',
  templateUrl: './purchase-requisition.component.html',
  styleUrls: ['./purchase-requisition.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, TextFieldModule, TypeaheadModule]
})
export class PurchaseRequisitionComponent  implements OnInit {

  branchFormData: FormGroup;
  getBranchesListArray = [];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  getAccountLedgerListArray = [];
  getAccountLedgerListNameArray = [];
  getSalesBranchListArray = [];
  branchesList = [];
  getmemberNamesArray = [];

  //displayedColumns: string[] = ['productCode', 'productName', 'hsnNo', 'unitName', 'qty', 'availbleQtyinBranch','rate', 'grossAmount', 'availStock','batchNo', 'delete'
  //];

  displayedColumns: string[] = ['productCode', 'productName', 'qty', 'availbleQtyinBranch', 'availbleQtyinGowdown', 'approvedQty',  'delete'
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
        //receiptNo: [null],
        company: [null],
        branch: [null],
        requisitionNo: [null],
        requisitionDate: [(new Date()).toISOString()],
        id: '0',
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
  ngOnInit() {
    this.allApis();
  }

  allApis() {
    const getCompiniesListList = this.apiConfigService.getCompaniesList;
    const getCashPaymentBranchesListUrl = this.apiConfigService.getCashPaymentBranchesList;

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getCompiniesListList),
        this.apiService.apiGetRequest(getCashPaymentBranchesListUrl),
      ]).subscribe(([companiesList, branchesList]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(companiesList) && companiesList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(companiesList.response)) {
            this.compiniesList = companiesList.response['CompaniesList'];
            this.setBranchCode();
          }
        }

        if (!this.commonService.checkNullOrUndefined(branchesList) && branchesList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(branchesList.response)) {
            this.getBranchesListArray = branchesList.response['BranchesList'];
          }
        }

      });
    });

    this.activatedRoute.params.subscribe(params => {
      if (params.id1 != 'New') {
        this.routeUrl = params.id1;
        if (params.value != null) {
          this.getprreqDeatilList(params.value);
        }
      } else {
        this.addTableRow();
        // this.getCashPartyAccountList("100");
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.branchCode != null) {
          this.branchFormData.patchValue({
            branch: +user.branchCode,
            userId: user.seqId,
            userName: user.userName
          });
          this.branchFormData.patchValue({
            stateCode: '37',
            stateName: 'ANDHRA PRADESH'
          });
          // this.getCashPartyAccount();
          this.setBranchCode();
          this.genaratereceiptNo(user.branchCode);
          this.formGroup();
        }
      }
    });

  }

  setBranchCode() {
    //sebranch
    const bname = this.getBranchesListArray.filter(fromBranchCode => {
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
          }
          this.branchFormData.patchValue(res?.response?.PrreqMasterData);
        }
      });
  }

  //issueno code;
  genaratereceiptNo(branch?) {
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
    //debugger;
    const tableObj =
    {
      productCode: '', productName: '', qty: '', availbleQtyinBranch: '', availbleQtyinGowdown: '', approvedQty: '', delete: '', text: 'obj'
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
      AvailbleQtyinGowdown: [null],
      ApprovedQty: [null],
      availStock: [null],
      delete: [null],
    });
  }


  setToFormModel(text, column, value)
  {
   // debugger;
    //alert("hi");
    this.tableFormObj = true;
    if (text == 'obj')
    {
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


  getdata(productCode) {
    //debugger;set branch
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
  DetailsSection(obj)
  {
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
      if(val.qty == 0) {
        val.qty = '';
      }
      return val;
    });
    this.setToFormModel(null, null, null);
  }

  setProductName(name) {
    //debugger;
    this.tableFormData.patchValue
      ({
        productName: name.value
      });
    this.setToFormModel(null, null, null);
  }


  //Calaculating code
  //calculateAmount(row, index) {
  //  //debugger;
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
    //debugger;
    var index = this.dataSource.data.indexOf(1);
    this.dataSource.data.splice(index, 1);
    if (this.routeUrl != '') {
      return;
    }
    let availStock = this.dataSource.filteredData.filter(stock => {
      if (stock.availStock == 0 || ((stock.qty == null))) {
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

    this.registerpurreq();
  }

  registerpurreq() {
    debugger;
    const registerStackreceiptsUrl = [this.apiConfigService.registerPurchaserequisitionDetails].join('/');
    const requestObj = { PurreqHdr: this.branchFormData.value, PurreqDetail: this.dataSource.data };
    this.apiService.apiPostRequest(registerStackreceiptsUrl, requestObj).subscribe(
      response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.alertService.openSnackBar('PurchaseRequisition Created Successfully..', Static.Close, SnackBar.success);
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
   // this.gettingtobranches();
    this.branchFormData = this.formBuilder.group
      ({
        requisitionDate: [(new Date()).toISOString()],
        //fromBranchCode: (user.branchCode != null) ? user.branchCode : user.branchCode,
        branch: (user.branchCode != null) ? user.branchCode : user.branchCode,
        company: [null],
        requisitionNo: [null]
      });
   
    this.ngOnInit();
  }

}
