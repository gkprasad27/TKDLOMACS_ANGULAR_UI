import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
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
import { CommonService } from '../../../../services/common.service';
import { ApiConfigService } from '../../../../services/api-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../../../services/api.service';
import { SnackBar, StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertService } from 'src/app/services/alert.service';
import { Static } from 'src/app/enums/common/static';

@Component({
  selector: 'app-ctcbreakup',
  imports: [FormsModule, NgClass, ReactiveFormsModule, TranslateModule, TypeaheadModule, MatInputModule, MatTableModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './ctcbreakup.component.html',
  styleUrls: ['./ctcbreakup.component.scss'],
  providers: [DatePipe]
})
export class CTCBreakupComponent implements OnInit {
  structure: any;
  ctc: any;
  modelFormData: FormGroup;
  // PfList: any;
  // PtList: any;
  filteredOptions: any;
  displayedColumns: string[] = ['id', 'text', 'EarnDednAmount', 'duration', 'specificMonth'];
  GetEmployeeListArray: any[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  formData: any;
  routeEdit = '';

  isSubmitted = false;

  componentList: any[] = [];
  cTCListBYEMP: any[] = [];
  get formControls() { return this.modelFormData.controls; }

  constructor(
    private formBuilder: FormBuilder,
    public commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<CTCBreakupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    // public dialogRef: MatDialogRef<CTCBreakupComponent>,
  ) {
    this.modelFormData = this.formBuilder.group({
      empCode: [null],
      empCodeName: [null, Validators.required],
      effectFrom: [null, Validators.required],
      // pfType: [null, Validators.required],
      // ptSlab: [null, Validators.required],
      id: 0,
      // ctc: [null, Validators.required],
    });
    this.modelFormData.controls['id'].disable();

    this.formData = { ...this.data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.patchValue({ empCodeName: this.formData.item.empCode + ' - ' + this.formData.item.employeeName });
    }
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }

  }

  ngOnInit() {
    this.allApis();
  }

  allApis() {
    // const getctcpf = this.apiConfigService.getctcpf;
    // const getctcpt = this.apiConfigService.getctcpt;
    const getctcComponentsListUrl = this.apiConfigService.getPfComponentsList;
    const getCTCListBYEMP = [this.apiConfigService.getCTCListBYEMP, this.data?.item?.empCode].join('/');
    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        // this.apiService.apiGetRequest(getctcpf),
        // this.apiService.apiGetRequest(getctcpt),
        this.apiService.apiGetRequest(getctcComponentsListUrl),
        this.apiService.apiGetRequest(getCTCListBYEMP)
      ]).subscribe(([getctcComponentsList, cTCListBYEMP]) => {
        this.spinner.hide();

        // if (!this.commonService.checkNullOrUndefined(getctcpf) && getctcpf.status === StatusCodes.pass) {
        //   if (!this.commonService.checkNullOrUndefined(getctcpf.response)) {
        //     this.PfList = getctcpf.response['PFList'];
        //   }
        // }

        // if (!this.commonService.checkNullOrUndefined(getctcpt) && getctcpt.status === StatusCodes.pass) {
        //   if (!this.commonService.checkNullOrUndefined(getctcpt.response)) {
        //     this.PtList = getctcpt.response['PTList'];
        //   }
        // }

        // if (this.routeEdit) {
        //   this.getctcComponentsList();
        // }

        if (!this.commonService.checkNullOrUndefined(getctcComponentsList) && getctcComponentsList.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(getctcComponentsList.response)) {
            if (!this.commonService.checkNullOrUndefined(getctcComponentsList.response['ComponentList']) && getctcComponentsList.response['ComponentList'].length) {
              getctcComponentsList.response['ComponentList'].forEach(element => {
                element.earnDednAmount = 0;
                if (element.id === 'TKD_D01') {
                  element.esiAmount = 0.75;
                } else if (element.id === 'TKD_D03') {
                  element.pfAmount = 12;
                } else if (element.id === 'TKD_E02') {
                  element.earnDednAmount = 8710;
                }
              });
              getctcComponentsList.response['ComponentList'].push({ id: 'TKD_E06', text: 'Gross Salary', earnDednAmount: 0 });
              this.componentList = getctcComponentsList.response['ComponentList'];
              const arr = cTCListBYEMP?.response?.['ctcList'] || [];
              this.cTCListBYEMP = cTCListBYEMP?.response?.['ctcList'];
              if (this.data?.item && arr && arr.length) {
                this.componentList.forEach(c => {
                  const matchedComponent = arr.find((comp: any) => comp.earnDednCode.trim() == c.id);
                  if (matchedComponent) {
                    c.earnDednAmount = matchedComponent.earnDednAmount || 0;
                  }
                  if (c.id === 'TKD_D01' && c.earnDednAmount == 0) {
                    c.esiAmount = 0;
                  }
                });
              }
              this.calculatePfAmount();
            }
          }
        }


      });
    });
  }

  calculatePfAmount() {
    const da = this.componentList.find(c => c.id === 'TKD_E02');
    const basic = this.componentList.find(c => c.id === 'TKD_E01');
    const pf = this.componentList.find(c => c.id === 'TKD_D03');
    this.componentList.forEach((c: any, index: number) => {
      if (c.id === 'TKD_D03') {
        c.earnDednAmount = Math.round(((((+da.earnDednAmount || 0) + (+basic.earnDednAmount || 0)) * (pf.pfAmount || 0)) / 100));
      }
    });

    let grossAmount = 0;
    this.componentList.forEach(c => {
      if (c.id.includes('TKD_E') && c.id !== 'TKD_E06') {
        grossAmount += (+c.earnDednAmount) || 0;
      }
      if (c.id === 'TKD_E06') {
        c.earnDednAmount = grossAmount || 0;
      }
    });

    this.componentList.forEach((c: any, index: number) => {
      if (c.id === 'TKD_D03' && ((+da.earnDednAmount || 0) + (+basic.earnDednAmount || 0)) > 25000) {
        c.earnDednAmount = (25000 * 12) / 100;
      }
      if (c.id === 'TKD_D01') {
        if (grossAmount <= 21000) {
          const esi = this.componentList.find(c => c.id === 'TKD_D01');
          console.log(esi.esiAmount)
          c.earnDednAmount = Math.ceil((((+grossAmount) * (esi.esiAmount || 0)) / 100));
        } else {
          c.earnDednAmount = 0;
        }
      }
    });

    this.componentList.forEach((c: any, index: number) => {
      if (c.id === 'TKD_D05') {
        if (grossAmount <= 15000) {
          c.earnDednAmount = 0;
        } else if (grossAmount > 15000 && grossAmount <= 20000) {
          c.earnDednAmount = 150;
        } else if (grossAmount > 20000) {
          c.earnDednAmount = 200;
        }
      }
    });
    console.log(this.componentList);

  }

  getctcComponentsList() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    if (this.modelFormData.invalid) {
      return;
    }
    const getctcComponentsListUrl = this.apiConfigService.getPfComponentsList;
    this.apiService.apiGetRequest(getctcComponentsListUrl)
      .subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {

              const arr = res.response['ComponentList'];

              arr.forEach(element => {
                // if (element.text == "Basic") {
                //   element.EarnDednAmount = (((+this.modelFormData.value.ctc) * element.percentage) / 100);
                // }
                // if (element.text == "PF") {
                //   const obj = this.PfList.find((p: any) => p.pftypeName == this.modelFormData.value.pfType)
                //   if ((+this.modelFormData.value.ctc) / 12 < obj.amount) {
                //     element.EarnDednAmount = (((+this.modelFormData.value.ctc) * obj.employeeContribution) / 100);
                //   } else {
                //     // const obj = this.PfList.find((p: any) => p.pfName == this.modelFormData.value.pfType)
                //     element.EarnDednAmount = (12 * ((+obj.amount) * obj.employeeContribution) / 100);
                //   }
                // }
                // if (element.text == "Employer PF") {
                //   const obj = this.PfList.find((p: any) => p.pfName == this.modelFormData.value.pfType)
                //   if ((+this.modelFormData.value.ctc) / 12 < obj.amount) {
                //     element.EarnDednAmount = (((+this.modelFormData.value.ctc) * obj.employerContribution) / 100);
                //   }
                //   else {
                //     // const obj = this.PfList.find((p: any) => p.pfName == this.modelFormData.value.pfType)
                //     element.EarnDednAmount = (12 * ((+obj.amount) * obj.employerContribution) / 100);
                //   }
                // }
                // if (element.id == "TKD_D05") {
                //   const obj = this.PtList.find((p: any) => p.text == this.modelFormData.value.ptSlab)
                //   if ((+this.modelFormData.value.ctc) / 12 < obj.ptLowerLimit) {
                //     element.EarnDednAmount = 0;
                //   }
                //   else {
                //     element.EarnDednAmount = (12 * obj.ptAmt);
                //   }
                // }
                // if (element.text == "ESI") {

                //   if ((+this.modelFormData.value.ctc) / 12 < element.amount) {
                //     element.EarnDednAmount = (((+this.modelFormData.value.ctc) * element.percentage) / 100);
                //   } else {
                //     element.EarnDednAmount = 0;
                //   }
                // }
                // if (element.text == "Employer ESI") {

                //   if ((+this.modelFormData.value.ctc) / 12 < element.amount) {
                //     element.EarnDednAmount = (((+this.modelFormData.value.ctc) * element.percentage) / 100);
                //   } else {
                //     element.EarnDednAmount = 0;
                //   }
                // }
                // if (element.text == "ESI") {
                //   if ((((+this.modelFormData.value.ctc) * element.percentage) / 100) / 12 < element.amount) {
                //     element.EarnDednAmount =  (((+this.modelFormData.value.ctc) * element.percentage) / 100);
                //   } else {
                //     element.EarnDednAmount = 0;
                //   }
                // }
              });

              this.dataSource = new MatTableDataSource(res.response['ComponentList']);
              this.dataSource.paginator = this.paginator;

            }
          }
          this.spinner.hide();
        });
  }

  getctcEmployeeList(empCode: string) {
    if (!this.commonService.checkNullOrUndefined(empCode) && empCode !== '') {
      const getctcEmployeeListUrl = [this.apiConfigService.getEmployee, empCode].join('/');
      this.apiService.apiGetRequest(getctcEmployeeListUrl).subscribe(
        response => {
          const res = response;
          if (!this.commonService.checkNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!this.commonService.checkNullOrUndefined(res.response)) {
              if (!this.commonService.checkNullOrUndefined(res.response['EmployeeList']) && res.response['EmployeeList'].length) {
                res.response['EmployeeList'].forEach((a: any) => {
                  a.display = a.id + ' - ' + a.text;
                });
                this.GetEmployeeListArray = res.response['EmployeeList'];
              } else {
                this.GetEmployeeListArray = [];
              }
            }
            this.spinner.hide();
          }
        });
    } else {
      this.GetEmployeeListArray = [];
    }
  }

  selectempcode(event: any) {
    const empCode = this.modelFormData.get('empCode').value;
    const value = (event?.value || event?.target?.value)?.split(' -')[0];
    const lname = this.GetEmployeeListArray.find(lCode => lCode.id == value);
    this.modelFormData.patchValue({
      empCode: lname ? lname.id : null,
    });
    if (!lname) {
      this.modelFormData.patchValue({
        empCode: '',
        empCodeName: ''
      });
      this.alertService.openSnackBar(`Please select Employee Code`, Static.Close, SnackBar.error);
      return;
    } else {
      // this.modelFormData.patchValue({
      //   empCodeName: this.modelFormData.get('id').value + ' - ' + this.modelFormData.get('text').value
      // });
    }
  }


  save() {
    this.isSubmitted = true;

    if (this.modelFormData.invalid) {
      this.modelFormData.markAllAsTouched();
      return;
    }
    const arr = JSON.parse(JSON.stringify(this.componentList));
    arr.forEach((a: any) => {
      const obj = this.cTCListBYEMP.find((c: any) => c.earnDednCode.trim() == a.id);
      a.id = obj.id;
      a.earnDednCode = obj.earnDednCode.trim();
    })
    
    // const arr = this.dataSource.data.filter((d: any) => d.EarnDednAmount !== undefined && d.EarnDednAmount !== null);
    const obj = {
      item: {
        structure: {
          // structureName: this.modelFormData.value.structureName,
          // ctc: this.modelFormData.value.ctc,
          empcode: this.modelFormData.value.empCode,
          effectfrom: this.modelFormData.value.effectFrom ? this.datepipe.transform(this.modelFormData.value.effectFrom, 'yyyy-MM-dd') : '',
          id: this.modelFormData.value.id,
          // pftype: this.modelFormData.value.pfType,
          // ptslab: this.modelFormData.value.ptSlab
        },
        components: arr
      }
    }
    this.formData.item = obj.item;
    // this.addOrEditService[this.formData.action](obj, (res) => {
    //   if (res) {
    //     this.router.navigate(['/dashboard/master/CTCBreakup']);
    //   }
    // });
    this.dialogRef.close(this.formData);
  }
  cancel() {
    // this.router.navigate(['dashboard/master/CTCBreakup'])
    this.dialogRef.close();
  }

}
