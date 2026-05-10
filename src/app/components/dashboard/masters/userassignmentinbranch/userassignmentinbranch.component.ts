import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../services/api-config.service';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-userassignmentinbranch',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './userassignmentinbranch.component.html',
  styleUrl: './userassignmentinbranch.component.scss',
})
export class UserassignmentinbranchComponent {

  modelFormData: FormGroup;

  formData: any;

  employeesList: any[] = [];
  branchesList: any[] = [];

  constructor(private commonService: CommonService,
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserassignmentinbranchComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.modelFormData = this.formBuilder.group({
      userId: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
      branches: ['', [Validators.required]],
      branchName: [''],
    });

    this.formData = { ...data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({
        userId: this.formData.item?.userId?.toString()
      })
      this.modelFormData.controls['userId'].disable();
    }
  }

  ngOnInit() {
    this.allApis();
  }

  allApis() {
    const getEmployeeList = this.apiConfigService.getEmployeesList;
    const getBranchesListUrl = this.apiConfigService.getBillingBranchesList;

    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getEmployeeList),
        this.apiService.apiGetRequest(getBranchesListUrl)
      ]).subscribe(([employeeList, branchesList]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(employeeList) && employeeList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(employeeList.response)) {
            this.employeesList = employeeList.response['EmployeeList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(branchesList) && branchesList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(branchesList.response)) {
            this.branchesList = branchesList.response['BranchesList'];
            if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
              const selectedBranchIds = this.formData.item.branchName.split(';');
              const selectedBranchNames = this.branchesList.filter(branchids => selectedBranchIds.includes(branchids.id.toString())).map(branch => branch.text);
              this.modelFormData.patchValue({ branches: selectedBranchNames });
            }
          }
        }

      });
    });
  }

  get formControls() { return this.modelFormData.controls; }

  updateBranchs() {
    const list = this.modelFormData.value.branches;
    let branchids = '';
    list.forEach((element: any, index: number) => {
      const selectedBranch = this.branchesList.find(branch => branch.text === element);
      if (selectedBranch) {
        branchids += index != 0 ? ';' + selectedBranch.id : selectedBranch.id;
      }
    });
    this.modelFormData.patchValue({ branchName: branchids });
  }

  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['userId'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}