import {Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, OnInit, Input, OnDestroy} from '@angular/core';

import { ApiService } from '../../services/api.service';
import { SharedImportModule } from 'src/app/shared/shared-import';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonService } from '../../services/common.service';
import { ApiConfigService } from '../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ 
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [SharedImportModule, TranslateModule, SidebarComponent]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('appDrawer', { static: false }) appDrawer: ElementRef;
  navItems = [];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private router: Router,
    route: ActivatedRoute
  ) {
    this.commonService.routeParam = route.snapshot.routeConfig.path;
    console.log(this.commonService.routeParam, 'routeParam');
    commonService.showNavbar.next(true);
  }

  ngOnInit() {
    this.getMenuList();
    // this.getStockInformationDashboardData();
  }

  getMenuList() {
   let obj= JSON.parse(localStorage.getItem("user"));

    const getMenuUrl = [this.apiConfigService.getMenuUrl,obj.role].join('/');
    this.apiService.apiGetRequest(getMenuUrl)
      .subscribe(
        menu => {
         
          console.log(menu);
          this.spinner.hide();
          this.navItems = menu["response"];
          this.spinner.hide();
        });
  }

  ngAfterViewInit() {
    this.commonService.appDrawer = this.appDrawer;
  // console.log(this.navItems);
  }

  ngOnDestroy() {
    this.commonService.routeParam = null;
  }

/*
[
    {
      displayName: 'Master',
      iconName: 'recent_actors',
      route: 'master',
      children: [
        {
          displayName: 'Company',
          iconName: 'group',
          route: 'company'
        },
        {
          displayName: 'Branches',
          iconName: 'speaker_notes',
          route: 'branches'
        },
        {
          displayName: 'Division',
          iconName: 'speaker_notes',
          route: 'division'
        },

        {
          displayName: 'Segment',
          iconName: 'speaker_notes',
          route: 'segment'
        },
        {
          displayName: 'CostCenter',
          iconName: 'speaker_notes',
          route: 'costcenter'
        },
        {
          displayName: 'ProfitCenter',
          iconName: 'speaker_notes',
          route: 'profitCenter'
        },
        {
          displayName: 'Department',
          iconName: 'speaker_notes',
          route: 'department'
        },
        {
          displayName: 'Designation',
          iconName: 'speaker_notes',
          route: 'designation'
        }, 
        {
          displayName: 'Employee',
          iconName: 'feedback',
          route: 'employee'
        },        
        {
          displayName: 'EmployeeInBranch',
          iconName: 'speaker_notes',
          route: 'employeeInBranch'
        },               
        {
          displayName: 'Tank',
          iconName: 'feedback',
          route: 'tank'
        },        
        {
          displayName: 'Pump',
          iconName: 'feedback',
          route: 'pump'
        },

        {
        displayName: 'MSHSD Rates',
        iconName: 'recent_actors',
        route: 'mshsdrates'
        },
        {
          displayName: 'MemberMaster',
          iconName: 'feedback',
          route: 'membermaster'
        }
      ]
    },

    {
      displayName: 'GeneralLedger',
      iconName: 'recent_actors',
      route: 'generalledger',
      children: [
        {
          displayName: 'AccountsGroup',
          iconName: 'account_balance',
          route: 'accountsgroup'
        },
        {
          displayName: 'GL',
          iconName: 'group',
          route: 'undersubgroup'
        },
        {
          displayName: 'CashAccBranch',
          iconName: 'group',
          route: 'cashacctobranches'
        },
        {
          displayName: 'VoucherTypes',
          iconName: 'group',
          route: 'vouchertypes'
        },
        {
          displayName: 'AsigAcctoAccclass',
          iconName: 'group',
          route: 'acctoaccclass'
        },
        
        {
          displayName: 'Taxintigration',
          iconName: 'group',
          route: 'taxintegration'
        },
        
        {
          displayName: 'Account Ledger',
          iconName: 'group',
          route: 'glaccounts'
        },
        {
          displayName: 'PartnerType',
          iconName: 'speaker_notes',
          route: 'partnerType'
        },
        {
          displayName: 'PartnerCreation',
          iconName: 'speaker_notes',
          route: 'partnerCreation'
        },
        {
          displayName: 'PartnerNoSeries',
          iconName: 'speaker_notes',
          route: 'noSeries'
        },
        {
          displayName: 'TaxGroup',
          iconName: 'feedback',
          route: 'taxgroup'
        },
        {
          displayName: 'TaxStructure',
          iconName: 'feedback',
          route: 'taxstructure'
        }
      ]
    },

    {
      displayName: 'Inventory',
      iconName: 'recent_actors',
      route: 'inventory',
      children: [
        {
          displayName: 'BrandModel',
          iconName: 'speaker_notes',
          route: 'brandmodel'
        },
        {
          displayName: 'Sizes',
          iconName: 'speaker_notes',
          route: 'sizes'
        },
        {
          displayName: 'AccountingClass',
          iconName: 'speaker_notes',
          route: 'accountingclass'
        },
        {
          displayName: 'Brand',
          iconName: 'speaker_notes',
          route: 'brand'
        },
        {
          displayName: 'MaterialNoAssignment',
          iconName: 'speaker_notes',
          route: 'numberassignment'
        },
        {
          displayName: 'MaterialGroups',
          iconName: 'speaker_notes',
          route: 'materialgroups'
        },
        {
          displayName: 'ProductPacking',
          iconName: 'feedback',
          route: 'productpacking'
        },
        {
          displayName: 'Unit',
          iconName: 'feedback',
          route: 'unit'
        },
        {
          displayName:'Product',
          iconName:'recent_actors',
          route:'product'
        }
      ]
    },
  
    {
      displayName: 'LMS',
      iconName: 'videocam',
      route: 'selfservice',
      children: [
        {
          displayName: 'LeaveType',
          iconName: 'speaker_notes',
          route: 'leavetype'
        },
        {
          displayName: 'Leaveopeningbalances',
          iconName: 'speaker_notes',
          route: 'leaveopeningbalance'
        }
      ]
    },

    {
      displayName: 'SelfServices',
      iconName: 'recent_actors',
      route: 'selfservice',
      children: [
        {
          displayName: 'LeaveRequest',
          iconName: 'speaker_notes',
          route: 'Leaverequest'
        },
        {
          displayName: 'Leave Approval',
          iconName: 'account_balance',
          route: 'leaveApproval'
        },        
        {
          displayName: 'PermissionRquest',
          iconName: 'speaker_notes',
          route: 'permissionrequest'
        },
        {
          displayName: 'Permission Approval',
          iconName: 'account_balance',
          route: 'permissionapproval'
        },        
        {
          displayName: 'Apply OD',
          iconName: 'speaker_notes',
          route: 'applyod'
        },
        {
          displayName: 'Approval OD',
          iconName: 'account_balance',
          route: 'odApproval'
        },        
        {
          displayName: 'Vehicle Request',
          iconName: 'speaker_notes',
          route: 'vehiclerequisition'
        },        
        {
          displayName: 'Vehicle Approval',
          iconName: 'account_balance',
          route: 'vehicleapproval'
        },
        {
          displayName: 'Advance',
          iconName: 'speaker_notes',
          route: 'advance'
        },
        {
          displayName: 'Advance Approval',
          iconName: 'account_balance',
          route: 'advanceApproval'
        },
        {
          displayName: 'Approvals',
          iconName: 'speaker_notes',
          route: 'approvaltype'
        }, 
        
      ]
    },
   
    {
      displayName: 'Payroll',
      iconName: 'recent_actors',
      route: 'payroll',
      children: [
        {
          displayName: 'Component Master',
          iconName: 'speaker_notes',
          route: 'componentmaster'
        },
        {
          displayName: 'PT Master',
          iconName: 'speaker_notes',
          route: 'ptmaster'

        },
        {
          displayName: 'CTCBreakup',
          iconName: 'account_balance',
          route: 'CTCBreakup'
        },
        {
          displayName: 'Structure Creation',
          iconName: 'account_balance',
          route: 'structureCreation'
        },
        {
          displayName: 'PF Master',
          iconName: 'account_balance',
          route: 'pfmaster'
        },
        {
          displayName: 'Salary Process',
          iconName: 'account_balance',
          route: 'salaryprocess'
        }

      ]
    },

    {
      displayName: 'Sales',
      iconName: 'videocam',
      route: 'sales',
      children: [
        {
          displayName: 'Sales Invoice',
          iconName: 'videocam',
          route: 'salesInvoice',
        },
        {
          displayName: 'Sales Return',
          iconName: 'videocam',
          route: 'salesReturn',
        }
        
      ]
    },

    {
      displayName: 'Purchase',
      iconName: 'videocam',
      route: 'sales',
      children: [        
        {
          displayName: 'Stock Transfer',
          iconName: 'videocam',
          route: 'stockTransfer',
        },
        {
          displayName: 'Purchase Invoice',
          iconName: 'videocam',
          route: 'purchaseInvoice',
        },
        {
          displayName: 'Purchase Return',
          iconName: 'videocam',
          route: 'purchaseReturn',
        }
      ]
    },

    {
      displayName: 'Transactions',
      iconName: 'account_balance',
      route: 'transactions',
      children: [
        {
          displayName: 'Cash Payment',
          iconName: 'account_balance',
          route: 'cashpayment'
        },
        {
          displayName: 'Cash Receipt',
          iconName: 'account_balance',
          route: 'cashreceipt'
        },
        {
          displayName: 'Bank Payment',
          iconName: 'account_balance',
          route: 'bankpayment'
        },
        {
          displayName: 'Bank Receipt',
          iconName: 'account_balance',
          route: 'bankreceipt'
        },
        {
          displayName: 'Journal Voucher',
          iconName: 'account_balance',
          route: 'journalvoucher'
        },
	  {
          displayName: 'OP Stock Issues',
          iconName: 'account_balance',
          route: 'stockissues'
        },
        {
          displayName: 'OP Stock Receipt',
          iconName: 'account_balance',
          route: 'stockreceipt'
        },
        {
          displayName: 'Stock Short',
          iconName: 'account_balance',
          route: 'stockshort'
        },
        {
          displayName: 'Oil  Convertion',
          iconName: 'account_balance',
          route: 'oilconversion'
        },
       {
          displayName: 'Package Conversion',
          iconName: 'account_balance',
          route: 'packageconversion'
        },
        {
          displayName: 'Stock Excess',
          iconName: 'account_balance',
          route: 'stockexcess'
        },
        {
          displayName: 'Meter Reading',
          iconName: 'account_balance',
          route: 'meterreading'
        }
      ]
    },
  
    {
      displayName: 'Settings',
      iconName: 'settings',
      route: 'settings',
      children: [
        {
          displayName: 'Role Previlages',
          iconName: 'account_balance',
          route: 'rolePrevilages',
        }
        
      ]
    },

    {
      displayName: 'Reports',
      iconName: 'recent_actors',
      route: 'reports',
      children: [
        {
          displayName:"Account Ledger",
          iconName:'account_balance',
          route:'AccountLedger'
        },
        {
          displayName:"24Hrs Sale Value",
          iconName:'monetization_on',
          route:'24HrsSaleValue'
        },
        {
          displayName:"24Hrs sales stock",
          iconName:"timeline",
          route:"24HrsSalesStock"
        },
        {
          displayName:"Shift Reports",
          iconName:'schedule',
          route:'Shift'
        },
        {
          displayName:"Vehical Enquiry Report",
          iconName:'commute',
          route:'Vehical Enquiry'
        },
        {
          displayName:"Intimate Sale Report",
          iconName:"euro_symbol",
          route:"Intimate Sale"
        },
        // {
        //   displayName:"Sales GST Report",
        //   iconName:"account_balance",
        //   route:"Sales GST"
        // },
        // {
        //   displayName:"Daily Sales Report",
        //   iconName:"account_balance",
        //   route:"Daily Sales"
        // },
        {
          displayName:"Stock Verification Report",
          iconName:"ev_station",
          route:"Stock Verification"
        },
        {
          displayName:"Stock Ledger For All Products",
          iconName:"track_changes",
          route:"Stock Ledger"
        },
        {
          displayName:"Sales analysis by branch",
          iconName:"score",
          route:"Sales analysis by branch"
        },
        {
          displayName:"Product Wise Monthly Purchase",
          iconName:"category",
          route:"Product Wise Monthly Purchase"
        },
        {
          displayName:"Daily Sales",
          iconName:"score",
          route:"Daily Sales"
        },
        {
          displayName:"Product Price List",
          iconName:"category",
          route:"Product Price List"
        },
        {
          displayName:"Receipts And Payments Detailed",
          iconName:"track_changes",
          route:"Receipts And Payments Detailed"
        },
        {
          displayName:"Receipts And Payments Summary",
          iconName:"category",
          route:"Receipts And Payments Summary"
        },
        {
          displayName:"SMS Summary",
          iconName:"category",
          route:"SMS Summary"
        },
        {
          displayName:"Sales GST",
          iconName:"category",
          route:"Sales GST"
        },
        {
          displayName:"24Hrs Sale Value 6Am To 6Am",
          iconName:"category",
          route:"24Hrs Sale Value 6Am To 6Am"
        },
        {
          displayName:"Trial Balance",
          iconName:"track_changes",
          route:"Trial Balance"
        }
      ]
    }
  ];*/

}
