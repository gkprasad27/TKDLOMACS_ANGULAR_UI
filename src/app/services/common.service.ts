import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Event, NavigationEnd, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  appDrawer: any;
  parentItem: any;
  currentUrl = new BehaviorSubject<string>(undefined);
  selectedInput: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  showNavbar = new BehaviorSubject<boolean>(null);

  constructor(
    private router: Router,
    public translate: TranslateService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  getLangConfig(): any {
    this.http.get('../../assets/app-lang-config.json').subscribe(
      data => {
        const langConfig = data;
        localStorage.setItem('langConfig', JSON.stringify(langConfig));
        this.languageConfig();
      },
      (error: HttpErrorResponse) => {
        // this.toastr.error("Failed to load language config data");
      }
    );
  }

  languageConfig() {
    const languageConfiguration: any = JSON.parse(localStorage.getItem('langConfig'));
    if ((languageConfiguration != null)) {
      this.translate.addLangs(languageConfiguration.langagues);
      this.translate.setDefaultLang('english');
      if (localStorage.getItem('defaultLang')) {
        this.translate.use(localStorage.getItem('defaultLang'));
      } else {
        const browserLang = this.translate.getBrowserLang();
        const defaultLang = browserLang.match(/english|telugu|hindi/) ? browserLang : 'english';
        localStorage.setItem('defaultLang', defaultLang);
        this.translate.use(localStorage.getItem('defaultLang'));
      }
    }

  }


  formatDate(event) {
    const time = new Date();
    // tslint:disable-next-line: one-variable-per-declaration
    const date = new Date(event),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2),
      hours = ('0' + time.getHours()).slice(-2),
      minutes = ('0' + time.getMinutes()).slice(-2),
      seconds = ('0' + time.getSeconds()).slice(-2);
    return `${[mnth, day, date.getFullYear()].join('-')} ${[hours, minutes, seconds].join(':')}`;
  }

  formatDateValue(event) {
    const time = new Date();
    // tslint:disable-next-line: one-variable-per-declaration
    const date = new Date(event),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2)
    return `${[day, mnth, date.getFullYear()].join('-')}`;
  }


  formatReportDate(event) {
    var time = new Date();
    var date = new Date(event),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2),
      hours = ("0" + time.getHours()).slice(-2),
      minutes = ("0" + time.getMinutes()).slice(-2),
      seconds = ("0" + time.getSeconds()).slice(-2);
    return `${[date.getFullYear(), mnth, day].join("/")} ${[hours, minutes, seconds].join(":")}`
  }


  public toggleSidebar() {
    if ((this.appDrawer != null)) {
      this.appDrawer.toggle();
    }
  }


  //To Set Focus
  setFocus(id) {
    window.setTimeout(function () {
      let inputElement = <HTMLInputElement>document.getElementById(id);
      if (inputElement) {
        inputElement.focus();
      }
    }, 0);
  }

  //Object Comparsion
  IsObjectsMatch(mainObject: any, cloneObject: any) {
    return (JSON.stringify(mainObject) === JSON.stringify(cloneObject));
  }

  // showSpinner() {
  //    this.spinner.show();
  // }

  // hideSpinner() {
  //  this.spinner.hide();
  // }
}
