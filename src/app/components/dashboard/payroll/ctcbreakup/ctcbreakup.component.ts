import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';

import { ApiConfigService } from '../../../../services/api-config.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../services/api.service';
import { StatusCodes } from '../../../../enums/common/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({ 
  selector: 'app-ctcbreakup',
  templateUrl: './ctcbreakup.component.html',
  styleUrls: ['./ctcbreakup.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class CTCBreakupComponent implements OnInit {
  modelFormData: FormGroup;
  structureList:any;
  filteredOptions:any;
  displayedColumns: string[] = ['componentCode','componentName','amount','duration','specificMonth'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
  ) {
    this.modelFormData = this.formBuilder.group({
      myControl: [null],
      effectFrom: [null],
      structureName: [null],
      ctc: [null]
    });

   }

  ngOnInit() {
    this.getStructureList();
    this.getctcComponentsList();
  }

  getStructureList() {
    const getStructureList = [this.apiConfigService.getStructureList].join('/');
    this.apiService.apiGetRequest(getStructureList)
      .subscribe(
        response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.structureList = res.response['ComponentsList'];
          }
        }
        this.spinner.hide();
      });
  }

  getctcComponentsList() {
    const getctcComponentsListUrl = [this.apiConfigService.getctcComponentsList].join('/');
    this.apiService.apiGetRequest(getctcComponentsListUrl)
      .subscribe(
        response => {
        const res = response;
        if (res != null && res.status === StatusCodes.pass) {
          if (res.response != null) {
            this.dataSource = new MatTableDataSource(res.response['componentsList']);
            this.dataSource.paginator = this.paginator;
          }
        }
        this.spinner.hide();
      });
  }

  save() {
    
  }
}
