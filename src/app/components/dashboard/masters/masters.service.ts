import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../services/api-config.service';
import { CompanyComponent } from './company/company.component';
import { BranchesComponent } from './branches/branches.component';
import { DivisionComponent } from './division/division.component';
import { SegmentComponent } from './segment/segment.component';
import { ProfitCenterComponent } from './profit-center/profit-center.component';
import { CostCenterComponent } from './cost-center/cost-center.component';
import { EmployeeInBranchComponent } from './employee-in-branch/employee-in-branch.component';
import { EmployeeComponent } from './employee/employee.component';
import { TanksComponent } from './tank/tank.componet';
import { PumpComponent } from './pump/pump.component';
import { MSHSDRatesComponent } from './mshsdrates/mshsdrates.component';
import { MemberMasterComponent } from './member-master/member-master.component';
import { VehicleComponent } from './member-master/vehicle/vehicle.component';
import { DesignationComponent } from './designation/designation.component';
import { DepartmentComponent } from './department/department.component';
import { OpeningBalanceComponent } from './openingBalance/openingBalance.component';
import { MeterReadingComponent } from '../transactions/meterreading/meterreading.component';
import { PackageconversionComponent } from '../transactions/packageconversion/packageconversion.component';
import { ErpUsersComponent } from './erpuser/erpuser.componet';
import { BankMasterComponent } from './bankmaster/bankmaster.component';
import { UserassignmentinbranchComponent } from './userassignmentinbranch/userassignmentinbranch.component';
import { LedgerComponent } from './ledger/ledger.component';
import { OpenLedgerComponent } from './openledger/openledger.component';
import { ComponentMasterComponent } from '../payroll/componentmaster/componentmaster.component';
import { PTMasterComponent } from '../payroll/ptmaster/ptmaster.component';
import { CTCBreakupComponent } from '../payroll/ctcbreakup/ctcbreakup.component';
import { StructureCreationComponent } from '../payroll/structure-creation/structure-creation.component';
import { PFMasterComponent } from '../payroll/pfmaster/pfmaster.component';
import { SalaryProcessComponent } from '../payroll/salaryproces/salaryprocess.component';
import { VoucherClassComponent } from './voucherclass/voucherclass.component';
import { VoucherTypesComponent } from './vouchertypes/vouchertypes.component';
import { VoucherSeriesComponents } from './voucherseries/voucherseries.component';
import { AssignmentVoucherSeriestoVoucherTypesComponent } from './assignmentvoucherseriestovouchertype/assignmentvoucherseriestovouchertype.component';
import { TaxIntegrationComponent } from './taxintegration/taxintegration.component';
import { TaxRatesComponents } from './taxrates/taxrates.component';
import { TaxTransactionComponent } from './taxtransaction/taxtransaction.component';
import { AssignmentoftaxaccountstotaxcodesComponent } from './assignmentoftaxaccountstotaxcodes/assignmentoftaxaccountstotaxcodes.component';
import { HsnSacComponent } from './hsnsac/hsnsac.component';
import { TDSComponent } from './tdstype/tdstype.component';
import { TdsRatesComponent } from './tdsrates/tdsrates.component';
import { IncomeTypeComponent } from './incometypes/incometypes.component';
import { PostingComponent } from './posting/posting.component';
import { AccountchartComponent } from './chartofaccount/chartofaccount.component';
import { financialstatementComponent } from './financialstatement/financialstatement.component';
import { UndersubGroupComponent } from './undersubgroup/undersubgroup.component';
import { AssignGLaccounttoSubGroupComponent } from './assignglaccount/assignglaccount.component';
import { AssignmentChartAccounttoCompanyComponent } from './AssignmentChartAccounttoCompany/AssignmentChartAccounttoCompany.component';


@Injectable({
  providedIn: 'root'
})
export class MastersService {
  dynamicData = { url: '', component: null, registerUrl: '', listName: '', updateUrl: '', primaryKey: '', deleteUrl: '', tabScreen: '' };
  branchCode: any;
  role: any;
  editData: any;

  constructor(
    private apiConfigService: ApiConfigService
  ) { }

  getRouteUrls(data) {
    const user = JSON.parse(localStorage.getItem('user'));
    switch (data) {
      case 'company':
        this.dynamicData.url = this.apiConfigService.getCompanysList;
        this.dynamicData.component = CompanyComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerCompany;
        this.dynamicData.updateUrl = this.apiConfigService.updateCompany;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteCompany;
        this.dynamicData.listName = 'companiesList';
        this.dynamicData.primaryKey = 'companyId';
        return this.dynamicData;
        break;
      case 'department':
        this.dynamicData.url = this.apiConfigService.getdepartmentlist;
        this.dynamicData.component = DepartmentComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerdepartment;
        this.dynamicData.updateUrl = this.apiConfigService.updatedepartment
        this.dynamicData.deleteUrl = this.apiConfigService.deletedepartment;
        this.dynamicData.listName = 'departmenList';
        this.dynamicData.primaryKey = 'departmentId';
        return this.dynamicData;
        break;
      case 'branches':
        this.dynamicData.url = this.apiConfigService.getBranchesList;
        this.dynamicData.component = BranchesComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerBranch;
        this.dynamicData.updateUrl = this.apiConfigService.updateBranch;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteBranches;
        this.dynamicData.listName = 'branchesList';
        this.dynamicData.primaryKey = 'branchCode';
        return this.dynamicData;
        break;
      case 'designation':
        this.dynamicData.url = this.apiConfigService.getDesignationsList;
        this.dynamicData.component = DesignationComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerDesignations;
        this.dynamicData.updateUrl = this.apiConfigService.updateDesignations;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteDesignations;
        this.dynamicData.listName = 'designationsList';
        this.dynamicData.primaryKey = 'designationId';
        return this.dynamicData;
        break;
      case 'division':
        this.dynamicData.url = this.apiConfigService.getDivisionsList;
        this.dynamicData.component = DivisionComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerDivision;
        this.dynamicData.updateUrl = this.apiConfigService.updateDivision;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteDivision;
        this.dynamicData.listName = 'divisionsList';
        this.dynamicData.primaryKey = 'code';
        return this.dynamicData;
        break;
      case 'segment':
        this.dynamicData.url = this.apiConfigService.getSegmentList;
        this.dynamicData.component = SegmentComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerSegment;
        this.dynamicData.updateUrl = this.apiConfigService.updateSegment;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteSegment;
        this.dynamicData.listName = 'segmentList';
        this.dynamicData.primaryKey = 'seqId';
        return this.dynamicData;
        break;
      case 'profitCenter':
        this.dynamicData.url = this.apiConfigService.getProfitCenterList;
        this.dynamicData.component = ProfitCenterComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerProfitCenters;
        this.dynamicData.updateUrl = this.apiConfigService.updateProfitCenters;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteProfitCenters;
        this.dynamicData.listName = 'profitCenterList';
        this.dynamicData.primaryKey = 'seqId';
        return this.dynamicData;
        break;

      case 'costcenter':
        this.dynamicData.url = this.apiConfigService.GetCostCenterList;
        this.dynamicData.component = CostCenterComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerCostCenter;
        this.dynamicData.updateUrl = this.apiConfigService.updateCostCenter;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteCostCenter;
        this.dynamicData.listName = 'costcenterList';
        this.dynamicData.primaryKey = 'code';
        return this.dynamicData;
        break;

      case 'employeeInBranch':
        this.dynamicData.url = [this.apiConfigService.getAllEmployeesInBranch, user.branchCode].join('/');
        //this.dynamicData.url = this.apiConfigService.getAllEmployeesInBranch;
        this.dynamicData.component = EmployeeInBranchComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerEmployeeInBranch;
        this.dynamicData.updateUrl = this.apiConfigService.updateEmployeeInBranch;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteEmployeeInBranch;
        this.dynamicData.listName = 'empinbrList';
        this.dynamicData.primaryKey = 'seqId';
        return this.dynamicData;
        break;
      case 'employee':
        this.dynamicData.url = this.apiConfigService.getEmployeeList;
        this.dynamicData.component = EmployeeComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerEmployee;
        this.dynamicData.updateUrl = this.apiConfigService.updateEmployee;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteEmployee;
        this.dynamicData.listName = 'employeesList';
        this.dynamicData.primaryKey = 'employeeCode';
        this.dynamicData.tabScreen = 'True';
        return this.dynamicData;
        break;
      case 'tank':
        this.dynamicData.url = this.apiConfigService.gettankList;
        this.dynamicData.component = TanksComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registertank;
        this.dynamicData.updateUrl = this.apiConfigService.updatetank;
        this.dynamicData.deleteUrl = this.apiConfigService.deletetank;
        this.dynamicData.listName = 'tankList';
        this.dynamicData.primaryKey = 'tankId';
        return this.dynamicData;
        break;
      case 'pump':
        this.dynamicData.url = this.apiConfigService.getpumpList;
        this.dynamicData.component = PumpComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerpump;
        this.dynamicData.updateUrl = this.apiConfigService.updatepump;
        this.dynamicData.deleteUrl = this.apiConfigService.deletepump;
        this.dynamicData.listName = 'pumplist';
        this.dynamicData.primaryKey = 'pumpId';
        return this.dynamicData;
        break;

      case 'mshsdrates':
        this.dynamicData.url = `${this.apiConfigService.getMshsdRateList}/${user.branchCode}/${user.role}`;
        this.dynamicData.component = MSHSDRatesComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerMshsdRate;
        this.dynamicData.updateUrl = this.apiConfigService.updateMshsdRate;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteMshsdRate;
        this.dynamicData.listName = 'mshsdRateList';
        this.dynamicData.primaryKey = 'id';
        return this.dynamicData;
        break;

      case 'membermaster':
        this.dynamicData.url = this.apiConfigService.getMembersList;
        this.dynamicData.component = MemberMasterComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerMemberMaster;
        this.dynamicData.updateUrl = this.apiConfigService.updateMemberMaster;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteTaxStructure;
        this.dynamicData.listName = 'membersList';
        this.dynamicData.primaryKey = 'MemberId';
        return this.dynamicData;
        break;
      case 'vehicle':
        this.dynamicData.url = this.apiConfigService.getVehicles;
        this.dynamicData.component = VehicleComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerMemberMaster;
        this.dynamicData.updateUrl = this.apiConfigService.updateVehicle;
        // this.dynamicData.deleteUrl = this.apiConfigService.deleteTaxStructure;
        this.dynamicData.listName = 'VehicleList';
        this.dynamicData.primaryKey = 'VehicleId';
        return this.dynamicData;
        break;
      case 'openingbalance':
        this.dynamicData.url = this.apiConfigService.getOpeningBalanceList;
        this.dynamicData.component = OpeningBalanceComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerOpeningBalance;
        this.dynamicData.updateUrl = this.apiConfigService.updateOpeningBalance
        this.dynamicData.deleteUrl = this.apiConfigService.deleteOpeningBalance;
        this.dynamicData.listName = 'openingBList';
        this.dynamicData.primaryKey = 'openingBalanceId';
        return this.dynamicData;
        break;

      case 'meterreading':
        this.dynamicData.url = `${this.apiConfigService.getMeterReadingList}/${this.branchCode}/${this.role}`;
        this.dynamicData.component = MeterReadingComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerMeterReading;
        this.dynamicData.updateUrl = this.apiConfigService.updateMeterReading;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteMeterReading;
        this.dynamicData.listName = 'MeterReadingList';
        this.dynamicData.primaryKey = 'meterReadingId';
        // this.dynamicData.coustom = true;
        return this.dynamicData;
        break;
      case 'packageconversion':
        this.dynamicData.url = this.apiConfigService.getPackageconversionList;
        this.dynamicData.component = PackageconversionComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerPackageconversion;
        this.dynamicData.updateUrl = this.apiConfigService.updatePackageconversions;
        this.dynamicData.deleteUrl = this.apiConfigService.deletePackageconversions;
        this.dynamicData.listName = 'packageconversionsList';
        this.dynamicData.primaryKey = 'packingConversionId';
        // this.dynamicData.coustom = true;
        return this.dynamicData;
      case 'erpuser':
        this.dynamicData.url = this.apiConfigService.getUsersList;
        this.dynamicData.component = ErpUsersComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerErpUser;
        this.dynamicData.updateUrl = this.apiConfigService.updateErpUser;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteErpUser;
        this.dynamicData.listName = 'ScreenNames';
        this.dynamicData.primaryKey = 'userName';
        // this.dynamicData.coustom = true;
        return this.dynamicData;
      case 'bankmaster':
        this.dynamicData.url = this.apiConfigService.getBankMasterLists;
        this.dynamicData.component = BankMasterComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerBankMaster;
        this.dynamicData.updateUrl = this.apiConfigService.updateBankMaster;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteBankMaster;
        this.dynamicData.listName = 'bankList';
        this.dynamicData.primaryKey = 'bankCode';
        // this.dynamicData.coustom = true;
        return this.dynamicData;
      case 'userassignmentinbranch':
        this.dynamicData.url = this.apiConfigService.getUserInBranch;
        this.dynamicData.component = UserassignmentinbranchComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerUserBranchCreation;
        this.dynamicData.updateUrl = this.apiConfigService.updateUserBranch;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteUserBranch;
        this.dynamicData.listName = 'userList';
        this.dynamicData.primaryKey = 'userId';
        // this.dynamicData.coustom = true;
        return this.dynamicData;
      case 'ledger':
        this.dynamicData.url = this.apiConfigService.getLedgerList;
        this.dynamicData.component = LedgerComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerLedger;
        this.dynamicData.updateUrl = this.apiConfigService.updateLedger;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteLedger;
        this.dynamicData.listName = 'ledgerList';
        this.dynamicData.primaryKey = 'code';
        return this.dynamicData;
      case 'openledger':
        this.dynamicData.url = this.apiConfigService.getOpenLedgerList;
        this.dynamicData.component = OpenLedgerComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerOpenLedger;
        this.dynamicData.updateUrl = this.apiConfigService.updateOpenLedger;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteOpenLedger;
        this.dynamicData.listName = 'OpenLedgerList';
        this.dynamicData.primaryKey = 'ledgerKey';
        return this.dynamicData;
      case 'componentmaster':
        this.dynamicData.url = this.apiConfigService.getComponentsList;
        this.dynamicData.component = ComponentMasterComponent;
        this.dynamicData.registerUrl = [this.apiConfigService.registerComponent, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.updateUrl = [this.apiConfigService.updateComponent, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.deleteUrl = this.apiConfigService.deleteComponent;
        this.dynamicData.listName = 'componentsList';
        this.dynamicData.primaryKey = 'componentCode';
        return this.dynamicData;

      case 'ptmaster':
        this.dynamicData.url = this.apiConfigService.getPTList;
        this.dynamicData.component = PTMasterComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerPT;
        this.dynamicData.updateUrl = this.apiConfigService.updatePT;
        this.dynamicData.deleteUrl = this.apiConfigService.deletePT;
        this.dynamicData.listName = 'ptList';
        this.dynamicData.primaryKey = 'id';
        return this.dynamicData;


      case 'CTCBreakup':
        this.dynamicData.url = this.apiConfigService.getCTCList;
        this.dynamicData.component = CTCBreakupComponent;
        this.dynamicData.listName = 'structuresList';
        this.dynamicData.primaryKey = 'structureCode';
        return this.dynamicData;

      case 'structureCreation':
        this.dynamicData.url = this.apiConfigService.getStructuresList;
        this.dynamicData.component = StructureCreationComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerStructure;
        this.dynamicData.updateUrl = this.apiConfigService.updateStructure;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteStructure;
        this.dynamicData.listName = 'structuresList';
        this.dynamicData.primaryKey = 'structureCode';
        return this.dynamicData;

      case 'pfmaster':
        this.dynamicData.url = this.apiConfigService.getPfList;
        this.dynamicData.component = PFMasterComponent;
        this.dynamicData.registerUrl = [this.apiConfigService.registerPF, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.updateUrl = [this.apiConfigService.updatePF, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.deleteUrl = this.apiConfigService.deletePF;
        this.dynamicData.listName = 'pfList';
        this.dynamicData.primaryKey = 'id';
        return this.dynamicData;

      case 'voucherclass':
        this.dynamicData.url = this.apiConfigService.getVoucherTypeList;
        this.dynamicData.component = VoucherClassComponent;
        this.dynamicData.registerUrl = [this.apiConfigService.registerVoucherClass, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.updateUrl = [this.apiConfigService.updateVoucherClass, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.deleteUrl = this.apiConfigService.deleteVoucherClass;
        this.dynamicData.listName = 'vcList';
        this.dynamicData.primaryKey = 'voucherKey';
        return this.dynamicData;

      case 'vouchertype':
        this.dynamicData.url = this.apiConfigService.getVoucherTypeList;
        this.dynamicData.component = VoucherTypesComponent;
        this.dynamicData.registerUrl = [this.apiConfigService.registerVoucherTypes, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.updateUrl = [this.apiConfigService.updateVoucherTypes, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.deleteUrl = this.apiConfigService.deleteVoucherClass;
        this.dynamicData.listName = 'GLSubCodeList';
        this.dynamicData.primaryKey = 'voucherTypeId';
        return this.dynamicData;

      case 'voucherseries':
        this.dynamicData.url = this.apiConfigService.getVoucherSeriesList;
        this.dynamicData.component = VoucherSeriesComponents;
        this.dynamicData.registerUrl = [this.apiConfigService.registerVoucherSeries, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.updateUrl = [this.apiConfigService.updateVoucherSeries, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.deleteUrl = this.apiConfigService.deleteVoucherSeries;
        this.dynamicData.listName = 'vseriesList';
        this.dynamicData.primaryKey = 'voucherSeriesKey';
        return this.dynamicData;

      case 'AssignVoucherseriestoVouchertype':
        this.dynamicData.url = this.apiConfigService.getAssignmentVoucherSeriestoVoucherTypeList;
        this.dynamicData.component = AssignmentVoucherSeriestoVoucherTypesComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerAssignmentVoucherSeriestoVoucherType;
        this.dynamicData.updateUrl = this.apiConfigService.updateAssignmentVoucherSeriestoVoucherType;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteAssignmentVoucherSeriestoVoucherType;
        this.dynamicData.listName = 'avsvsList';
        this.dynamicData.primaryKey = 'id';
        return this.dynamicData;


      case 'taxtypes':
        this.dynamicData.url = this.apiConfigService.getTaxTypesList;
        this.dynamicData.component = TaxIntegrationComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerTaxTypes;
        this.dynamicData.updateUrl = this.apiConfigService.updateTaxTypes;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteTaxTypes;
        this.dynamicData.listName = 'TaxtypesList';
        this.dynamicData.primaryKey = 'taxKey';
        return this.dynamicData;

      case 'taxrates':
        this.dynamicData.url = this.apiConfigService.getTaxRatesList;
        this.dynamicData.component = TaxRatesComponents;
        this.dynamicData.registerUrl = this.apiConfigService.registerTaxRates;
        this.dynamicData.updateUrl = this.apiConfigService.updateTaxRates;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteTaxRates;
        this.dynamicData.listName = 'TaxratesList';
        this.dynamicData.primaryKey = 'taxRateCode';
        return this.dynamicData;

      case 'taxtransactions':
        this.dynamicData.url = this.apiConfigService.getTaxTransactionList;
        this.dynamicData.component = TaxTransactionComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerTaxTransaction;
        this.dynamicData.updateUrl = this.apiConfigService.updateTaxTransaction;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteTaxTransaction;
        this.dynamicData.listName = 'TaxtransactionList';
        this.dynamicData.primaryKey = 'code';
        return this.dynamicData;

      case 'assignmentoftaxaccountstotaxcodes':
        this.dynamicData.url = this.apiConfigService.getAssignTaxacctoTaxcodeList;
        this.dynamicData.component = AssignmentoftaxaccountstotaxcodesComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerAssignTaxacctoTaxcode;
        this.dynamicData.updateUrl = this.apiConfigService.updateAssignTaxacctoTaxcode;
        this.dynamicData.deleteUrl = this.apiConfigService.deletAssignTaxacctoTaxcode;
        this.dynamicData.listName = 'taxcodesList';
        this.dynamicData.primaryKey = 'code';
        return this.dynamicData;

      case 'hsnsac':
        this.dynamicData.url = this.apiConfigService.getHsnSacList;
        this.dynamicData.component = HsnSacComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerHsnSac;
        this.dynamicData.updateUrl = this.apiConfigService.updateHsnSac;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteHsnSac;
        this.dynamicData.listName = 'hsnsacList';
        this.dynamicData.primaryKey = 'code';
        return this.dynamicData;

      case 'tdstypes':
        this.dynamicData.url = this.apiConfigService.getTDStypeList;
        this.dynamicData.component = TDSComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerTDStype;
        this.dynamicData.updateUrl = this.apiConfigService.updateTDStype;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteTDStype;
        this.dynamicData.listName = 'tdsList';
        this.dynamicData.primaryKey = 'tdsCode';
        return this.dynamicData;

      case 'tdsrates':
        this.dynamicData.url = this.apiConfigService.getTDSRatesList;
        this.dynamicData.component = TdsRatesComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerTDSRates;
        this.dynamicData.updateUrl = this.apiConfigService.updateTDSRates;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteTDSRates;
        this.dynamicData.listName = 'tdsratesList';
        this.dynamicData.primaryKey = 'code';
        return this.dynamicData;

      case 'incometypes':
        this.dynamicData.url = this.apiConfigService.getIncomeTypeList;
        this.dynamicData.component = IncomeTypeComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerIncomeType;
        this.dynamicData.updateUrl = this.apiConfigService.updateIncomeType;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteIncomeType;
        this.dynamicData.listName = 'incmList';
        this.dynamicData.primaryKey = 'code';
        return this.dynamicData;

      case 'posting':
        this.dynamicData.url = this.apiConfigService.getPostingList;
        this.dynamicData.component = PostingComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerPosting;
        this.dynamicData.updateUrl = this.apiConfigService.updatePosting;
        this.dynamicData.deleteUrl = this.apiConfigService.deletePosting;
        this.dynamicData.listName = 'psList';
        this.dynamicData.primaryKey = 'code';
        return this.dynamicData;

      case 'accountchart':
        this.dynamicData.url = this.apiConfigService.getChartOfAccountList;
        this.dynamicData.component = AccountchartComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerChartOfAccount;
        this.dynamicData.updateUrl = this.apiConfigService.updateChartOfAccount;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteChartOfAccount;
        this.dynamicData.listName = 'coaList';
        this.dynamicData.primaryKey = 'code';
        return this.dynamicData;

      case 'financialstatement':
        this.dynamicData.url = this.apiConfigService.getFinancialStatement;
        this.dynamicData.component = financialstatementComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerFinancestatement;
        this.dynamicData.updateUrl = this.apiConfigService.updateFinancialStatement;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteFinancialStatement;
        this.dynamicData.listName = 'FSList';
        this.dynamicData.primaryKey = 'ID';
        return this.dynamicData;

      case 'glsubgroups':
        this.dynamicData.url = this.apiConfigService.getTblAccountGroupList;
        this.dynamicData.component = UndersubGroupComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerTblAccGroup;
        this.dynamicData.updateUrl = this.apiConfigService.updateTblAccountGroup;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteTblAccountGroup;
        this.dynamicData.listName = 'FSList';
        this.dynamicData.primaryKey = 'ID';
        return this.dynamicData;

      case 'assignglaccount':
        this.dynamicData.url = this.apiConfigService.getAssignGLaccounttoSubGroupList;
        this.dynamicData.component = AssignGLaccounttoSubGroupComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerAssignGLaccounttoSubGroup;
        this.dynamicData.updateUrl = this.apiConfigService.updateAssignGLaccounttoSubGroup;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteAssignGLaccounttoSubGroup;
        this.dynamicData.listName = 'assignacckeyList';
        this.dynamicData.primaryKey = 'id';
        return this.dynamicData;

      case 'AssignmentChartAccounttoCompany':
        this.dynamicData.url = this.apiConfigService.getAssiignChartAcctoCompanyCodeList;
        this.dynamicData.component = AssignmentChartAccounttoCompanyComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerAssiignChartAcctoCompanyCode;
        this.dynamicData.updateUrl = this.apiConfigService.updateAssiignChartAcctoCompanyCode;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteAssiignChartAcctoCompanyCode;
        this.dynamicData.listName = 'coaList';
        this.dynamicData.primaryKey = 'code';
        return this.dynamicData;

      case 'salaryprocess':
        this.dynamicData.url = this.apiConfigService.getCTCList;
        this.dynamicData.component = SalaryProcessComponent;
        this.dynamicData.listName = 'structuresList';
        this.dynamicData.primaryKey = 'structureCode';
        return this.dynamicData;
      default:
    }
  }

}
