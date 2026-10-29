import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
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
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, TypeaheadModule, MatInputModule, MatTableModule, MatFormFieldModule, MatCardModule, MatTabsModule, MatDividerModule, MatSelectModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './ctcbreakup.component.html',
  styleUrls: ['./ctcbreakup.component.scss'],
  providers: [DatePipe]
})
export class CTCBreakupComponent implements OnInit {
  structure: any;
  ctc: any;
  modelFormData: FormGroup;
  PfList: any;
  PtList: any;
  filteredOptions: any;
  displayedColumns: string[] = ['id', 'text', 'EarnDednAmount', 'duration', 'specificMonth'];
  GetEmployeeListArray: any[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  formData: any;
  routeEdit = '';

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
    let obj = JSON.parse(localStorage.getItem("user"));
    this.modelFormData = this.formBuilder.group({
      empCode: [null],
      empCodeName: [null, Validators.required],
      effectFrom: [null, Validators.required],
      pfType: [null, Validators.required],
      ptSlab: [null, Validators.required],
      id: 0,
      ctc: [null, Validators.required],
    });
    this.modelFormData.controls['id'].disable();

    this.formData = { ...this.data };
    if (!this.commonService.checkNullOrUndefined(this.formData.item)) {
      this.modelFormData.patchValue(this.formData.item);
    }
    if (!this.commonService.checkNullOrUndefined(this.route.snapshot.params.value)) {
      this.routeEdit = this.route.snapshot.params.value;
    }

  }

  ngOnInit() {
    this.allApis();
  }

  allApis() {
    const getctcpf = this.apiConfigService.getctcpf;
    const getctcpt = this.apiConfigService.getctcpt;

    // Use forkJoin to run both APIs in parallel
    import('rxjs').then(rxjs => {
      rxjs.forkJoin([
        this.apiService.apiGetRequest(getctcpf),
        this.apiService.apiGetRequest(getctcpt),
      ]).subscribe(([getctcpf, getctcpt]) => {
        this.spinner.hide();

        if (!this.commonService.checkNullOrUndefined(getctcpf) && getctcpf.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(getctcpf.response)) {
            this.PfList = getctcpf.response['PFList'];
          }
        }

        if (!this.commonService.checkNullOrUndefined(getctcpt) && getctcpt.status === StatusCodes.pass) {
          if (!this.commonService.checkNullOrUndefined(getctcpt.response)) {
            this.PtList = getctcpt.response['PTList'];
          }
        }

        if (this.routeEdit) {
          this.getctcComponentsList();
        }

      });
    });
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
                if (element.id == "TKD_D05") {
                  const obj = this.PtList.find((p: any) => p.text == this.modelFormData.value.ptSlab)
                  if ((+this.modelFormData.value.ctc) / 12 < obj.ptLowerLimit) {
                    element.EarnDednAmount = 0;
                  }
                  else {
                    element.EarnDednAmount = (12 * obj.ptAmt);
                  }
                }
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
    const arr = this.dataSource.data.filter((d: any) => d.EarnDednAmount !== undefined && d.EarnDednAmount !== null);
    const obj = {
      item: {
        structure: {
          // structureName: this.modelFormData.value.structureName,
          ctc: this.modelFormData.value.ctc,
          empcode: this.modelFormData.value.empCode,
          effectfrom: this.modelFormData.value.effectFrom ? this.datepipe.transform(this.modelFormData.value.effectFrom, 'yyyy-MM-dd') : '',
          id: this.modelFormData.value.id,
          pftype: this.modelFormData.value.pfType,
          ptslab: this.modelFormData.value.ptSlab
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
