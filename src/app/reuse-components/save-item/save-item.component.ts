import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({ 
    selector: 'app-save-item',
    templateUrl: './save-item.component.html',
    styleUrls: ['./save-item.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})
export class SaveItemComponent {

  saveData: any;
  tableUrl: any;

  constructor(
    public dialogRef: MatDialogRef<SaveItemComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.saveData = { ...data };
  }

  doAction() {
    this.dialogRef.close('save');
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
