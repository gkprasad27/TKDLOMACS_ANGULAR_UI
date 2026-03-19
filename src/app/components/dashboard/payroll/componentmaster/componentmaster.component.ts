import { Component, Inject, Optional, OnInit } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../../../enums/common/common';
import { CommonService } from '../../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';



interface specificMonth {
  value: string;
  viewValue: string;
}
interface duration {
  value: string;
  viewValue: string;
}
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-componentmaster',
    templateUrl: './componentmaster.component.html',
    styleUrls: ['./componentmaster.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class ComponentMasterComponent  implements OnInit {

  modelFormData: UntypedFormGroup;
  isSubmitted  =  false;
  formData: any;
  configureList: any;

  duration: duration[] =
    [
      { value: 'Quarterly ', viewValue: 'Quarterly ' },
      { value: 'Half-Yearly ', viewValue: 'Half-Yearly ' },
      { value: 'Annually', viewValue: 'Annually' }
    ];

  months: specificMonth[] =
    [
      { value: 'January', viewValue: 'January' },
      { value: 'February', viewValue: 'February' },
      { value: 'March', viewValue: 'March' },
      { value: 'April', viewValue: 'April' },
      { value: 'May', viewValue: 'May' },
      { value: 'June', viewValue: 'June' },
      { value: 'July', viewValue: 'July' },
      { value: 'August', viewValue: 'August' },
      { value: 'September', viewValue: 'September' },
      { value: 'Octomber', viewValue: 'Octomber' },
      { value: 'November', viewValue: 'November' },
      { value: 'December', viewValue: 'December' }

    ];
  constructor(
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ComponentMasterComponent>,
    private commonService:CommonService,
    private spinner: NgxSpinnerService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.modelFormData  =  this.formBuilder.group({
        componentCode: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        componentName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        componentType: [null],
        active: [null],
        remarks: [null],
        companyCode: [null],
        amount: [null],
        percentage: [null],
        duration: [null],
        specificMonth: [null]
      });


      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
        this.modelFormData.controls['componentCode'].disable();
      }

  }

  ngOnInit() {
this.getConfigurationList();
  }

  getConfigurationList() {
    const getConfigurationList = [this.apiConfigService.getConfigurationList].join('/');
    this.apiService.apiGetRequest(getConfigurationList)
      .subscribe(
        response => {
        const res = response.body;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.configureList = res.response['ConfigurationList'];
          }
        }
        this.spinner.hide();
      });
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['componentCode'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
