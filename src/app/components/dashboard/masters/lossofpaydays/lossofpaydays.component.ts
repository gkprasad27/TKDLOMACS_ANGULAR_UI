import { Component, Inject, Optional, OnInit } from '@angular/core';

import { ApiService } from '../../../../services/api.service';

import { AlertService } from '../../../../services/alert.service';

import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { StatusCodes } from '../../../../enums/common/common';
import { CommonService } from '../../../../services/common.service';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

interface specificMonth {
  value: string;
  viewValue: string;
}

@Component({ 
    selector: 'app-lossofpaydays',
    templateUrl: './lossofpaydays.component.html',
    styleUrls: ['./lossofpaydays.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class LossOfPayDaysComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted  =  false;
  formData: any;
  employeeList: any;


  months: specificMonth[] =
    [
      { value: '01', viewValue: 'January' },
      { value: '02', viewValue: 'February' },
      { value: '03', viewValue: 'March' },
      { value: '04', viewValue: 'April' },
      { value: '05', viewValue: 'May' },
      { value: '06', viewValue: 'June' },
      { value: '07', viewValue: 'July' },
      { value: '08', viewValue: 'August' },
      { value: '09', viewValue: 'September' },
      { value: '10', viewValue: 'Octomber' },
      { value: '11', viewValue: 'November' },
      { value: '12', viewValue: 'December' }
    ];

  days: specificMonth[] =
    [
      { value: '01', viewValue: '01' },
      { value: '02', viewValue: '02' },
      { value: '03', viewValue: '03' },
      { value: '04', viewValue: '04' },
      { value: '05', viewValue: '05' },
      { value: '06', viewValue: '06' },
      { value: '07', viewValue: '07' },
      { value: '08', viewValue: '08' },
      { value: '09', viewValue: '09' },
      { value: '10', viewValue: '10' },
      { value: '11', viewValue: '11' },
      { value: '12', viewValue: '12' },
      { value: '13', viewValue: '13' },
      { value: '14', viewValue: '14' },
      { value: '15', viewValue: '15' },
      { value: '16', viewValue: '16' },
      { value: '17', viewValue: '17' },
      { value: '18', viewValue: '18' },
      { value: '19', viewValue: '19' },
      { value: '20', viewValue: '20' },
      { value: '21', viewValue: '21' },
      { value: '22', viewValue: '22' },
      { value: '23', viewValue: '23' },
      { value: '24', viewValue: '24' },
      { value: '25', viewValue: '25' },
      { value: '26', viewValue: '26' },
      { value: '27', viewValue: '27' },
      { value: '28', viewValue: '28' },
      { value: '29', viewValue: '29' },
      { value: '30', viewValue: '30' },
      { value: '31', viewValue: '31' }
    ];
    
  yearArr: number[] = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];


  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<LossOfPayDaysComponent>,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

    this.modelFormData = this.formBuilder.group({
      id: 0,
      empCode: 0,
      empName: [null],
      month: [null],
      year: [null],
      days: [null],
      remarks: [null],
      });

      this.formData = {...data};
      if (this.formData.item != null) {
        this.modelFormData.patchValue(this.formData.item);
       this.modelFormData.controls['id'].disable();
      }

  }

  ngOnInit() {
    this.getEmployeesListLOP();
  }

  getEmployeesListLOP() {
    const getEmployeesListLOP = this.apiConfigService.getEmployeesListLOP;
    this.apiService.apiGetRequest(getEmployeesListLOP)
      .subscribe(
        response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            console.log(res);
            this.employeeList = res.response['EmployeeList'];
          }
        }
          this.spinner.hide();
      });
  }

  onEmpChange(event: any) {
    const selectedEmp = this.employeeList.find((emp: any) => emp.id === event.value);
    if (selectedEmp) {
      this.modelFormData.patchValue({
        empName: selectedEmp.text
      });
    }
  }


  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['id'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}

