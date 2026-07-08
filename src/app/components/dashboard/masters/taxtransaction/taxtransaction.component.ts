import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { StatusCodes } from '../../../../enums/common/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../../services/api.service';
import { ApiConfigService } from '../../../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-taxtransaction',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './taxtransaction.component.html',
  styleUrls: ['./taxtransaction.component.scss']
})

export class TaxTransactionComponent implements OnInit {

  modelFormData: FormGroup;
  formData: any;
  // spinner: any;
  taxTypelist: any;


  constructor(private commonService: CommonService,
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TaxTransactionComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      taxType: [null],

    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }
  }

  ngOnInit() {
    this.GetTaxTypeList();
  }

  get formControls() { return this.modelFormData.controls; }

  GetTaxTypeList() {
    const getTypeList = this.apiConfigService.getTaxTypesList;
    this.apiService.apiGetRequest(getTypeList)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              this.taxTypelist = res.response['TaxtypesList'];
            }
          }
          this.spinner.hide();
        });
  }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['code'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
    if (this.formData.action == 'Edit') {
      this.modelFormData.controls['code'].disable();
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}