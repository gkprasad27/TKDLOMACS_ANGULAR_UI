import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { RolesprevilagesComponent } from './rolesprevilages/rolesprevilages.component';

import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, RolesprevilagesComponent]
})
export class SettingsComponent implements OnInit {

 
  routeParams: any;



  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    activatedRoute.params.subscribe(params => {
      this.routeParams = params.id;
    });
  }

  ngOnInit() {
  }
}
