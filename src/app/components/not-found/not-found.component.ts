import { Component } from '@angular/core';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class NotFoundComponent {
}
