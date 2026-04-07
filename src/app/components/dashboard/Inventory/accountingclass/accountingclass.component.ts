import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({ 
    selector: 'app-accountingclass',
    templateUrl: './accountingclass.component.html',
    styleUrls: ['./accountingclass.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule]
})

export class AccountingClassComponent implements OnInit {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AccountingClassComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.modelFormData = this.formBuilder.group({
      code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      description: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      ext1: [null],
      ext2: [null],
      active: ['Y']
    });


    this.formData = { ...data };
    if (this.formData.item != null) {
      this.modelFormData.patchValue(this.formData.item);
      this.modelFormData.controls['code'].disable();
    }

  }

  ngOnInit() {
  }

  get formControls() { return this.modelFormData.controls; }


  save() {
    if (this.modelFormData.invalid) {
      return;
    }
    this.modelFormData.controls['code'].enable();
    this.formData.item = this.modelFormData.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
