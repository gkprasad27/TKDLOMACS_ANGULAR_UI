import { Component, Inject, Optional, OnInit } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from '../../../../services/alert.service';

import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { CommonService } from '../../../../services/common.service';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class ProductComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted  =  false;
  formData: any;
    tableData: any;
    tableUrl: any;
    getSupplierGroup: any;
    getProductGroup: any;
    getTaxApplicable:any;
    getProductPacking:any;
    getTaxGroup:any;
    getUnit:any;
    getTaxStructureList:any;
    getTaxListListArray:any;
    // isActive=true;


  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ProductComponent>,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        productId:0,
        hsnNo: [null, [Validators.required]],
        productName: [null, [Validators.required, Validators.minLength(2)]],
        productCode: [null,[Validators.required, Validators.minLength(2)]],
        cgst: [null],
        productGroupCode: [null,[Validators.required]],
        productGroupName: [null],
        packingCode: [null,[Validators.required]],
        igst: [null],
        sgst: [null],
        taxType: [null],
        ugst: [null],
        active: [null],
        packingName: [null],
        packingSize: [null],
        taxGroupCode: [null,[Validators.required]],
        taxGroupName:[null],
        unitId: [null],
        unitName:[null],
        mrp: [null],
        purchaseRate:[null],
        salesRate:[null,[Validators.required]],
        taxStructureCode:[null],
        taxapplicableOn:[null],
        totalPercentageGst: [null],
        totalGst:[null],
        supplierCode:[null],
        supplierName:[null,[Validators.required]],
        narration:[null],
        taxapplicableOnId:[null,[Validators.required]],
        isActive:[null]
      });

      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
        this.modelFormData.controls['productCode'].disable();
        this.getTaxGrouplist();
        this.getTaxStructure();
      }

  }

  ngOnInit()
  {
    this.getSupplierGroupList();
    this.getProductGroupList();
    this.getTaxApplicableList();
    this.getProductPackingList();
    this.getUnitList();
  }

  getSupplierGroupList() {
    const getSupplierGroupList = ['/', this.apiConfigService.getSupplierGroupList].join('/');
    this.apiService.apiGetRequest(getSupplierGroupList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.getSupplierGroup = res.response['SupplierGroupList'];
          }
        }
        this.spinner.hide();
      });
  }

        getTaxList() {
          const getTaxListUrl = ['/', this.apiConfigService.getTaxList,
            this.modelFormData.get('taxStructureCode').value].join('/');
          this.apiService.apiGetRequest(getTaxListUrl).subscribe(
            response => {
              const res = response.body;
              if (res != null && res.status === StatusCodes.pass) {
                if (res.response != null) {
                  if (res.response['TaxList'] != null) {
                    this.modelFormData.patchValue({
                      cgst: res.response['TaxList'][0]['cgst'],
                      sgst: res.response['TaxList'][0]['sgst'],
                      igst: res.response['TaxList'][0]['igst'],
                      totalGst:res.response['TaxList'][0]['totalGst']
                    });
                    this.spinner.hide();
                  }
                }
              }
            });
        }
    
  

  getProductGroupList() {
    const getProductGroupList = ['/', this.apiConfigService.getProductGroupList].join('/');
    this.apiService.apiGetRequest(getProductGroupList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.getProductGroup = res.response['ProductGroupList'];
          }
        }
        this.spinner.hide();
      });
  }

  getTaxApplicableList() {
    const getTaxApplicableList = ['/', this.apiConfigService.getTaxApplicableList].join('/');
    this.apiService.apiGetRequest(getTaxApplicableList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.getTaxApplicable = res.response['TaxApplicableList'];
          }
        }
        this.spinner.hide();
      });
  }

  getProductPackingList() {
    const getProductPackingList = ['/', this.apiConfigService.getProductPackingList].join('/');
    this.apiService.apiGetRequest(getProductPackingList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.getProductPacking = res.response['ProductPackingList'];
          }
        }
        this.spinner.hide();
      });
  }

  getTaxGrouplist(){
    const getTaxGrouplist=['/', this.apiConfigService.getTaxGrouplist,this.modelFormData.get('productGroupCode').value].join('/');
    this.apiService.apiGetRequest(getTaxGrouplist)
    .subscribe(
      response => {
      const res = response.body;
      if (res != null && res.status === StatusCodes.pass) {
        if (res.response != null) {
          console.log(res);
          this.getTaxGroup = res.response['TaxGroupList'];
        }
      }
      this.spinner.hide();
    });
  }

  getUnitList() {
    const getUnitList = ['/', this.apiConfigService.getUnitList].join('/');
    this.apiService.apiGetRequest(getUnitList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.getUnit = res.response['UnitList'];
          }
        }
        this.spinner.hide();
      });
  }

  getTaxStructure(){
    const getTaxStructure = ['/', this.apiConfigService.getTaxStructure,this.modelFormData.get('taxGroupCode').value].join('/');
    this.apiService.apiGetRequest(getTaxStructure)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.getTaxStructureList = res.response['TaxStructureCode'];
          }
        }
        this.spinner.hide();
      });
  }
  checkCheckBoxvalue(event){
     this.modelFormData.patchValue({
       isActive:event.checked
     })
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    // this.modelFormData.controls['productId'].enable();
    this.modelFormData.controls['productCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
    
  }

  cancel() {
    this.dialogRef.close();
  }

}

