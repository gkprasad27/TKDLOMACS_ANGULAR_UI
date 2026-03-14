
import {
  Component, OnInit, ViewChild, Input, OnChanges,
  ChangeDetectorRef, Output, EventEmitter,Optional,Inject, AfterViewInit, OnDestroy
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';

import { ActivatedRoute } from '@angular/router';
import { DeleteItemComponent } from '../delete-item/delete-item.component';
import { SearchFilterTableComponent } from '../search-filter-table/search-filter-table.component';
import { UntypedFormGroup, UntypedFormControl, AbstractControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { User } from '../../models/common/user';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({ 
    selector: 'app-reports-inner-table',
    templateUrl: './reports-inner-table.component.html',
    styleUrls: ['./reports-inner-table.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class ReportsInnerTableComponent  {

  public tableMultiCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredTableMulti: ReplaySubject<any> = new ReplaySubject<any>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected onDestroy = new Subject<void>();

  dateForm: UntypedFormGroup;
  tableData: any;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  highlightedRows = [];
  columnDefinitions = [];
  filterColData = [];

  keys = [];
  user: User;
  routeParam: any;
  excelUrl: any;
  CsvUrl: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private commonService: CommonService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ReportsInnerTableComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.routeParam = data.reportName;
      this.tableData=data.gridData;
      console.log(this.tableData)
      if (this.tableData != null) {
        if (this.tableData.length > 0) {
          this.dataSource = new MatTableDataSource(this.tableData);
        }
      }

      
    if ((this.tableData != null) && this.tableData.length > 0) {

      // tslint:disable-next-line:forin
      for (const key in this.tableData[0]) {
        this.keys.push({ col: key });
      }

      this.keys.forEach(cols => {
        const obj = {
          def: cols.col, label: cols.col, hide: true
        };
        this.columnDefinitions.push(obj);
      });
    }

    console.log(this.columnDefinitions, this.tableData)

    if (this.dataSource != null) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  }
  checkDates(group: UntypedFormGroup) {
    if (group.controls.formDate.value < group.controls.toDate.value) {
      return { notValid: true }
    }
    return null;
  }
  defaultValues() {
    this.dataSource = new MatTableDataSource();
    this.highlightedRows=[];
    this.columnDefinitions = [];
    this.keys = [];
    this.filterColData = [];
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  checkboxCheck(index) {

    this.filterColData[index] = {
      def: this.filterColData[index].def,
      label: this.filterColData[index].label, hide: !this.filterColData[index].hide
    };

  }
  saveChanges() {
    this.columnDefinitions = this.filterColData.slice(0);
    this.filterColData = [];
  }
  getDisplayedColumns(): string[] {
    if (this.tableData != null) {
      return this.columnDefinitions.filter(cd => cd.hide).map(cd => cd.def);
    }
  }
  toggleSelectAll(selectAllValue: boolean) {
    this.filteredTableMulti.pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.tableMultiCtrl.patchValue(val);
        } else {
          this.tableMultiCtrl.patchValue([]);
        }
      });
  }
  exportToExcel(): void {
    let columns = [];
    for (const key in this.tableData[0]) {
      columns.push(key);
    }
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Report', {
      pageSetup: { fitToPage: true, paperSize: 11, orientation: 'landscape' }
    });
    //Add Row and formatting
    let titleRow = worksheet.addRow([this.routeParam + ' Report']);
    titleRow.font = { name: 'Calibri', family: 4, size: 16, underline: 'single', bold: true }
    titleRow.alignment = { horizontal: 'center' }
    worksheet.mergeCells(1, 1, 2, columns.length);
    worksheet.addRow([]);

    let headerRows = [];
    for (var i: number = 0; i < this.data.headerData.length; i++) {
      headerRows[i] = [];
      let j = 0;
      for (const key in this.data.headerData[0]) {
        headerRows[i][j] = this.data.headerData[i][key];
        j++;
      }
    }

    headerRows.forEach(d => {
      let row = worksheet.addRow(d);
    });
    
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row

    let headerRow = worksheet.addRow(columns);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        cell.font = { bold: true }
    })
    worksheet.columns.forEach(col => {
      col.width = 20;
    }

    )
    let rows = [];
    for (var i: number = 0; i < this.dataSource.filteredData.length; i++) {
      rows[i] = [];
      let j = 0;
      for (const key in this.tableData[0]) {
        rows[i][j] = this.dataSource.filteredData[i][key];
        j++;
      }
    }
    rows.forEach(d => {
      let row = worksheet.addRow(d);
    });
    worksheet.addRow([]);
    //Adding footer Rows
    let footerRows = [];
    for (var i: number = 0; i < this.data.footerData.length; i++) {
      footerRows[i] = [];
      let j = 0;
      for (const key in this.data.footerData[0]) {
        footerRows[i][j] = this.data.footerData[i][key];
        j++;
      }
    }

    footerRows.forEach(d => {
      let row = worksheet.addRow(d);
    });
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.routeParam + 'Report.xlsx');
    });
  }
  
  exportToPdf() {
    let doc = new jsPDF('p', 'mm', 'a4');
    let columns = []; //["ID", "Name", "Country"];
    for (const key in this.tableData[0]) {
      columns.push(key);
    }
    let rows = [];
    for (var i: number = 0; i < this.dataSource.filteredData.length; i++) {
      rows[i] = [];
      let j = 0;
      for (const key in this.tableData[0]) {
        rows[i][j] = this.dataSource.filteredData[i][key];
        j++;
      }
    }
    autoTable(doc, {
      body: [
        [{ content: this.routeParam + ' Report', colSpan: 2, rowSpan: 2, styles: { halign: 'center', fontStyle: 'bold' } }],
      ],
      theme: 'plain'
    });
    let pipe = new DatePipe('en-US');
    let currentDate = new Date();

    let headerRows = [];
    for (var i: number = 0; i < this.data.headerData.length; i++) {
      headerRows[i] = [];
      let j = 0;
      for (const key in this.data.headerData[0]) {
        headerRows[i][j] = this.data.headerData[i][key];
        j++;
      }
    }
    autoTable(doc, {
      margin: { top: 10 },
      body:headerRows,
      theme: 'plain'
    })
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: (doc as any).lastAutoTable.finalY + 5
    });
    let footerRows = [];
    for (var i: number = 0; i < this.data.footerData.length; i++) {
      footerRows[i] = [];
      let j = 0;
      for (const key in this.data.footerData[0]) {
        footerRows[i][j] = this.data.footerData[i][key];
        j++;
      }
    }
    autoTable(doc, {
      body:footerRows,
      theme: 'plain',
      startY: (doc as any).lastAutoTable.finalY + 10
    })
    doc.save(this.routeParam + 'Report.pdf');
  }

  ngOnDestroy() {
    this.tableData = [];
  }


}
