import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';

import { ApiConfigService } from '../../../../services/api-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

interface Month {
  value: string;
  viewValue: string;
}

interface Year {
  value: string;
  viewValue: string;
}

@Component({ 
    selector: 'app-salaryprocess',
    templateUrl: './salaryprocess.component.html',
    styleUrls: ['./salaryprocess.component.scss'],
    standalone: true,
    imports: [
      /* material + forms + translate for this component */
      SharedImportModule,
      TranslateModule
    ]
})
export class SalaryProcessComponent implements OnInit {

  modelFormData: UntypedFormGroup;
  
  displayedColumns: string[] = ['branchCode'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  month : Month[]=
  [
    { value: '01', viewValue: 'Jan' },
    { value: '02', viewValue: 'Feb' },
    { value: '03', viewValue: 'Mar' },
    { value: '04', viewValue: 'Apr' },
    { value: '05', viewValue: 'May' },
    { value: '06', viewValue: 'June' },
    { value: '07', viewValue: 'July' },
    { value: '08', viewValue: 'Aug' },
    { value: '09', viewValue: 'Sep' },
    { value: '10', viewValue: 'Oct' },
    { value: '11', viewValue: 'Nov' },
    { value: '12', viewValue: 'Dec' }
  ];

  year : Year[]=
  [
    { value: '2020', viewValue: '2020' },
    { value: '2021', viewValue: '2021' },
    { value: '2022', viewValue: '2022' },
    { value: '2023', viewValue: '2023' },
    { value: '2024', viewValue: '2024' }
  ];
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,

  ) {

    this.modelFormData = this.formBuilder.group({
      emp_Code: [''],
      sal_Month: [''],
      sal_Year: ['']
    });
  }

  checkDates(group: UntypedFormGroup) {
    if(group.controls.formDate.value < group.controls.toDate.value) {
      return { notValid:true }
    }
    return null;
  }

  ngOnInit() {
  }
  
 cancel() {

  }

  save() {
    
  }

}
