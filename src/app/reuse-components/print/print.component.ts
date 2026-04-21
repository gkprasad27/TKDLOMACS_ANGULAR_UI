import { Component, OnInit, Optional, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';

@Component({ 
    selector: 'app-print',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.scss'],
    standalone: true,
    imports: [SharedImportModule, TranslateModule],
})
export class PrintComponent implements OnInit, AfterViewInit {
  invoiceHdr: any;
  invoiceDetail: any;
  userName:any;
  Branch:any;
  BranchPhone:any;
  BranchList:any;
  
  constructor(
    public dialogRef: MatDialogRef<PrintComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.invoiceHdr = data.InvoiceHdr;
    this.invoiceDetail = data.InvoiceDetail;
    const user = JSON.parse(localStorage.getItem('user'));
    this.userName=user.userName;
    this.Branch = data.Branches;
    this.BranchList = this.Branch.filter(branchCode => {
      if (branchCode.branchCode == data.BranchCode){
        return branchCode;
      }});
      var array = this.BranchList,  
       object = Object.assign({}, ...array);  
        
       this.BranchPhone= object;
       console.log(this.BranchPhone);


;
// let printContents, popupWin;
// printContents = document.getElementById('print-section').innerHTML;
// popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
// popupWin.document.open();
// popupWin.document.write(`
//   <html>
//     <head>
//       <title>Print tab</title>
//       <style>
//       //........Customized style.......
//       </style>
//     </head>
//     <body style="font-size: 10px; margin-top:2%;" onload="window.print();window.close()">${printContents}</body>
//   </html>`
// );
// popupWin.document.close();
 //   window.print();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    
    popupWin.document.write(`
      <html>
        <head>
        
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
        <body style="font-size: 10px; margin-top:2%;" onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    // popupWin.document.close();
    this.dialogRef.close();
  }
}
