import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent, DashboardComponent, NotFoundComponent } from './components/index';
import { GeneralledgerComponent } from './components/dashboard/generalledger/index';
import { InventoryComponent } from './components/dashboard/Inventory/index';
import { MastersComponent } from './components/dashboard/masters/index';
import { PayrollComponent } from './components/dashboard/payroll/index';
import { SelfserviceComponent } from './components/dashboard/selfservice/index';
// import { TransactionsComponent } from './components/dashboard/transactions';
import { TransactionsComponent,CreateCashpaymentComponent,CreateCashreceiptComponent,CreateBankpaymentComponent,CreateBankreceiptComponent,CreateJournalvoucherComponent,CreateStockissuesComponent, CreateStockreceiptsComponent, CreateStockshortsComponent, CreateOilconversionsComponent,CreateStockExcessComponent } from './components/dashboard/transactions';

import {
  SettingsComponent
} from './components/dashboard/settings/index';

import { ReportsComponent } from './components/dashboard/reports/index';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  {
    path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' },
    children: [
      { path: 'master/:id', component: MastersComponent, data: { title: 'Master' } },

      // transation screens
      { path: 'transaction/:id/:id1', loadComponent: () => import('./components/dashboard/trans-list/trans-list.component').then(m => m.TransListComponent) },
      { path: 'transaction/:id', loadComponent: () => import('./components/dashboard/trans-list/trans-list.component').then(m => m.TransListComponent) },

      { path: 'generalledger/:id', component: GeneralledgerComponent, data: { title: 'Generalledger' } },
      { path: 'inventory/:id', component: InventoryComponent, data: { title: 'Inventory' } },
      { path: 'selfservice/:id', component: SelfserviceComponent, data: { title: 'Selfservice' } },

      { path: 'transactions/:id', component: TransactionsComponent, data: { title: 'Transactions' } },
      { path: 'transactions/:id/createCashpayment', component: CreateCashpaymentComponent, data: { title: 'Create CashPayment' } },
      { path: 'transactions/:id/createCashpayment/:id1', component: CreateCashpaymentComponent, data: { title: 'Create CashPayment' } },
      { path: 'transactions/:id/createCashreceipt', component: CreateCashreceiptComponent, data: { title: 'Create CashReceipt' } },
      { path: 'transactions/:id/createCashreceipt/:id1', component: CreateCashreceiptComponent, data: { title: 'Create CashReceipt' } },
      { path: 'transactions/:id/createBankpayment', component: CreateBankpaymentComponent, data: { title: 'Create BankPayment' } },
      { path: 'transactions/:id/createBankpayment/:id1', component: CreateBankpaymentComponent, data: { title: 'Create BankPayment' } },
      { path: 'transactions/:id/createBankreceipt', component: CreateBankreceiptComponent, data: { title: 'Create BankReceipt' } },
      { path: 'transactions/:id/createBankreceipt/:id1', component: CreateBankreceiptComponent, data: { title: 'Create BankReceipt' } },
      { path: 'transactions/:id/createJournalvoucher', component: CreateJournalvoucherComponent, data: { title: 'Create Journal Voucher' } },
      { path: 'transactions/:id/createJournalvoucher/:id1', component: CreateJournalvoucherComponent, data: { title: 'Create Journal Voucher' } },
      { path: 'transactions/:id/CreateStockissues', component: CreateStockissuesComponent, data: { title: 'Create Stockissues' } },
      { path: 'transactions/:id/CreateStockissues/:id1', component: CreateStockissuesComponent, data: { title: 'Create Stockissues' } },
      { path: 'transactions/:id/CreateStockreceipts', component: CreateStockreceiptsComponent, data: { title: 'Create Stockreceipt' } },
      { path: 'transactions/:id/CreateStockreceipts/:id1', component: CreateStockreceiptsComponent, data: { title: 'Create Stockreceipt' } },
      { path: 'transactions/:id/CreateStocshorts', component: CreateStockshortsComponent, data: { title: 'Create Stockshort' } },
      { path: 'transactions/:id/CreateStocshorts/:id1', component: CreateStockshortsComponent, data: { title: 'Create Stockshort' } },
      { path: 'transactions/:id/CreateOilconversions', component: CreateOilconversionsComponent, data: { title: 'Create Oilconversions' } },
      { path: 'transactions/:id/CreateOilconversions/:id1', component: CreateOilconversionsComponent, data: { title: 'Create Oilconversions' } },
      { path: 'transactions/:id/createStockExcess', component: CreateStockExcessComponent, data: { title: 'Create StockExcess' } },
      { path: 'transactions/:id/createStockExcess/:id1', component: CreateStockExcessComponent, data: { title: 'Create StockExcess' } },
      { path: 'payroll/:id', component: PayrollComponent, data: { title: 'Payroll' } },
      { path: 'settings/:id', component: SettingsComponent, data: { title: 'Payroll' } },
      { path: 'reports/:id', component: ReportsComponent, data: { title: 'Report' }  }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent, data: { title: 'Page Not Found' } },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
