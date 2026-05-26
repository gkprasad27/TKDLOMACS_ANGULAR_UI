import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../services/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  dynamicData = { url: '', component: null, registerUrl: '', listName: '', updateUrl: '', primaryKey: '', deleteUrl: '' };
  branchCode: any;

  constructor(
    private apiConfigService: ApiConfigService
  ) { }


  getRouteUrls(data) {
    switch (data) {
      case 'bonus':
        this.dynamicData.url = this.apiConfigService.getCompanysList;
        this.dynamicData.listName = 'companiesList';
        return this.dynamicData;
        break;
      case 'membermaster':
        this.dynamicData.url = this.apiConfigService.getMemberMaster;
        this.dynamicData.listName = 'memberMasterList';
        return this.dynamicData;
        break;
      case 'employeeregister':
        this.dynamicData.url = this.apiConfigService.getEmployeeRegister;
        this.dynamicData.listName = 'employeeRegisterList';
        return this.dynamicData;
      case 'AccountLedger':
        this.dynamicData.url = this.apiConfigService.getAccountLedger;
        this.dynamicData.listName = 'accountLedgerList';
        return this.dynamicData;
      case '24HrsSaleValue':
        this.dynamicData.url = this.apiConfigService.getSaleValueReport;
        this.dynamicData.listName = 'savleValueList';
        return this.dynamicData;
      case 'Shift':
        this.dynamicData.url = `${this.apiConfigService.getDefaultShiftReport}/${this.branchCode}`;
        this.dynamicData.listName = 'shiftViewList';
        return this.dynamicData;
      case 'InnerShift':
        this.dynamicData.url = this.apiConfigService.getShiftViewReport;
        this.dynamicData.listName = 'shiftViewList';
        return this.dynamicData;
      case 'VehicalEnquiry':
        this.dynamicData.url = this.apiConfigService.getVehicalReport;
        this.dynamicData.listName = 'VehicalList';
        return this.dynamicData;
      case 'IntimateSale':
        this.dynamicData.url = this.apiConfigService.getIntimateSaleReport;
        this.dynamicData.listName = 'IntimateSaleList';
        return this.dynamicData;
      case 'SalesGST':
        this.dynamicData.url = this.apiConfigService.getSalesGSTReport;
        this.dynamicData.listName = 'salesGst';
        return this.dynamicData;
      case 'DailySales':
        this.dynamicData.url = this.apiConfigService.getDailySalesReport;
        this.dynamicData.listName = 'dailySalesList';
        return this.dynamicData;
      case 'StockVerification':
        this.dynamicData.url = this.apiConfigService.getStockVerificationReport;
        this.dynamicData.listName = 'StockVerificationList';
        return this.dynamicData;
      case 'StockLedger':
        this.dynamicData.url = this.apiConfigService.getStockLedgerForAllProducts;
        this.dynamicData.listName = 'StockLedgerList';
        return this.dynamicData;
      case '24HrsSalesStock':
        this.dynamicData.url = this.apiConfigService.getTwoFourehrsSalesStockReport;
        this.dynamicData.listName = 'shrsSalesStockListhiftViewList';
        return this.dynamicData;
      case 'Salesanalysisbybranch':
        this.dynamicData.url = this.apiConfigService.getSalesAnalysisByBranch;
        this.dynamicData.listName = 'SalesAnalysisByBranchrList';
        return this.dynamicData;
      case 'ProductWiseMonthlyPurchase':
        this.dynamicData.url = this.apiConfigService.getProductWiseMonthlyPurchaseReport;
        this.dynamicData.listName = 'ProductWiseMonthlyPurchaseList';
        return this.dynamicData;
      case 'ProductPriceList':
        this.dynamicData.url = this.apiConfigService.getProductPriceListReport;
        this.dynamicData.listName = 'productPriceList';
        return this.dynamicData;
      case 'ReceiptsAndPaymentsDetailed':
        this.dynamicData.url = this.apiConfigService.getReceiptsAndPyamentDetailedReportData;
        this.dynamicData.listName = 'receiptsAndPayment';
        return this.dynamicData;
      case 'ReceiptsAndPaymentsSummary':
        this.dynamicData.url = this.apiConfigService.getReceiptsAndPaymentSummaryReportData;
        this.dynamicData.listName = 'receiptsAndPayment';
        return this.dynamicData;
      case 'SMSSummary':
        this.dynamicData.url = this.apiConfigService.getSMSSummaryReportData;
        this.dynamicData.listName = 'smsSummary';
        return this.dynamicData;
      case '24HrsSaleValue6AmTo6Am':
        this.dynamicData.url = this.apiConfigService.getOneDaySaleValueReportData;
        this.dynamicData.listName = 'saleValue';
        return this.dynamicData;
      case 'TrialBalance':
        this.dynamicData.url = this.apiConfigService.getTrialBalanceReportData;
        this.dynamicData.listName = 'trialBalanceList';
        return this.dynamicData;
      case '24HrsMeterReading':
        this.dynamicData.url = this.apiConfigService.getMeterReadingReportData;
        this.dynamicData.listName = 'meterReadingList';
        return this.dynamicData;
      case 'ClosingBalance':
        this.dynamicData.url = this.apiConfigService.getClosingBalanceReportData;
        this.dynamicData.listName = 'closingBalanceList';
        return this.dynamicData;
      case 'BankReconciliation':
        this.dynamicData.url = this.apiConfigService.getBankReconciliationReportData;
        this.dynamicData.listName = 'bankReconciliationList';
        return this.dynamicData;
      case 'StockValuation':
        this.dynamicData.url = this.apiConfigService.getStockValuationReportData;
        this.dynamicData.listName = 'stockValuationList';
        return this.dynamicData;
      case 'FourColumnCashBook':
        this.dynamicData.url = this.apiConfigService.getFourColumnCashBookReportData;
        this.dynamicData.listName = 'fourColumnList';
        return this.dynamicData;
      case 'BranchWiseMonthlySalesByLiters':
        this.dynamicData.url = this.apiConfigService.getBranchWiseMonthlySalesByLtrsReportData;
        this.dynamicData.listName = 'branchwiseLtrs';
        return this.dynamicData;
      case 'ProductMonthWisePurchaseLtrs':
        this.dynamicData.url = this.apiConfigService.getProductMonthWisePurchaseLtrsReportData;
        this.dynamicData.listName = 'productWiseLtrs';
        return this.dynamicData;
      case 'BranchWiseStockStatementLtrs':
        this.dynamicData.url = this.apiConfigService.getBranchWiseStockStatementLtrsReportData;
        this.dynamicData.listName = 'branchWiseStockLtrs';
        return this.dynamicData;
      case 'BranchWiseStockStatementQty':
        this.dynamicData.url = this.apiConfigService.getBranchWiseStockStatementQtyReportData;
        this.dynamicData.listName = 'branchWiseStockQty';
        return this.dynamicData;
      case 'einvoice':
        this.dynamicData.url = this.apiConfigService.getEInvoiceReportData;
        this.dynamicData.listName = 'eInvoice';
        return this.dynamicData;
      default:
    }
  }
}
