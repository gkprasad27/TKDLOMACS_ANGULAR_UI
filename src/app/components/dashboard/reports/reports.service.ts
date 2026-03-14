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
      case 'Vehical Enquiry':
        this.dynamicData.url = this.apiConfigService.getVehicalReport;
        this.dynamicData.listName = 'VehicalList';
        return this.dynamicData;
      case 'Intimate Sale':
        this.dynamicData.url = this.apiConfigService.getIntimateSaleReport;
        this.dynamicData.listName = 'IntimateSaleList';
        return this.dynamicData;
      case 'Sales GST':
        this.dynamicData.url = this.apiConfigService.getSalesGSTReport;
        this.dynamicData.listName = 'salesGst';
        return this.dynamicData;
      case 'Daily Sales':
        this.dynamicData.url = this.apiConfigService.getDailySalesReport;
        this.dynamicData.listName = 'dailySalesList';
        return this.dynamicData;
      case 'Stock Verification':
        this.dynamicData.url = this.apiConfigService.getStockVerificationReport;
        this.dynamicData.listName = 'StockVerificationList';
        return this.dynamicData;
      case 'Stock Ledger':
        this.dynamicData.url = this.apiConfigService.getStockLedgerForAllProducts;
        this.dynamicData.listName = 'StockLedgerList';
        return this.dynamicData;
      case '24HrsSalesStock':
        this.dynamicData.url = this.apiConfigService.getTwoFourehrsSalesStockReport;
        this.dynamicData.listName = 'shrsSalesStockListhiftViewList';
        return this.dynamicData;
      case 'Sales analysis by branch':
        this.dynamicData.url = this.apiConfigService.getSalesAnalysisByBranch;
        this.dynamicData.listName = 'SalesAnalysisByBranchrList';
        return this.dynamicData;
      case 'Product Wise Monthly Purchase':
        this.dynamicData.url=this.apiConfigService.getProductWiseMonthlyPurchaseReport;
        this.dynamicData.listName='ProductWiseMonthlyPurchaseList';
        return this.dynamicData;
      case 'Product Price List':
        this.dynamicData.url = this.apiConfigService.getProductPriceListReport;
        this.dynamicData.listName = 'productPriceList';
        return this.dynamicData;
        case 'Receipts And Payments Detailed':
        this.dynamicData.url = this.apiConfigService.getReceiptsAndPyamentDetailedReportData;
        this.dynamicData.listName = 'receiptsAndPayment';
        return this.dynamicData;
        case 'Receipts And Payments Summary':
        this.dynamicData.url = this.apiConfigService.getReceiptsAndPaymentSummaryReportData;
        this.dynamicData.listName = 'receiptsAndPayment';
        return this.dynamicData;
        case 'SMS Summary':
        this.dynamicData.url = this.apiConfigService.getSMSSummaryReportData;
        this.dynamicData.listName = 'smsSummary';
        return this.dynamicData;
        case '24Hrs Sale Value 6Am To 6Am':
        this.dynamicData.url = this.apiConfigService.getOneDaySaleValueReportData;
        this.dynamicData.listName = 'saleValue';
        return this.dynamicData;
        case 'Trial Balance':
          this.dynamicData.url = this.apiConfigService.getTrialBalanceReportData;
          this.dynamicData.listName = 'trialBalanceList';
          return this.dynamicData;
          case '24Hrs Meter Reading':
            this.dynamicData.url = this.apiConfigService.getMeterReadingReportData;
            this.dynamicData.listName = 'meterReadingList';
            return this.dynamicData;
            case 'Closing Balance':
            this.dynamicData.url = this.apiConfigService.getClosingBalanceReportData;
            this.dynamicData.listName = 'closingBalanceList';
            return this.dynamicData;
            case 'Bank Reconciliation':
              this.dynamicData.url = this.apiConfigService.getBankReconciliationReportData;
              this.dynamicData.listName = 'bankReconciliationList';
              return this.dynamicData;
              case 'Stock Valuation':
                this.dynamicData.url = this.apiConfigService.getStockValuationReportData;
                this.dynamicData.listName = 'stockValuationList';
                return this.dynamicData;
                case 'Four Column Cash Book':
                this.dynamicData.url = this.apiConfigService.getFourColumnCashBookReportData;
                this.dynamicData.listName = 'fourColumnList';
                return this.dynamicData;
                case 'BranchWise Monthly SalesByLiters':
                this.dynamicData.url = this.apiConfigService.getBranchWiseMonthlySalesByLtrsReportData;
                this.dynamicData.listName = 'branchwiseLtrs';
                return this.dynamicData;
                case 'ProductMonthWise PurchaseLtrs':
                this.dynamicData.url = this.apiConfigService.getProductMonthWisePurchaseLtrsReportData;
                this.dynamicData.listName = 'productWiseLtrs';
                return this.dynamicData;
                case 'BranchWise StockStatement Ltrs':
                  this.dynamicData.url = this.apiConfigService.getBranchWiseStockStatementLtrsReportData;
                  this.dynamicData.listName = 'branchWiseStockLtrs';
                  return this.dynamicData;
                  case 'BranchWise StockStatement Qty':
                    this.dynamicData.url = this.apiConfigService.getBranchWiseStockStatementQtyReportData;
                    this.dynamicData.listName = 'branchWiseStockQty';
                    return this.dynamicData;
      default:
    }
  }
}
