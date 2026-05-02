import { Injectable } from '@angular/core';
import { RuntimeConfigService } from './runtime-config.service';
import { environment } from 'src/environments/environment';


// guard parsing localStorage user (may be null)
const user = (() => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
})();

@Injectable({
   providedIn: 'root'
})
export class ApiConfigService {

   constructor() {
      // environment.loadRuntimeConfig()
   }

   // login Url
   loginUrl = `${environment.baseUrl}Auth/login`;
   getMenuUrl = `${environment.baseUrl}Auth/getMenu`;
   logoutUrl = `${environment.baseUrl}Auth/logout`;
   shiftTerminate = `${environment.baseUrl}Auth/ShiftTerminate`;
   shiftStart = `${environment.baseUrl}Auth/ShiftStart`;
   getBranchesForUser = `${environment.baseUrl}Auth/GetBranchesForUser`;
   getShiftId=`${environment.baseUrl}Auth/GetShiftId`;
   getAuthentication=`${environment.baseUrl}Auth/GetAuthentication`;
   getIPAddress=`${environment.baseUrl}Auth/getIPAddress`;



   // ******************************** sales *********************************
   getInvoiceList = `${environment.baseUrl}sales/Billing/GetInvoiceList`;
   getCashPartyAccountList = `${environment.baseUrl}sales/Billing/GetCashPartyAccountList`;
   getCustomerGstNumList=`${environment.baseUrl}sales/Billing/GetCustomerGstNumList`;
   getBillingBranchesList = `${environment.baseUrl}sales/Billing/GetBranchesList`;
   getCashPartyAccount = `${environment.baseUrl}sales/Billing/GetCashPartyAccount`;
   getmemberNames = `${environment.baseUrl}sales/Billing/GetmemberNames`;
   getAccountBalance = `${environment.baseUrl}sales/Billing/GetAccountBalance`;
   generateBillNo = `${environment.baseUrl}sales/Billing/GenerateBillNo`;
   getProductByProductCode = `${environment.baseUrl}sales/Billing/GetProductByProductCode`;
   getProductByProductName = `${environment.baseUrl}sales/Billing/GetProductByProductName`;
   getBillingDetailsRcd = `${environment.baseUrl}sales/Billing/GetBillingDetailsRcd`;
   registerInvoice = `${environment.baseUrl}sales/Billing/RegisterInvoice`;
   getStateList = `${environment.baseUrl}sales/Billing/GeStateList`;
   getSelectedState = `${environment.baseUrl}sales/Billing/GeSelectedState`;
   getVechiels = `${environment.baseUrl}sales/Billing/GetVechiels`;
   getInvoiceDeatilList = `${environment.baseUrl}sales/Billing/GetInvoiceDeatilList`;
   getPupms = `${environment.baseUrl}sales/Billing/GetPupms`;
   generateSalesReturnInvNo = `${environment.baseUrl}transaction/SalesReturn/GenerateSalesReturnInvNo`;
   registerInvoiceReturn = `${environment.baseUrl}transaction/SalesReturn/RegisterInvoiceReturn`;
   getInvoiceReturnDetail = `${environment.baseUrl}transaction/SalesReturn/GetInvoiceReturnDetail`;
   getInvoiceGetInvoiceReturnList = `${environment.baseUrl}transaction/SalesReturn/GetInvoiceReturnList`;
   getmemberNamesByCode = `${environment.baseUrl}sales/Billing/GetmemberNamesByCode`;
  


   //  stock Transfer
   generateStockTranfNo = `${environment.baseUrl}transaction/StockTransfer/GenerateStockTranfNo`;
   geProductsByName = `${environment.baseUrl}transaction/StockTransfer/GeProductsByName`;
   geProductsByCode = `${environment.baseUrl}transaction/StockTransfer/GeProductsByCode`;
   getStockTransferDetailsSection = `${environment.baseUrl}transaction/StockTransfer/GetStockTransferDetailsSection`;
   getLtrs = `${environment.baseUrl}transaction/StockTransfer/GetLtrs`;
   registerStockTransfer = `${environment.baseUrl}transaction/StockTransfer/RegisterStockTransfer`;
   getStockTransferList = `${environment.baseUrl}transaction/StockTransfer/GetStockTransferList`;
   getStockTransferDetilsaRecords = `${environment.baseUrl}transaction/StockTransfer/GetStockTransferDetilsaRecords`;

   //  purchase Transfer
   getPurchasePupms = `${environment.baseUrl}Purchase/purchases/GetPupms`;
   generatePurchaseInvNo = `${environment.baseUrl}Purchase/purchases/GeneratePurchaseInvNo`;
   getProductDeatilsSectionRcd = `${environment.baseUrl}Purchase/purchases/GetProductDeatilsSectionRcd`;
   registerPurchase = `${environment.baseUrl}Purchase/purchases/RegisterPurchase`;
   getPurchaseInvoiceList = `${environment.baseUrl}Purchase/purchases/GetInvoiceList`;
   getPurchaseInvoiceDeatilList = `${environment.baseUrl}Purchase/purchases/GetInvoiceDeatilList`;
   getPurchaseStateList = `${environment.baseUrl}Purchase/purchases/GeStateList`;
   getPurchaseSelectedState = `${environment.baseUrl}Purchase/purchases/GeSelectedState`;
   getPurchaseCashPartyAccount = `${environment.baseUrl}Purchase/purchases/GetCashPartyAccount`;
   getTankas = `${environment.baseUrl}Purchase/purchases/GetTankas`;
   getPurchasePurchaseReturnInvNo = `${environment.baseUrl}purchase/PurchaseReturn/GeneratePurchaseReturnInvNo`;
   getPurchaseRegisterPurchaseReturn = `${environment.baseUrl}purchase/PurchaseReturn/RegisterPurchaseReturn`;
   getPurchaseReturns = `${environment.baseUrl}purchase/PurchaseReturn/GetPurchaseReturns`;
   getPurchaseReturnsDetails = `${environment.baseUrl}purchase/PurchaseReturn/GetPurchaseReturnsDetails`;
   getPCashPartyAccountList = `${environment.baseUrl}Purchase/purchases/GetPCashPartyAccountList`;
   

   // *******************************   Transaction *****************************************

   // Cash Payment
   getCashPaymentList = `${environment.baseUrl}transactions/CashPayment/GetCashpaymentList`;
   getAccountLedgerListByName = `${environment.baseUrl}transactions/CashPayment/GetAccountLedgerListByName`;
   getCashPaymentBranchesList = `${environment.baseUrl}transactions/CashPayment/GetBranchesList`;
   getCashPaymentVoucherNo = `${environment.baseUrl}transactions/CashPayment/GetVoucherNo`;
   getAccountLedgerList = `${environment.baseUrl}transactions/CashPayment/GetAccountLedgerList`;
   registerCashPayment = `${environment.baseUrl}transactions/CashPayment/RegisterCashPayment`;
   getCashPaymentDetailsList = `${environment.baseUrl}transactions/CashPayment/GetCashPaymentDetailsList`;


   // Cash Receipt
   getCashReceiptList = `${environment.baseUrl}transactions/CashReceipt/GetCashreceiptList`;
   getCRAccountLedgerListByName = `${environment.baseUrl}transactions/CashReceipt/GetAccountLedgerListByName`;
   getCashReceiptBranchesList = `${environment.baseUrl}transactions/CashReceipt/GetBranchesList`;
   getCashReceiptVoucherNo = `${environment.baseUrl}transactions/CashReceipt/GetVoucherNo`;
   getCashRAccountLedgerList = `${environment.baseUrl}transactions/CashReceipt/GetAccountLedgerList`;
   registerCashReceipt = `${environment.baseUrl}transactions/CashReceipt/RegisterCashReceipt`;
   getCashReceiptDetailsList = `${environment.baseUrl}transactions/CashReceipt/GetCashReceiptDetailsList`;

   // Bank Payment
   getBankpaymentList = `${environment.baseUrl}transactions/BankPayment/GetBankpaymentList`;
   getBPAccountLedgerListByName = `${environment.baseUrl}transactions/BankPayment/GetAccountLedgerListByName`;
   getBankPaymentBranchesList = `${environment.baseUrl}transactions/BankPayment/GetBranchesList`;
   getBankPaymentVoucherNo = `${environment.baseUrl}transactions/BankPayment/GetVoucherNo`;
   getBPAccountLedgerList = `${environment.baseUrl}transactions/BankPayment/GetAccountLedgerList`;
   getBankPAccountLedgerList = `${environment.baseUrl}transactions/BankPayment/GetAccountLedger`;
   registerBankPayment = `${environment.baseUrl}transactions/BankPayment/RegisterBankPayment`;
   getBankPaymentDetailsList = `${environment.baseUrl}transactions/BankPayment/GetBankPaymentDetailsList`;

   // Bank Receipt
   getBankreceiptList = `${environment.baseUrl}transactions/BankReceipt/GetBankreceiptList`;
   getBRAccountLedgerListByName = `${environment.baseUrl}transactions/BankReceipt/GetAccountLedgerListByName`;
   getBankReceiptBranchesList = `${environment.baseUrl}transactions/BankReceipt/GetBranchesList`;
   getBankReceiptVoucherNo = `${environment.baseUrl}transactions/BankReceipt/GetVoucherNo`;
   getBRAccountLedgerList = `${environment.baseUrl}transactions/BankReceipt/GetAccountLedgerList`;
   getBankRAccountLedgerList = `${environment.baseUrl}transactions/BankReceipt/GetAccountLedger`;
   registerBankReceipt = `${environment.baseUrl}transactions/BankReceipt/RegisterBankReceipt`;
   getBankReceiptDetailsList = `${environment.baseUrl}transactions/BankReceipt/GetBankReceiptDetailsList`;

   // Journal Voucher
   getJournalvoucherList = `${environment.baseUrl}transactions/JournalVoucher/GetJournalvoucherList`;
   getJVAccountLedgerListByName = `${environment.baseUrl}transactions/JournalVoucher/GetAccountLedgerListByName`;
   getJournalVoucherBranchesList = `${environment.baseUrl}transactions/JournalVoucher/GetBranchesList`;
   getJournalVoucherNo = `${environment.baseUrl}transactions/JournalVoucher/GetVoucherNo`;
   getJournalVoucherAccountLedgerList = `${environment.baseUrl}transactions/JournalVoucher/GetAccountLedgerList`;
   getJVAccountLedgerList = `${environment.baseUrl}transactions/JournalVoucher/GetAccountLedger`;
   registerJournalVoucher = `${environment.baseUrl}transactions/JournalVoucher/RegisterJournalVoucher`;
   getJournalVoucherDetailsList = `${environment.baseUrl}transactions/JournalVoucher/GetJournalVoucherDetailsList`;


  //PurchaseRequisition and approval
    getprreqreceiptnosList = `${environment.baseUrl}Transactions/PurchaseRequisitionMaster/GetStackissueNo`;  getprreqDeatilList = `${environment.baseUrl}Transactions/PurchaseRequisitionMaster/GetPrreqDeatilList`;
  GetProductListsforpreq = `${environment.baseUrl}Transactions/PurchaseRequisitionMaster/GetProductLists`;
  registerPurchaserequisitionDetails = `${environment.baseUrl}Transactions/PurchaseRequisitionMaster/RegisterPurchaserequisition`;
  getPurchaserequisitionDetailsListLoad = `${environment.baseUrl}Transactions/PurchaseRequisitionMaster/GetPurchaseequisitionDetails`;
  getpurchaserequisitionList = `${environment.baseUrl}Transactions/PurchaseRequisitionMaster/GetPurchaseequisitionDetails`;
  registerPurchaserequisitionaaprovalDetails = `${environment.baseUrl}Transactions/PurchaseRequisitionApproval/RegisterPurchaseRequisitionApproval`;
  //getpurchaserequisitionList = `${environment.baseUrl}Transactions/PurchaseRequisitionMaster/GetPurchaseRequisitionList`;

  //Stockissues
  getbranchesnosList=`${environment.baseUrl}Transactions/Stockissues/GetbranchesnosList`;
  getStockissuesDeatilListLoad = `${environment.baseUrl}Transactions/Stockissues/GetInvoiceDetails`;
  gettingtobranchesList = `${environment.baseUrl}Transactions/Stockissues/GettobranchesList`;
  getStockissuesList = `${environment.baseUrl}Transactions/Stockissues/GetStockissuesList`;
  getStockissuesnosList = `${environment.baseUrl}Transactions/Stockissues/GetStackissueNo`;
  registerStockissues = `${environment.baseUrl}Transactions/Stockissues/RegisterStockissues`;
  GetProductLists = `${environment.baseUrl}Transactions/Stockissues/GetProductLists`;
  GetBranchesList = `${environment.baseUrl}Transactions/Stockissues/GetBranchesList`;
  getStockissuesDeatilList = `${environment.baseUrl}Transactions/Stockissues/GetStockissuesDeatilList`;
  GetToBranchesList = `${environment.baseUrl}Transactions/Stockissues/GetToBranchesList`;

   //Stockreceipts
  getStockreceiptsDeatilListLoad = `${environment.baseUrl}Transactions/Stockreceipt/GetInvoiceDetails`;
  gettingtobranchesListforstockreceipt = `${environment.baseUrl}Transactions/Stockreceipt/GettobranchesList`;
  getStockreceiptsList = `${environment.baseUrl}Transactions/Stockreceipt/GetStockreceiptsList`;
  getStockissuesreceiptnosList = `${environment.baseUrl}Transactions/Stockreceipt/GetReceiptNo`;
  GetProductListsforStockreceipts = `${environment.baseUrl}Transactions/Stockreceipt/GetProductLists`;
  registerStockreceipts = `${environment.baseUrl}Transactions/Stockreceipt/RegisterStockreceipts`;
  getStockreceiptDeatilList = `${environment.baseUrl}Transactions/Stockreceipt/GetStockreceiptDeatilList`;
  GetToBranchesStockreceiptsList = `${environment.baseUrl}Transactions/Stockreceipt/GetToBranchesList`;

  //Stockshorts
  getStockshortDeatilListLoad = `${environment.baseUrl}Transactions/Stockshort/GetInvoiceDetails`;
  GetCostCentersList = `${environment.baseUrl}Transactions/Stockshort/GetCostCentersList`;
  getstockshortvochernosList = `${environment.baseUrl}Transactions/Stockshort/GetstockshortVoucherNo`;
  GetProductListsforStockshortsList = `${environment.baseUrl}Transactions/Stockshort/GetProductLists`;
  registerStockshorts =`${environment.baseUrl}Transactions/Stockshort/RegisterStockshort`;
  getStockshortList = `${environment.baseUrl}Transactions/Stockshort/GetStockshortsList`;
  getStockshortsDeatilList = `${environment.baseUrl}Transactions/Stockshort/GetStockshortsDeatilList`;

  //oilconversion
  getoilcnvsnDeatilListLoad = `${environment.baseUrl}Transactions/Oilconversion/GetInvoiceDetails`;
  getOilconversionList = `${environment.baseUrl}Transactions/Oilconversion/GetOilconversionList`;
  getoilconversionvocherNo = `${environment.baseUrl}Transactions/Oilconversion/GetoilconversionVoucherNo`;
  GetProductListsforoilconversionList = `${environment.baseUrl}Transactions/Oilconversion/GetProductLists`;
  registerOilconversion = `${environment.baseUrl}Transactions/Oilconversion/RegisterOilconversion`;
  getOilconversionDeatilList = `${environment.baseUrl}Transactions/Oilconversion/GetOilconversionsDeatilList`;

 //Packageconversion
  GetproductNames = `${environment.baseUrl}Transactions/PackageConversion/GetproductNames`;
  getInputcodeproductList = `${environment.baseUrl}Transactions/PackageConversion/GetInputcodeList`;
  getPackageconversionList = `${environment.baseUrl}Transactions/PackageConversion/GetPackageConversionList`;
 registerPackageconversion = `${environment.baseUrl}Transactions/PackageConversion/RegisterPackageConversion`;
  updatePackageconversions = `${environment.baseUrl}Transactions/PackageConversion/UpdatePackageConversionList`;
 deletePackageconversions = `${environment.baseUrl}Transactions/PackageConversion/DeletePackageConversion`;

 // Stock Excess
  getStockexcessList = `${environment.baseUrl}transactions/StockExcess/GetStockexcessList`;
  getStockExcessBranchesList = `${environment.baseUrl}transactions/StockExcess/GetBranchesList`;
  getstockexcessNo = `${environment.baseUrl}transactions/StockExcess/GetstockexcessNo`;
  getStockExcessCostCentersList = `${environment.baseUrl}transactions/StockExcess/GetCostCentersList`;
  getProductListsforStockexcessList = `${environment.baseUrl}transactions/StockExcess/GetProductLists`;
  registerStockexcess = `${environment.baseUrl}transactions/StockExcess/RegisterStockexcess`;
  getStockExcessDetailsList = `${environment.baseUrl}transactions/StockExcess/GetStockExcessDetailsList`;

  // Meter Reading
  getMeterReadingList = `${environment.baseUrl}transactions/MeterReading/GetMeterReadingList`;
  getMeterReadingBranchesList = `${environment.baseUrl}transactions/MeterReading/GetBranchesList`;
  getPump = `${environment.baseUrl}transactions/MeterReading/GetPump`;
  getShift = `${environment.baseUrl}transactions/MeterReading/GetShift`;
  registerMeterReading = `${environment.baseUrl}transactions/MeterReading/RegisterMeterReading`;
  updateMeterReading = `${environment.baseUrl}transactions/MeterReading/UpdateMeterReading`;
  deleteMeterReading = `${environment.baseUrl}transactions/MeterReading/deleteMeterReading`;
  getOBFromPump = `${environment.baseUrl}transactions/MeterReading/GetOBFromPump`;
  getSaledUnits = `${environment.baseUrl}transactions/MeterReading/GetSaledUnits`;
  getMPump = `${environment.baseUrl}masters/Pump/GetPump`;

   // *******************************  End Transaction *****************************************


   // ******************************** GeneralLedger *********************************

   // AccountsGroup //
   getAccountsGroupList = `${environment.baseUrl}gl/AccGroup/GetAccountGroupList`;
   registerGlaccGroup = `${environment.baseUrl}gl/AccGroup/RegisterGlaccGroup`;
   updateAccountGroup = `${environment.baseUrl}gl/AccGroup/UpdateAccountGroup`;
   deleteAccountGroup = `${environment.baseUrl}gl/AccGroup/DeleteAccountGroup`;

   // SubGroup //
   getGLAccountSubGroupList = `${environment.baseUrl}gl/GLAccSubGroup/GetGLAccountSubGroupList`;
   registerGlaccSubGroup = `${environment.baseUrl}gl/GLAccSubGroup/RegisterGlaccSubGroup`;
   updateGLAccSubGroup = `${environment.baseUrl}gl/GLAccSubGroup/UpdateGLAccSubGroup`;
   deleteAccountSubGroup = `${environment.baseUrl}gl/GLAccSubGroup/DeleteAccountSubGroup`;
   getAccgrpList = `${environment.baseUrl}gl/GLAccSubGroup/GetGLAccountGroupList`;

   // UnderSubGroup //
   getGLUnderSubGroupList = `${environment.baseUrl}gl/GLAccUnderSubGroup/GetTblAccountGroupList`;
   getAccountNamelist = `${environment.baseUrl}gl/GLAccUnderSubGroup/GetAccountNamelist`;
   getGLUnderGroupList = `${environment.baseUrl}gl/GLAccUnderSubGroup/GetAccountGrouplist`;
   registerGLUnderSubGroup = `${environment.baseUrl}gl/GLAccUnderSubGroup/RegisterTblAccGroup`;
   updateGLAccUnderSubGroup = `${environment.baseUrl}gl/GLAccUnderSubGroup/UpdateTblAccountGroup`;
   deleteGLAccUnderSubGroup = `${environment.baseUrl}gl/GLAccUnderSubGroup/DeleteTblAccountGroup`;
   getglAccgrpList = `${environment.baseUrl}gl/GLAccUnderSubGroup/GetGLAccountGrouplist`;
   getAccountSubGrouplist = `${environment.baseUrl}gl/GLAccUnderSubGroup/GetAccountSubGrouplist`;

   // GL Accounts //
   getTblAccountLedgerList = `${environment.baseUrl}gl/AccountLedger/GetTblAccountLedgerList`;
   registerTblAccLedger = `${environment.baseUrl}gl/AccountLedger/RegisterTblAccLedger`;
   updateTblAccountLedger = `${environment.baseUrl}gl/AccountLedger/UpdateTblAccountLedger`;
   deleteTblAccountLedger = `${environment.baseUrl}gl/AccountLedger/DeleteTblAccountLedger`;
   getAccountGrouplist = `${environment.baseUrl}gl/AccountLedger/GetAccountGrouplist`;
   getAccountTypelist = `${environment.baseUrl}gl/AccountLedger/GetAccountTypelist`;
   getPaymentTypelist = `${environment.baseUrl}gl/AccountLedger/GetPaymentTypelist`;
   getPricingLevellist = `${environment.baseUrl}gl/AccountLedger/GetPricingLevellist`;

   // GL Subcode //
   getGLSubCodeList = `${environment.baseUrl}gl/GLSubCode/GetGLSubCodeList`;
   registerGlsubCode = `${environment.baseUrl}gl/GLSubCode/RegisterGlsubCode`;
   updateGLSubCode = `${environment.baseUrl}gl/GLSubCode/UpdateGLSubCode`;
   deleteGLSubCode = `${environment.baseUrl}gl/GLSubCode/DeleteGLSubCode`;
   getGLSubCodeAccountsList = `${environment.baseUrl}gl/GLSubCode/GetGLAccountsList`;

   // Tax Integration //
  getTaxintigrationList = `${environment.baseUrl}gl/TaxIntegration/GetTaxintigrationList`;
  registerTaxIntegration = `${environment.baseUrl}gl/TaxIntegration/GetTaxintigrationList`;
  updateTaxIntegration = `${environment.baseUrl}gl/TaxIntegration/GetTaxintigrationList`;
  deleteTaxIntegration = `${environment.baseUrl}gl/TaxIntegration/DeleteTaxIntegration`;
  getTaxCodesList = `${environment.baseUrl}gl/TaxIntegration/GetTaxCodesList`;
  getGLTaxAccountList = `${environment.baseUrl}gl/TaxIntegration/GetGLTaxAccountList`;
   

   // Cash Acc To Branches //
  getAsignCashAccBranchList = `${environment.baseUrl}gl/AsignmentCashAccBranch/GetAsignCashAccBranchList`;
  registerAsigCashAccBranch = `${environment.baseUrl}gl/AsignmentCashAccBranch/RegisterAsigCashAccBranch`;
  updateaAignmentCashAccBranch = `${environment.baseUrl}gl/AsignmentCashAccBranch/UpdateaAignmentCashAccBranch`;
  deleteAignmentCashAccBranch = `${environment.baseUrl}gl/AsignmentCashAccBranch/DeleteAignmentCashAccBranch`;
  getCashAccBranchesList = `${environment.baseUrl}gl/AsignmentCashAccBranch/GetBranchesList`;
  getBankAccounts = `${environment.baseUrl}gl/AsignmentCashAccBranch/GetBankAccounts`;
  getCashAccounts = `${environment.baseUrl}gl/AsignmentCashAccBranch/GetCashAccounts`;

   // Acc To Acc Class //
  getAsigAcctoAccclassList = `${environment.baseUrl}gl/AsignmentAcctoAccClass/GetAsigAcctoAccclassList`;
  registerAsigAcctoAccClass = `${environment.baseUrl}gl/AsignmentAcctoAccClass/RegisterAsigAcctoAccClass`;
  updateAccToAccClass = `${environment.baseUrl}gl/AsignmentAcctoAccClass/UpdateAccToAccClass`;
  deleteAccToAccClass = `${environment.baseUrl}gl/AsignmentAcctoAccClass/DeleteAccToAccClass`;
  getAccountingClass = `${environment.baseUrl}gl/AsignmentAcctoAccClass/GetAccountingClass`;
  getMatTranTypes = `${environment.baseUrl}gl/AsignmentAcctoAccClass/GetMatTranTypes`;
  getSalesGlAccounts = `${environment.baseUrl}gl/AsignmentAcctoAccClass/GetSalesGlAccounts`;
  getPurchaseGlAccounts = `${environment.baseUrl}gl/AsignmentAcctoAccClass/GetPurchaseGlAccounts`;
  getInventoryGlAccounts = `${environment.baseUrl}gl/AsignmentAcctoAccClass/GetInventoryGlAccounts`;
   

   // Voucher Types //
   getVoucherTypeList = `${environment.baseUrl}gl/VoucherType/GetVoucherTypeList`;
   registerVoucherTypes = `${environment.baseUrl}gl/VoucherType/RegisterVoucherTypes`;
   updateVoucherTypes = `${environment.baseUrl}gl/VoucherType/UpdateVoucherTypes`;
   deleteVoucherTypes = `${environment.baseUrl}gl/VoucherType/DeleteVoucherTypes`;
   getVoucherClassList = `${environment.baseUrl}gl/VoucherType/GetVoucherClassList`;
   getCompaniesList = `${environment.baseUrl}gl/VoucherType/GetCompaniesList`;
   getVoucherBranchesList = `${environment.baseUrl}gl/VoucherType/GetBranchesList`;

   // ******************************** END GeneralLedger *********************************

   // *******************************  Inventory *****************************************

   // BrandModel
   getBrandModelList = `${environment.baseUrl}Inventory/BrandModel/GetBrandModelList`;
   registerBrandModelList = `${environment.baseUrl}Inventory/BrandModel/RegisterBrandModel`;
   updateBrandModelList = `${environment.baseUrl}Inventory/BrandModel/UpdateBrandModel`;
   deleteBrandModelList = `${environment.baseUrl}Inventory/BrandModel/DeleteBrandModel`;
   getInputTypeCodeList = `${environment.baseUrl}Inventory/BrandModel/GetInputTaxes`;
   getOutputTypeCodeList = `${environment.baseUrl}Inventory/BrandModel/GetOutPutTaxes`;

   // Sizes
   getSizesList = `${environment.baseUrl}Inventory/Sizes/GetAllSizes`;
   registerSizesList = `${environment.baseUrl}Inventory/Sizes/RegisterSizes`;
   updateSizesList = `${environment.baseUrl}Inventory/Sizes/UpdateSize`;
   deleteSizesList = `${environment.baseUrl}Inventory/Sizes/DeleteSize`;

   // AccountingClass
   getAccountingClassList = `${environment.baseUrl}Inventory/AccountingClass/GetAllAccountingClass`;
   registerAccountingClassList = `${environment.baseUrl}Inventory/AccountingClass/RegisterAccountingClass`;
   updateAccountingClassList = `${environment.baseUrl}Inventory/AccountingClass/UpdateAccountingClass`;
   deleteAccountingClassList = `${environment.baseUrl}Inventory/AccountingClass/DeleteAccountingClass`;

   // Brand
   getBrandList = `${environment.baseUrl}Inventory/Brand/GetBbrandList`;
   registerBrandList = `${environment.baseUrl}Inventory/Brand/RegisterBrand`;
   updateBrandList = `${environment.baseUrl}Inventory/Brand/UpdateBrand`;
   deleteBrandList = `${environment.baseUrl}Inventory/Brand/DeleteBrand`;
   getCompanyList = `${environment.baseUrl}Inventory/ItemMaster/GetCompanysList`;

   // NoAssignment
   getNoAssignmentList = `${environment.baseUrl}Inventory/NoAssignment/GetNoAssignmentList`;
   registerNoAssignmentList = `${environment.baseUrl}Inventory/NoAssignment/RegisterNoAssignment`;
   updateNoAssignmentList = `${environment.baseUrl}Inventory/NoAssignment/UpdateNoAssignment`;
   deleteNoAssignmentList = `${environment.baseUrl}Inventory/NoAssignment/DeleteNoAssignment`;

   // MaterialGroups
   getMaterialGroupsList = `${environment.baseUrl}Inventory/MaterialGroup/GetAllMaterialGroup`;
   registerMaterialGroupsList = `${environment.baseUrl}Inventory/MaterialGroup/RegisterMaterialGroup`;
   updateMaterialGroupsList = `${environment.baseUrl}Inventory/MaterialGroup/UpdateMaterialGroup`;
   deleteMaterialGroupsList = `${environment.baseUrl}Inventory/MaterialGroup/DeleteMaterialGroup`;

   // ******************************* End  Inventory *****************************************


   // ******************************* Start  master *****************************************

   // company
   getCompanysList = `${environment.baseUrl}masters/Company/GetCompanysList`;
   registerCompany = `${environment.baseUrl}masters/Company/RegisterCompany`;
   updateCompany = `${environment.baseUrl}masters/Company/UpdateCompany`;
   deleteCompany = `${environment.baseUrl}masters/Company/DeleteCompany`;

  getrolelist = `${environment.baseUrl}UserCreation/GetRoleList`;


  // department
  getdepartmentlist = `${environment.baseUrl}masters/Department/getdepartmentlist`;
  registerdepartment = `${environment.baseUrl}masters/Department/registerdepartment`;
  updatedepartment = `${environment.baseUrl}masters/Department/updatedepartment`;
  deletedepartment = `${environment.baseUrl}masters/Department/deletedepartment`;
  
   // --- Branches
   getBranchesList = `${environment.baseUrl}masters/Branches/GetBranchesList`;
   registerBranch = `${environment.baseUrl}masters/Branches/RegisterBranch`;
   updateBranch = `${environment.baseUrl}masters/Branches/UpdateBranch`;
   deleteBranches = `${environment.baseUrl}masters/Branches/DeleteBranches`;
  // --- designation

  getDesignationsList = `${environment.baseUrl}masters/Designation/GetDesignationsList`;
  registerDesignations = `${environment.baseUrl}masters/Designation/RegisterDesignation`;
  updateDesignations = `${environment.baseUrl}masters/Designation/UpdateDesignation`;
  deleteDesignations = `${environment.baseUrl}masters/Designation/DeleteDesignation`;

   // --- division
  getDivisionsList = `${environment.baseUrl}masters/Division/GetDivisionsList`;
  registerDivision = `${environment.baseUrl}masters/Division/RegisterDivision`;
  updateDivision = `${environment.baseUrl}masters/Division/UpdateDivision`;
  deleteDivision = `${environment.baseUrl}masters/Division/DeleteDivision`;
  

   // --- Tax Master
   GetTaxTypes = `${environment.baseUrl}masters/TaxMaster/GetTaxTypes`;
   getTaxmastersList = `${environment.baseUrl}masters/TaxMaster/GetTaxmastersList`;
   registerTaxMasters = `${environment.baseUrl}masters/TaxMaster/RegisterTaxMasters`;
   updateTaxMaster = `${environment.baseUrl}masters/TaxMaster/UpdateTaxMaster`;
   deleteTaxMaster = `${environment.baseUrl}masters/TaxMaster/DeleteTaxMaster`;

   // --- Employee
   getEmployeeList = `${environment.baseUrl}Employee/GetEmployeeList`;
   registerEmployee = `${environment.baseUrl}Employee/RegisterEmployee`;
   updateEmployee = `${environment.baseUrl}Employee/UpdateEmployee`;
   deleteEmployee = `${environment.baseUrl}Employee/DeleteEmployee`;

  getBankMastersList = `${environment.baseUrl}Common/GetBankMastersList`;
   getCountryList = `${environment.baseUrl}Country/GetCountryList`;
   getAddressList = `${environment.baseUrl}Employee/GetAddressList`;
   getEducationList = `${environment.baseUrl}Employee/GetEducationList`;
   getExperianceList = `${environment.baseUrl}Employee/GetExperianceList`;
   getStatesList = `${environment.baseUrl}StateWiseGst/GetStatesList`;
   getFile = `${environment.baseUrl}Transactions/GetFile`;
   deleteEducation = `${environment.baseUrl}Employee/deleteEducation`;
   deleteExperiance = `${environment.baseUrl}Employee/deleteExperiance`;
   registerEmployeeAddress = `${environment.baseUrl}Employee/RegisterEmployeeAddress`;
   updateAddress = `${environment.baseUrl}Employee/UpdateAddress`;
   registerEducation = `${environment.baseUrl}Employee/RegisterEducation`;
   registerExperiance = `${environment.baseUrl}Employee/registerExperiance`;

   // --- EmployeeInBranch
  getAllEmployeesInBranch = `${environment.baseUrl}EmployeeInBranch/GetAllEmployeesInBranch`;
  getEmployeeInBranchList = `${environment.baseUrl}EmployeeInBranch/GetEmployeeList`;
  getBranchesBranchList = `${environment.baseUrl}EmployeeInBranch/GetBranchesList`;
  registerEmployeeInBranch = `${environment.baseUrl}EmployeeInBranch/RegisterEmployeeInBranch`;
  updateEmployeeInBranch = `${environment.baseUrl}EmployeeInBranch/UpdateEmployeeInBranch`;
  deleteEmployeeInBranch = `${environment.baseUrl}EmployeeInBranch/DeleteEmployeeInBranch`;
   

   // --- PartnerType
  getaccounttypelist = `${environment.baseUrl}masters/PartnerType/GetAccountTypesList`;
  getPartnerTypesList = `${environment.baseUrl}masters/PartnerType/GetPartnerTypeList`;
  registerPartnerType = `${environment.baseUrl}masters/PartnerType/RegisterPartnerType`;
  updatePartnerType = `${environment.baseUrl}masters/PartnerType/UpdatePartnerType`;
  deletePartnerType = `${environment.baseUrl}masters/PartnerType/DeletePartnerType`;


   // --- NoSeries
  getNoSeriesList = `${environment.baseUrl}masters/NoSeries/GetNoSeriesList`;
  registerNoSeries = `${environment.baseUrl}masters/NoSeries/RegisterNoSeries`;
  updateNoSeries = `${environment.baseUrl}masters/NoSeries/UpdateNoSeries`;
  deleteNoSeries = `${environment.baseUrl}masters/NoSeries/DeleteNoSeries`;
 

   // --- NoSeries - company
   getCompanyNoSeriesList = `${environment.baseUrl}masters/NoSeries/GetCompanyList`;
   getBranchesNoSeriesList = `${environment.baseUrl}masters/NoSeries/GetBranchesList`;
   getPartnerTypeNoSeriesList = `${environment.baseUrl}masters/NoSeries/GetPartnerTypeList`;


   // --- CostCenter
  GetCostCenterList = `${environment.baseUrl}masters/CostCenter/GetCostCenterList`;
  registerCostCenter = `${environment.baseUrl}masters/CostCenter/RegisterCostCenter`;
  updateCostCenter = `${environment.baseUrl}masters/CostCenter/UpdateCostCenter`;
  deleteCostCenter = `${environment.baseUrl}masters/CostCenter/DeleteCostCenter`;
   

   // --- PartnerCreation

   getCompaniesPartnerCreationList = `${environment.baseUrl}masters/PartnerCreation/GetCompaniesList`;
   getBranchesPartnerCreationList = `${environment.baseUrl}masters/PartnerCreation/GetBranchesList`;
   getPartnerPartnerCreationTypes = `${environment.baseUrl}masters/PartnerCreation/GetPartnerTypes`;
   getGlAccounts = `${environment.baseUrl}masters/PartnerCreation/GetGlAccounts`;
   getNatureList = `${environment.baseUrl}masters/PartnerCreation/GetNatureList`;
   getBalanceTypes = `${environment.baseUrl}masters/PartnerCreation/GetBalanceTypes`;
   getPartnerCreationList = `${environment.baseUrl}masters/PartnerCreation/GetPartnerCreationList`;
   registerPartnerCreation = `${environment.baseUrl}masters/PartnerCreation/RegisterCreation`;
   updatePartnerCreation = `${environment.baseUrl}masters/PartnerCreation/UpdatePartnerCreation`;
   deletePartnerCreation = `${environment.baseUrl}masters/PartnerCreation/DeletePartnerCreation`;

   // --- ProfitCenter
  getProfitCenterList = `${environment.baseUrl}masters/ProfitCenter/GetProfitCenterList`;
  registerProfitCenters = `${environment.baseUrl}masters/ProfitCenter/RegisterProfitCenters`;
  updateProfitCenters = `${environment.baseUrl}masters/ProfitCenter/UpdateProfitCenters`;
  deleteProfitCenters = `${environment.baseUrl}masters/ProfitCenter/DeleteProfitCenters`;

   // --- Segment
  getSegmentList = `${environment.baseUrl}masters/Segment/GetSegmentList`;
  registerSegment = `${environment.baseUrl}masters/Segment/RegisterSegment`;
  updateSegment = `${environment.baseUrl}masters/Segment/UpdateSegment`;
  deleteSegment = `${environment.baseUrl}masters/Segment/DeleteSegment`;
   
   // --- unit
   getunitList = `${environment.baseUrl}masters/Unit/GetUnitList`;
   registerunit = `${environment.baseUrl}masters/Unit/RegisterUnit`;
   updateunit = `${environment.baseUrl}masters/Unit/UpdateUnit`;
   deleteunit = `${environment.baseUrl}masters/Unit/DeleteUnit`;

   //tank
   Getbranchcodes = `${environment.baseUrl}masters/Tank/Getbranchcode`;
   GetBranches = `${environment.baseUrl}masters/Tank/GetBranches`;
   gettankList = `${environment.baseUrl}masters/Tank/GetTankList`;
   registertank = `${environment.baseUrl}masters/Tank/RegisterTank`;
   updatetank = `${environment.baseUrl}masters/Tank/UpdateTank`;
   deletetank = `${environment.baseUrl}masters/Tank/DeleteTank`;

   //pump
   GetProductGroupsNames = `${environment.baseUrl}masters/Pump/GetProductGroupsNames`;
   GetProductGroups = `${environment.baseUrl}masters/Pump/GetProductGroups`;
   GetBranchcodes = `${environment.baseUrl}masters/Pump/GetBranchcodes`;
   getpumpList = `${environment.baseUrl}masters/Pump/GetPumpList`;
   registerpump = `${environment.baseUrl}masters/Pump/RegisterPump`;
   updatepump = `${environment.baseUrl}masters/Pump/UpdatePump`;
   deletepump = `${environment.baseUrl}masters/Pump/DeletePump`;

   //productpacking
   getproductpackingList = `${environment.baseUrl}masters/Productpacking/GetProductpackingList`;
   registerproductpacking = `${environment.baseUrl}masters/Productpacking/RegisterProductpacking`;
   updateproductpacking = `${environment.baseUrl}masters/Productpacking/UpdateProductpacking`;
   deleteproductpacking = `${environment.baseUrl}masters/Productpacking/DeleteProductpacking`;

   //TaxGroup
   getTaxGroupList = `${environment.baseUrl}masters/Taxgroup/GetTaxgroupList`;
   registerTaxGroup = `${environment.baseUrl}masters/Taxgroup/RegisterTaxgroup`;
   updateTaxGroup = `${environment.baseUrl}masters/Taxgroup/UpdateTaxgroup`;
   deleteTaxGroup = `${environment.baseUrl}masters/Taxgroup/DeleteTaxgroup`;

   //TaxStructure
   getTaxStructureList = `${environment.baseUrl}masters/TaxStructure/GetTaxStructureList`;
   TaxGroupsLists = `${environment.baseUrl}masters/TaxStructure/GetTaxGroups`;
   PurchaseAccountsList = `${environment.baseUrl}masters/TaxStructure/GetPurchaseAccountss`;
   registerTaxStructure = `${environment.baseUrl}masters/TaxStructure/RegisterTaxStructure`;
   updateTaxStructure = `${environment.baseUrl}masters/TaxStructure/UpdateTaxStructure`;
   deleteTaxStructure = `${environment.baseUrl}masters/TaxStructure/DeleteTaxStructure`;

    //MSHSD Rates
    getMshsdRateList = `${environment.baseUrl}masters/MshsdRates/GetMshsdRateList`;
    getMshsdBranchesList = `${environment.baseUrl}masters/MshsdRates/GetBranchesList`;
    getProductList = `${environment.baseUrl}masters/MshsdRates/GetProductList`;
    registerMshsdRate = `${environment.baseUrl}masters/MshsdRates/RegisterMshsdRate`;
    updateMshsdRate = `${environment.baseUrl}masters/MshsdRates/UpdateMshsdRate`;
    deleteMshsdRate = `${environment.baseUrl}masters/MshsdRates/DeleteMshsdRate`;

//Product
    getProductMasterList = `${environment.baseUrl}masters/Product/GetProductList`;
    getSupplierGroupList = `${environment.baseUrl}masters/Product/GetSupplierGroupList`;
    getProductGroupList = `${environment.baseUrl}masters/Product/GetProductGroupList`;
    getTaxApplicableList = `${environment.baseUrl}masters/Product/GetTaxApplicableList`;
    getProductPackingList = `${environment.baseUrl}masters/Product/GetProductPackingList`;
    getTaxList = `${environment.baseUrl}masters/Product/GetTaxList`;
    getTaxGrouplist = `${environment.baseUrl}masters/Product/GetTaxGrouplist`;
    getUnitList = `${environment.baseUrl}masters/Product/GetUnitList`;
    getTaxStructure = `${environment.baseUrl}masters/Product/GetTaxStructure`;
    registerProduct = `${environment.baseUrl}masters/Product/RegisterProduct`;
    updateProduct = `${environment.baseUrl}masters/Product/UpdateProduct`;
    deleteProduct = `${environment.baseUrl}masters/Product/DeleteProduct`;
    
    //MemberMaster
   getTitles = `${environment.baseUrl}MemberMaster/GetTitles`;
   getVehicles = `${environment.baseUrl}MemberMaster/GetVehicles`;
   getStates = `${environment.baseUrl}MemberMaster/GetStates`;
   getPassbookStatuses = `${environment.baseUrl}MemberMaster/GetPassbookStatuses`;
   getRelations = `${environment.baseUrl}MemberMaster/GetRelations`;
   getVehicleTypes = `${environment.baseUrl}MemberMaster/GetVehicleTypes`;
   getMembersList = `${environment.baseUrl}MemberMaster/GetMembersList`;
   registerMemberMaster = `${environment.baseUrl}MemberMaster/RegisterMemberMaster`;
   updateMemberMaster = `${environment.baseUrl}MemberMaster/UpdateMemberMaster`;
   updateVehicle = `${environment.baseUrl}MemberMaster/UpdateVehicle`;
   getShareTransfer = `${environment.baseUrl}MemberMaster/GetShareTransfer`;
   getShareTransferNo = `${environment.baseUrl}MemberMaster/GetShareTransferNo`;
   getShareMembersList = `${environment.baseUrl}MemberMaster/GetShareMembersList`;
   getNoOfShares = `${environment.baseUrl}MemberMaster/GetNoOfShares`;
   getToMemberName = `${environment.baseUrl}MemberMaster/GetToMemberName`;
   registerShareTransfer = `${environment.baseUrl}MemberMaster/RegisterShareTransfer`;
   getAdditionalShareTransfer = `${environment.baseUrl}MemberMaster/GetAdditionalShareTransfer`;
   getAdditionalShareTransferNo = `${environment.baseUrl}MemberMaster/GetAdditionalShareTransferNo`;

   // opening balance
   getOpeningBalanceList = `${environment.baseUrl}masters/OpeningBalance/GetOpeningBalanceList`;
   getObBranchesList = `${environment.baseUrl}masters/OpeningBalance/GetBranchesList`;
   getObVoucherNo = `${environment.baseUrl}masters/OpeningBalance/GetVoucherNo`;
   getPaymentType = `${environment.baseUrl}masters/OpeningBalance/GetPaymentType`;
   registerOpeningBalance = `${environment.baseUrl}masters/OpeningBalance/RegisterOpeningBalance`;
  // updatedepartment = `${environment.baseUrl}masters/Department/updatedepartment`;
  // deletedepartment = `${environment.baseUrl}masters/Department/deletedepartment`;
   // ******************************* End  master *****************************************


   // ******************************* start  Payroll *****************************************

   //Leaveopeningbalance
  
   getLeaveTypeatListforlop = `${environment.baseUrl}masters/LeaveBalances/GetLeavetpeList`;
   getLeaveopeningbalanceList = `${environment.baseUrl}masters/LeaveBalances/GetLeaveBalancesList`;
  registerLeaveopeningbalance = `${environment.baseUrl}masters/LeaveBalances/RegisterLeaveBalancesList`;
   updateLeaveopeningbalance = `${environment.baseUrl}masters/LeaveBalances/UpdateLeaveBalancesList`;
   deleteLeaveopeningbalance = `${environment.baseUrl}masters/LeaveBalances/DeleteLeaveBalancesList`;

   //LeaveTypes
 
  getLeaveTypeatLists = `${environment.baseUrl}Selfservice/LeaveType/GetLeaveTypeList`;
   registerLeaveTypes = `${environment.baseUrl}Selfservice/LeaveType/RegisterLeaveType`;
   updateLeaveTypes = `${environment.baseUrl}Selfservice/LeaveType/UpdateLeaveType`;
   deleteLeaveTypes = `${environment.baseUrl}Selfservice/LeaveType/DeleteLeaveType`;

   //LeaveRequest
  
  getnoofdayscount = `${environment.baseUrl}Selfservice/LeaveRequest/Getnoofdayscount`;
  getEmpCode = `${environment.baseUrl}Selfservice/LeaveRequest/GetEmployeeCode`;
  getEmpName = `${environment.baseUrl}Selfservice/LeaveRequest/GetEmpName`;
  updateLeaveRequests = `${environment.baseUrl}Selfservice/LeaveRequest/UpdateLeaveapplying`;
  getLeaveTypeatList = `${environment.baseUrl}Selfservice/LeaveRequest/GetLeavetpesList`;
  getLeaveRequestList = `${environment.baseUrl}Selfservice/LeaveRequest/GetLeaveApplDetailsList`;
 //getLeaveRequestList = `${environment.baseUrl}Selfservice/LeaveRequest/GetLeaveApplDetailsList`;
  registerLeaveRequests = `${environment.baseUrl}Selfservice/LeaveRequest/RegisterLeaveapplying`;


  //Applyod
  applyodRequestList = `${environment.baseUrl}Selfservice/Applyod/GetApplyodDetailsList`;
  registerodRequest = `${environment.baseUrl}Selfservice/Applyod/RegisterApplyOddataDetails`;
  updateapplyodRequest = `${environment.baseUrl}Selfservice/Applyod/UpdateApplyod`;

  //Advance
  applyadvanceRequestList = `${environment.baseUrl}Selfservice/Advance/GetApplyAdvanceDetailsList`;
  registeradvanceRequest = `${environment.baseUrl}Selfservice/Advance/RegisterApplyAdvancedataDetails`;
  updateapplyadvanceRequest = `${environment.baseUrl}Selfservice/Advance/UpdateAdvancedataDetails`;
  getAdvancetypeList = `${environment.baseUrl}Selfservice/Advance/GetAdvancedataDetailslist`;

  //PermissionRequest
  permissionRequestList = `${environment.baseUrl}Selfservice/PermissionRequest/GetPermissionApplDetailsList`;
  registerpermissionRequest = `${environment.baseUrl}Selfservice/PermissionRequest/RegisterPermissionapplying`;
  updatepermissionRequest = `${environment.baseUrl}Selfservice/PermissionRequest/UpdatePermissionapplying`;

   //PT Master
  getPTList = `${environment.baseUrl}payroll/PTMaster/GetPTList`;
  registerPT = `${environment.baseUrl}payroll/PTMaster/RegisterPT`;
  updatePT = `${environment.baseUrl}payroll/PTMaster/UpdatePT`;
  deletePT = `${environment.baseUrl}payroll/PTMaster/DeletePT`;
  
   // Component Master
  getComponentsList = `${environment.baseUrl}payroll/ComponentMaster/GetComponentsList`;
  registerComponent = `${environment.baseUrl}payroll/ComponentMaster/RegisterComponent`;
  getConfigurationList = `${environment.baseUrl}payroll/ComponentMaster/GetConfigurationList`;
  updateComponent = `${environment.baseUrl}payroll/ComponentMaster/UpdateComponent`;
  deleteComponent = `${environment.baseUrl}payroll/ComponentMaster/DeleteComponent`;
  

   //PF Master
  getPfComponentsList = `${environment.baseUrl}payroll/PFMaster/GetComponentsList`;
  getPfList = `${environment.baseUrl}payroll/PFMaster/GetPFList`;
  registerPF = `${environment.baseUrl}payroll/PFMaster/RegisterPF`;
  updatePF = `${environment.baseUrl}payroll/PFMaster/UpdatePF`;
  deletePF = `${environment.baseUrl}payroll/PFMaster/DeletePF`;
 
  //approvaltype
  getempList = `${environment.baseUrl}Selfservice/ApprovalType/GetEmployeesList`;
  getapprovaltypeList = `${environment.baseUrl}Selfservice/ApprovalType/GetApprovalTypesList`;
  registerapprovaltype = `${environment.baseUrl}Selfservice/ApprovalType/RegisterApprovalType`;
  updateapprovaltype = `${environment.baseUrl}Selfservice/ApprovalType/UpdateApprovalType`;
  deleteapprovaltype = `${environment.baseUrl}Selfservice/ApprovalType/DeleteApprovalType`;

  
   //CTC Breakup
   getCTCList = `${environment.baseUrl}payroll/CTCBreakup/GetCTCList`;
   getStructureList = `${environment.baseUrl}payroll/CTCBreakup/GetStructureList`;
   getctcComponentsList = `${environment.baseUrl}payroll/ComponentMaster/GetComponentsList`;

   // Structure Creation
   getStructuresList = `${environment.baseUrl}payroll/StructureCreation/GetStructuresList`;
   registerStructure = `${environment.baseUrl}payroll/StructureCreation/RegisterStructure`;
   updateStructure = `${environment.baseUrl}payroll/StructureCreation/UpdateStructure`;
   deleteStructure = `${environment.baseUrl}payroll/StructureCreation/DeleteStructure`;
   getStructureComponentsList = `${environment.baseUrl}payroll/StructureCreation/GetComponentsList`;
   getPFList = `${environment.baseUrl}payroll/StructureCreation/GetPFList`;

  //OdApproval
  getOdApplDetailsList = `${environment.baseUrl}Selfservice/OdApproval/GetOdApprovalApplDetailsList`;
  RegisterOdApprovalDetails = `${environment.baseUrl}Selfservice/OdApproval/GetOdApprovalApplDetailsList`;

  //AdvanceApproval
  getAdvanceApplDetailsList = `${environment.baseUrl}Selfservice/AdvanceApproval/GetAdvanceApprovalApplDetailsList`;
  RegisterAdvanceApprovalDetails = `${environment.baseUrl}Selfservice/AdvanceApproval/RegisterAdvanceApprovalDetails`;


  //Permission RequestApproval
  getPermissionrqstApplDetailsList = `${environment.baseUrl}Selfservice/PermissionApproval/GetPermissionApprovalApplDetailsList`;
  RegisterPermissionrqstApprovalDetails = `${environment.baseUrl}Selfservice/PermissionApproval/RegisterPermissionApprovalDetails`;

  
  //VehicleRequisition
  applyvehiclerqsnRequestList = `${environment.baseUrl}Selfservice/VehicleRequesition/GetApplyVehicleRequesitionDetailsList`;
  registervehiclerqsnRequest = `${environment.baseUrl}Selfservice/VehicleRequesition/RegisterApplyVehicleRequesitiondataDetails`;
  updatevehiclerqsnRequest = `${environment.baseUrl}Selfservice/VehicleRequesition/UpdateApplyVehicleRequesition`;

  //VehicleApproval
  getVehicleApplDetailsList = `${environment.baseUrl}Selfservice/VehicleApproval/GetVehicleApprovalApplDetailsList`;
  RegisterVehicleApprovalDetails = `${environment.baseUrl}Selfservice/VehicleApproval/RegisterVehicleApprovalDetails`;


   // Leave Approval
  getLeaveApplDetailsList = `${environment.baseUrl}Selfservice/LeaveApproval/GetLeaveApplDetailsList`;
  RegisterLeaveApprovalDetails = `${environment.baseUrl}Selfservice/LeaveApproval/RegisterLeaveApprovalDetails`;
 
 //gift master 
  getGiftProductList=`${environment.baseUrl}MemberMaster/GetProducts`;
  getGiftList=`${environment.baseUrl}MemberMaster/GetGifts`;
  addGift=`${environment.baseUrl}MemberMaster/AddGifts`;
  updateGift=`${environment.baseUrl}MemberMaster/UpdateGift`;

//   getGiftProductList=`${environment.baseUrl}MemberMaster/GetProducts`;
//   getGiftList=`${environment.baseUrl}MemberMaster/GetGifts`;
//   addGift=`${environment.baseUrl}MemberMaster/AddGifts`;
//   updateGift=`${environment.baseUrl}MemberMaster/UpdateGift`;
  // ******************************* End  master *****************************************


 //Reports
   getMemberMaster = `${environment.baseUrl}Reports/MemberMasterReport/GetMemberMasterReportData`;

   getEmployeeRegister = `${environment.baseUrl}Reports/EmployeeRegisterReport/GetEmployeeRegisterReportData`;

   getAccountLedger = `${environment.baseUrl}Reports/AccountLedgerReport/GetAccountLedgerReportData`;
   getAccountLedgersList=`${environment.baseUrl}Reports/AccountLedgerReport/GetAccountLedgersList`;

   getSaleValueReport = `${environment.baseUrl}Reports/SaleValueReport/GetSaleValueReportData`;
   getReportBranchList=`${environment.baseUrl}Reports/SaleValueReport/GetReportBranchList`;

   getDefaultShiftReport=`${environment.baseUrl}Reports/ShiftViewReport/GetDefaultShiftReportDataTableList`
   getShiftViewReport = `${environment.baseUrl}Reports/ShiftViewReport/GetShiftViewReportList`;

   getVehicalReport=`${environment.baseUrl}Reports/VehicalReport/GetVehicalReportData`;

   getIntimateSaleReport=`${environment.baseUrl}Reports/IntimateSaleReport/GetIntimateSaleReportData`;

   getSalesGSTReport=`${environment.baseUrl}Reports/SalesGSTReport/GetSalesGSTReportData`;

   getDailySalesReport=`${environment.baseUrl}Reports/DailySalesReport/GetDailySalesReport`;

   getStockVerificationReport=`${environment.baseUrl}Reports/StockVerificationReport/GetStockVerificationReportData`;

   getStockLedgerForAllProducts=`${environment.baseUrl}Reports/StockLedgerReport/GetStockLedgerReportData`;
   getStockProducts=`${environment.baseUrl}Reports/StockLedgerReport/GetStockProductList`;

   getSalesAnalysisByBranch=`${environment.baseUrl}Reports/SalesAnalysisByBranch/GetSalesAnalysisByBranchrReportData`;

   getTwoFourehrsSalesStockReport=`${environment.baseUrl}Reports/TwoFourehrsSalesStockReport/Get24hrsSalesStockReportData`;

   getProductWiseMonthlyPurchaseReport=`${environment.baseUrl}Reports/ProductWiseMonthlyPurchaseReport/GetProductWiseMonthlyPurchaseReportData`;

   getProductPriceListReport=`${environment.baseUrl}Reports/ProductPriceList/GetProductPriceListReportData`;

   getReceiptsAndPyamentDetailedReportData=`${environment.baseUrl}Reports/ReceiptsAndPyamentDetailedReport/GetReceiptsAndPyamentDetailedReportData`;

   getReceiptsAndPaymentSummaryReportData=`${environment.baseUrl}Reports/ReceiptsAndPaymentSummaryReport/GetReceiptsAndPaymentSummaryReportData`;

   getSMSSummaryReportData=`${environment.baseUrl}Reports/SMSSummaryReport/GetSMSSummaryReportData`;

   getOneDaySaleValueReportData=`${environment.baseUrl}Reports/OneDaySaleValueReport6amTo6am/GetOneDaySaleValueReportData`;

   getTrialBalanceReportData=`${environment.baseUrl}Reports/TrialBalanceReport/GetTrialBalanceReportData`;

   getMeterReadingReportData=`${environment.baseUrl}Reports/MeterReadingReport/GetMeterReadingReportData`;

   getClosingBalanceReportData=`${environment.baseUrl}Reports/ClosingBalanceReport/GetClosingBalanceReportData`;

   getBankReconciliationReportData=`${environment.baseUrl}Reports/BankReconciliationReport/GetBankReconciliationReportData`;

   getStockValuationReportData=`${environment.baseUrl}Reports/StockValuationReport/GetStockValuationReportData`;

   getStockTransferPrintReportData=`${environment.baseUrl}Reports/StockTransferPrintReport/GetStockTransferPrintReportData`;

   getFourColumnCashBookReportData=`${environment.baseUrl}Reports/FourColumnCashBookReport/GetFourColumnCashBookReportData`;

   getBranchWiseMonthlySalesByLtrsReportData=`${environment.baseUrl}Reports/BranchWiseMonthlySalesByLtrs/GetBranchWiseMonthlySalesByLtrsReportData`;

   getReportPGList=`${environment.baseUrl}Reports/BranchWiseMonthlySalesByLtrs/GetReportPGList`;

   getReportSGList=`${environment.baseUrl}Reports/BranchWiseMonthlySalesByLtrs/GetSupplierGroupList`;

   getProductMonthWisePurchaseLtrsReportData=`${environment.baseUrl}Reports/ProductMonthWisePurchaseLtrs/GetProductMonthWisePurchaseLtrsReportData`;

   getBranchWiseStockStatementLtrsReportData=`${environment.baseUrl}Reports/BranchWiseStockStatementLtrs/GetBranchWiseStockStatementLtrsReportData`;

   getBranchWiseStockStatementQtyReportData=`${environment.baseUrl}Reports/BranchWiseStockStatementQty/GetBranchWiseStockStatementQtyReportData`;

  getEInvoiceReportData=`${environment.baseUrl}Reports/EInvoiceReport/GetEInvoiceReportData`;


   
 /****************************** Settings *********************************************************** */
   getRoles = `${environment.baseUrl}Auth/getRoles`;
   getParentMenus = `${environment.baseUrl}Auth/getParentMenu`;
   getMenuList = `${environment.baseUrl}Auth/getMenuList`;
   giveAccess = `${environment.baseUrl}Auth/GiveAccess`;


}

