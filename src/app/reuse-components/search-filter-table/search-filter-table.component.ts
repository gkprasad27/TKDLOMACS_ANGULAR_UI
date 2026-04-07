import { Component, Inject, Optional, OnInit, OnChanges, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';

import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({ 
    selector: 'app-search-filter-table',
    templateUrl: './search-filter-table.component.html',
    styleUrls: ['./search-filter-table.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class SearchFilterTableComponent implements OnInit, OnChanges, AfterViewInit {

  /** control for the selected bank for multi-selection */
  public tableMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public tableMultiFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredTableMulti: ReplaySubject<any> = new ReplaySubject<any>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected onDestroy = new Subject<void>();


  tableData: any;
  keys = [];
  // form: FormGroup;
  columnDefinitions = [];



  constructor(
    public dialogRef: MatDialogRef<SearchFilterTableComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    ) {
    let searchData = { ...data };
    this.tableData = searchData['data'];
    this.columnDefinitions = searchData['col'];
    console.log(this.columnDefinitions);
  }


  ngOnInit() {

    if (this.tableData != null) {

      // tslint:disable-next-line:forin
      // for (const key in this.tableData[0]) {
      //   this.keys.push({ col: key });
      // }

      // const group = {};
      // this.keys.forEach(cols => {
      //   group[cols.col] = new FormControl(false);
      // });

      // this.form = new FormGroup(group);

      // this.keys.forEach(cols => {
      //   const obj = {
      //     def: cols.col, label: cols.col, hide: true
      //   };
      //   this.columnDefinitions.push(obj);
      // });
    }

    console.log(this.columnDefinitions);

    if (this.tableData != null) {
      this.filteredTableMulti.next(this.columnDefinitions.slice());

      this.tableMultiFilterCtrl.valueChanges
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          this.filterBanksMulti();
        });

    }

  }

  ngAfterViewInit() {
    this.multiSelect.open();
    this.cdr.detectChanges()
  }

  protected filterBanksMulti() {
    if (!this.columnDefinitions) {
      return;
    }
    // get the search keyword
    let search = this.tableMultiFilterCtrl.value;
    if (!search) {
      this.filteredTableMulti.next(this.columnDefinitions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredTableMulti.next(
      this.columnDefinitions.filter(bank => bank.def.toLowerCase().indexOf(search) > -1)
    );
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

  checkboxCheck(index) {
    console.log(this.columnDefinitions[index]);

    this.columnDefinitions[index].hide = !this.columnDefinitions[index].hide;
  }

  saveChanges() {
    // for (let cd = 0; cd < this.keys.length; cd++) {
    //   this.columnDefinitions[cd].hide = this.form.get(this.keys[cd].col).value;
    // }
    this.dialogRef.close(this.columnDefinitions);
  }


  ngOnChanges() {



  }

}
