import {Component, HostBinding, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({ 
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
  animations: [
        trigger('indicatorRotate', [
            state('collapsed', style({ transform: 'rotate(0deg)' })),
            state('expanded', style({ transform: 'rotate(180deg)' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
        ])
    ],
  standalone: true,
  imports: [SharedImportModule, TranslateModule]
})
export class SidebarComponent implements OnInit {


  expanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: any;
  @Input() depth: number;

  constructor(public commonService: CommonService,
              public router: Router
              ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.commonService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        this.ariaExpanded = this.expanded;
      }
    });
  }

  onItemSelected(item: any) {

    if ((item.children != null)) {
      this.commonService.parentItem = item.route;

    }
    if (!item.children || !item.children.length) {
      const route = ['/', 'dashboard', this.commonService.parentItem].join('/');
      console.log( route, item.route);

      this.router.navigate([ route, item.route ]);
      this.commonService.toggleSidebar();
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

}
