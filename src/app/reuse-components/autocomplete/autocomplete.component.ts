import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

import { ApiService } from '../../services/api.service';
import { StatusCodes } from '../../enums/common/common';
import { CommonService } from '../../services/common.service';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({ 
    selector: 'app-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class AutocompleteComponent implements OnInit {

  @Output() emitTypeAheadValue = new EventEmitter();

  @Input()
  set configData(value) {
    if (!value == null) {
      this.dataConfig = value;
      console.log(this.dataConfig);
    }
  }

  label: string;
  value: string;
  @Input() isDisabled: boolean;
  id: string;
  placeholder: string;
  dataConfig: any;


  @Input()
  set clearTypeAhead(value) {
    if (value) {
      // this.typeAhead['searchInput']['nativeElement'].value = '';
    }
  }

  @Input()
  set editTypeAhead(value) {
    // if (!this.appService.checkNullOrUndefined(value)) {
    //   this.typeAhead['searchInput']['nativeElement'].value = value;
    // }
  }


  // Autocomplete setup
  objectControl = new FormControl();
  filteredObjectOptions$: Observable<any>;

  constructor(
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.filteredObjectOptions$ = this.objectControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        map(val => {
          return this.filter(val || '');
        })
      );
    this.isDisabled ? this.objectControl.disable() : this.objectControl.enable()
  }

  // filter and return the values
  filter(value: string) {
    if (!value == null && value.length) {
      // const url = [this.dataConfig.url, value.trim()].join('/');
      const url = [this.dataConfig.url].join('/');
    return this.apiService.apiGetRequest(url)
      .pipe(map(r => r.json()))
      .subscribe(response => {          
        const res = response;
          this.spinner.hide();
          if (res != null && res.status === StatusCodes.pass) {
            return res.response[this.dataConfig.list];
          }
        });
    } else {
      return [];
    }
    // this.typeAhead.element.firstChild.classList.remove('required-red');
  }

  onItemSelect(item) {
    console.log(item)
    this.emitTypeAheadValue.emit(item);
  }

  // Display function for object options
  displayFn(user?): string | undefined {
    return user ? user : undefined;
  }

}
