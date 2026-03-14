import { Component, Inject, AfterViewInit } from '@angular/core';
import { CommonService } from './services/common.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RuntimeConfigService } from './services/runtime-config.service';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { NavbarComponent } from './reuse-components/navbar/navbar.component';

@Component({ 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, NavbarComponent]
})
export class AppComponent implements AfterViewInit{
  showNavbar : any;

  constructor(
    private commonService: CommonService,
    private runtimeConfigService: RuntimeConfigService

    ) {
    this.commonService.getLangConfig();
    commonService.showNavbar.subscribe(res => {
      this.showNavbar = res;
      console.log(this.showNavbar)
    })
    this.runtimeConfigService.getTableColumns();

  }

  ngAfterViewInit() {
    // console.log(this.activatedRoute)
    // this.activatedRoute._routerState
  }

 }
