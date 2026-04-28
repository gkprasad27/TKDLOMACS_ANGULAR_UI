import { Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { ApiService } from '../../../../../services/api.service';
import { AlertService } from '../../../../../services/alert.service';

import { StatusCodes, SnackBar } from 'src/app/enums/common/common';
import { debug } from 'console';
import { CommonService } from '../../../../../services/common.service';

interface giftIsActive {
  value: string;
  viewValue: string;
}

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { TableComponent } from 'src/app/reuse-components/table/table.component';

@Component({
  selector: 'gift-master',
  templateUrl: './giftmaster.component.html',
  styleUrls: ['giftmaster.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, TableComponent]
})
export class GiftMasterComponent implements OnInit, OnChanges {
  modelFromData: FormGroup;
  productList: any = [];

  isFormEdit: boolean = false;
  isGiftmaster = true;
  formData: any;
  isFormVisible: boolean = true;
  gifttableDataList: any;
  statusList: giftIsActive[] = [{ value: "true", viewValue: "Active" }, { value: "false", viewValue: "InActive" }];
  yearArr: number[] = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];

  @Input()
  membercode: any;



  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private fromBuilder: UntypedFormBuilder,
    private commonService: CommonService,
  ) {

    this.modelFromData = this.fromBuilder.group({
      memberCode: [null],
      giftId: [0],
      status: [Boolean],
      issueDate: [null],
      description: [null],
      editWho: [null],
      addWho: [null],
      editDate: [null],
      addDate: [null],
      year: [Number],
      giftName: [null]
    });

  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  ngOnInit(): void {
    this.getGiftProductList();
    this.setDefualts();
    this.getGiftList(this.membercode);
  }

  setDefualts() {
    let d = new Date();
    this.modelFromData.controls["issueDate"].setValue(d);
    this.modelFromData.controls["year"].setValue(d.getFullYear());
    this.modelFromData.controls["memberCode"].setValue(this.membercode);
    this.modelFromData.controls["status"].setValue(true);

  }

  getGiftProductList() {
    this.apiService.apiGetRequest(this.apiConfigService.getGiftProductList)
      .subscribe(
        response => {

          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res.response != null) {
              //console.log(res);
              this.productList = res.response['giftProduct'];
            }
          }
          this.spinner.hide();
        }
      );
  }

  onSelectionChange(event) {
    let selectedProduct = this.productList.find((x) => x.text == event.value);
    this.modelFromData.controls['giftId'].patchValue(selectedProduct.id);
  }

  getGiftList(memberCode: any) {
    this.gifttableDataList = null;
    this.apiService.apiGetRequest(this.apiConfigService.getGiftList + '/' + this.membercode)
      .subscribe(
        response => {
          const res = response;
          if (res != null && res.status === StatusCodes.pass) {
            if (res?.response != null) {
              this.gifttableDataList = res.response["gifts"];
            }
          }
        }, error => {
          this.spinner.hide();
        }
      );
  }
  addOrUpdateEvent(value) {

    if (value.action == 'Edit') {

      this.formData = value.item;
      if (this.formData != null) {
        this.modelFromData.patchValue(this.formData);
        // this.modelFromData.controls['giftId'].disable();
        this.modelFromData.controls["giftId"].setValue(this.formData.giftId);
        this.isFormEdit = true;
      }
    }
    this.isFormVisible = true;
  }

  save() {

    if (this.modelFromData.invalid) {
      return;
    }
    this.modelFromData.controls["memberCode"].setValue(this.membercode);
    if (!this.isFormEdit) {
      this.modelFromData.patchValue({
        issueDate: this.commonService.formatDate(this.modelFromData.get('issueDate').value)
      });
      this.apiService.apiPostRequest(this.apiConfigService.addGift, this.modelFromData.value)
        .subscribe(
          response => {
            const res = response;
            if (res != null && res.status === StatusCodes.pass) {
              if (res.response != null) {
                this.alertService.openSnackBar('Record Added...', 'close', SnackBar.success);
                this.reset();
                this.getGiftList(this.membercode);
              }
            }
            this.spinner.hide();
          }
        );

      this.isFormEdit = false;
    }
    else {
      this.modelFromData.patchValue({
        issueDate: this.commonService.formatDate(this.modelFromData.get('issueDate').value)
      });
      this.apiService.apiPostRequest(this.apiConfigService.updateGift, this.modelFromData.value)
        .subscribe(
          response => {
            const res = response;
            if (res != null && res.status === StatusCodes.pass) {
              if (res.response != null) {
                this.alertService.openSnackBar('Record Updated successfully', 'close', SnackBar.success);
                this.reset();
                this.getGiftList(this.membercode);
              }
            }
            this.spinner.hide();

          }
        );
    }

  }

  reset() {
    this.modelFromData.reset();
    this.setDefualts();
    this.isFormVisible = false;
  }
}
