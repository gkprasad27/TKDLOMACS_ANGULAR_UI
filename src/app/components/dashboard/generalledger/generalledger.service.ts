import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../services/api-config.service';
import {AccountsGroupComponent} from './accountsgroup/accountsgroup.component';
import { SubGroupComponent } from './subgroup/subgroup.component';
import {UndersubGroupComponent} from './undersubgroup/undersubgroup.component';
import {GlAccountsComponent} from './glaccounts/glaccounts.component';
import {GlSubcodeComponent } from './glsubcode/glsubcode.component';
import {TaxIntegrationComponent } from './taxintegration/taxintegration.component';
import {CashAccToBranchesComponent } from './cashacctobranches/cashacctobranches.component';
import {AccToAccClassComponent} from './acctoaccclass/acctoaccclass.component';
import { VoucherTypesComponent } from './vouchertypes/vouchertypes.component';

import { PartnerTypeComponent } from './partner-type/partner-type.component';
import { PartnerCreationComponent } from './partner-creation/partner-creation.component';
import { NoSeriesComponent } from './no-series/no-series.component';
import { TaxgroupsComponent } from './taxgroup/taxgroup.component';
import { TaxstructuresComponent } from './taxstructure/taxstructure.component';
import { TaxMasterComponent } from './tax-master/tax-master.component';



@Injectable({
  providedIn: 'root'
})
export class GeneralledgerService {
  dynamicData = { url: '', component: null, registerUrl: '', listName: '', updateUrl: '' , primaryKey: '', deleteUrl: ''};

  constructor(
 private apiConfigService: ApiConfigService
  ) { }

  getRouteUrls(data) {
  
    const user = JSON.parse(localStorage.getItem('user'));
    switch (data) {
     case 'accountsgroup':
      this.dynamicData.url = this.apiConfigService.getAccountsGroupList;
      this.dynamicData.component = AccountsGroupComponent;
      this.dynamicData.registerUrl = this.apiConfigService.registerGlaccGroup;
      this.dynamicData.updateUrl = this.apiConfigService.updateAccountGroup;
      this.dynamicData.deleteUrl = this.apiConfigService.deleteAccountGroup;
      this.dynamicData.listName = 'GLAccountGroupList';
      this.dynamicData.primaryKey = 'groupCode';
      return this.dynamicData;
      break;
      case 'subgroup':
        this.dynamicData.url = this.apiConfigService.getGLAccountSubGroupList;
        this.dynamicData.component = SubGroupComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerGlaccSubGroup;
        this.dynamicData.updateUrl = this.apiConfigService.updateGLAccSubGroup;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteAccountSubGroup;
        this.dynamicData.listName = 'GLAccountSubGroupList';
        this.dynamicData.primaryKey = 'subGroupCode';
        return this.dynamicData;
        break;
        case 'undersubgroup':
          this.dynamicData.url = this.apiConfigService.getGLUnderSubGroupList;
          this.dynamicData.component = UndersubGroupComponent;
          this.dynamicData.registerUrl = this.apiConfigService.registerGLUnderSubGroup;
          this.dynamicData.updateUrl = this.apiConfigService.updateGLAccUnderSubGroup;
          this.dynamicData.deleteUrl = this.apiConfigService.deleteGLAccUnderSubGroup;
          this.dynamicData.listName = 'tblAccountGroupList';
          this.dynamicData.primaryKey = 'accountGroupId';
          return this.dynamicData;
          break;
     case 'partnerType':
      this.dynamicData.url = this.apiConfigService.getPartnerTypesList;
      this.dynamicData.component = PartnerTypeComponent;
      this.dynamicData.registerUrl = this.apiConfigService.registerPartnerType;
      this.dynamicData.updateUrl = this.apiConfigService.updatePartnerType;
      this.dynamicData.deleteUrl = this.apiConfigService.deletePartnerType;
      this.dynamicData.listName = 'partnerTypeList';
      this.dynamicData.primaryKey = 'code';
      return this.dynamicData;
      break;
      case 'partnerCreation':
      this.dynamicData.url = this.apiConfigService.getPartnerCreationList;
      this.dynamicData.component = PartnerCreationComponent;
      this.dynamicData.registerUrl = this.apiConfigService.registerPartnerCreation;
      this.dynamicData.updateUrl = this.apiConfigService.updatePartnerCreation;
      this.dynamicData.deleteUrl = this.apiConfigService.deletePartnerCreation;
      this.dynamicData.listName = 'partnerCreationList';
      this.dynamicData.primaryKey = 'code';
      return this.dynamicData;
      break;
          case 'glaccounts':
          this.dynamicData.url = this.apiConfigService.getTblAccountLedgerList;
          this.dynamicData.component = GlAccountsComponent;
          this.dynamicData.registerUrl = this.apiConfigService.registerTblAccLedger;
          this.dynamicData.updateUrl = this.apiConfigService.updateTblAccountLedger;
          this.dynamicData.deleteUrl = this.apiConfigService.deleteTblAccountLedger;
          this.dynamicData.listName = 'AccountLedgerList';
          this.dynamicData.primaryKey = 'ledgerId';
          return this.dynamicData;
          break;
          case 'glsubcode':
            this.dynamicData.url = this.apiConfigService.getGLSubCodeList;
            this.dynamicData.component = GlSubcodeComponent;
            this.dynamicData.registerUrl = this.apiConfigService.registerGlsubCode;
            this.dynamicData.updateUrl = this.apiConfigService.updateGLSubCode;
            this.dynamicData.deleteUrl = this.apiConfigService.deleteGLSubCode;
            this.dynamicData.listName = 'GLSubCodeList';
            this.dynamicData.primaryKey = 'subCode';
            return this.dynamicData;
            break;
      case 'taxintegration':
            this.dynamicData.url = this.apiConfigService.getTaxintigrationList;
            this.dynamicData.component = TaxIntegrationComponent;
            this.dynamicData.registerUrl = ['/', this.apiConfigService.registerTaxIntegration, user.branchCode, user.companyCode ? user.companyCode : "0"].join('/');
       //    this.dynamicData.registerUrl = ['/', this.apiConfigService.registerTaxIntegration, user.branchCode, user.companyCode);
           // this.dynamicData.registerUrl = this.apiConfigService.registerTaxIntegration;
            this.dynamicData.updateUrl = this.apiConfigService.updateTaxIntegration;
            this.dynamicData.deleteUrl = this.apiConfigService.deleteTaxIntegration;
            this.dynamicData.listName = 'TaxintigrationList';
            this.dynamicData.primaryKey = 'taxCode';
            return this.dynamicData;
            break;
            case 'cashacctobranches':
            this.dynamicData.url = this.apiConfigService.getAsignCashAccBranchList;
            this.dynamicData.component = CashAccToBranchesComponent;
            this.dynamicData.registerUrl = this.apiConfigService.registerAsigCashAccBranch;
            this.dynamicData.updateUrl = this.apiConfigService.updateaAignmentCashAccBranch;
            this.dynamicData.deleteUrl = this.apiConfigService.deleteAignmentCashAccBranch;
            this.dynamicData.listName = 'AsignCashAccBranchList';
            this.dynamicData.primaryKey = 'code';
            return this.dynamicData;
            break;
            case 'acctoaccclass':
              this.dynamicData.url = this.apiConfigService.getAsigAcctoAccclassList;
              this.dynamicData.component = AccToAccClassComponent;
              this.dynamicData.registerUrl = this.apiConfigService.registerAsigAcctoAccClass;
              this.dynamicData.updateUrl = this.apiConfigService.updateAccToAccClass;
              this.dynamicData.deleteUrl = this.apiConfigService.deleteAccToAccClass;
              this.dynamicData.listName = 'AsigAcctoAccclassList';
              this.dynamicData.primaryKey = 'code';
              return this.dynamicData;
              break;
              case 'vouchertypes':
                this.dynamicData.url = this.apiConfigService.getVoucherTypeList;
                this.dynamicData.component = VoucherTypesComponent;
                this.dynamicData.registerUrl = this.apiConfigService.registerVoucherTypes;
                this.dynamicData.updateUrl = this.apiConfigService.updateVoucherTypes;
                this.dynamicData.deleteUrl = this.apiConfigService.deleteVoucherTypes;
                this.dynamicData.listName = 'GLSubCodeList';
                this.dynamicData.primaryKey = 'voucherCode';
                return this.dynamicData;
                break;
                case 'noSeries':
      this.dynamicData.url = this.apiConfigService.getNoSeriesList;
      this.dynamicData.component = NoSeriesComponent;
      this.dynamicData.registerUrl = this.apiConfigService.registerNoSeries;
      this.dynamicData.updateUrl = this.apiConfigService.updateNoSeries;
      this.dynamicData.deleteUrl = this.apiConfigService.deleteNoSeries;
      this.dynamicData.listName = 'noSeriesList';
      this.dynamicData.primaryKey = 'code';
      return this.dynamicData;
      break; 
      case 'taxgroup':
        this.dynamicData.url = this.apiConfigService.getTaxGroupList;
        this.dynamicData.component = TaxgroupsComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerTaxGroup;
        this.dynamicData.updateUrl = this.apiConfigService.updateTaxGroup;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteTaxGroup;
        this.dynamicData.listName = 'TaxgroupList';
        this.dynamicData.primaryKey = 'taxGroupId';
        return this.dynamicData;
        break;
      case 'taxstructure':
        this.dynamicData.url = this.apiConfigService.getTaxStructureList;
        this.dynamicData.component = TaxstructuresComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerTaxStructure;
        this.dynamicData.updateUrl = this.apiConfigService.updateTaxStructure;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteTaxStructure;
        this.dynamicData.listName = 'TaxStructureList';
        this.dynamicData.primaryKey = 'taxStructureId';
        return this.dynamicData;
        break;
        case 'taxMaster':
          this.dynamicData.url = this.apiConfigService.getTaxmastersList;
          this.dynamicData.component = TaxMasterComponent;
          this.dynamicData.registerUrl = this.apiConfigService.registerTaxMasters;
          this.dynamicData.updateUrl = this.apiConfigService.updateTaxMaster;
          this.dynamicData.deleteUrl = this.apiConfigService.deleteTaxMaster;
          this.dynamicData.listName = 'TaxmasterList';
          this.dynamicData.primaryKey = 'code';
          return this.dynamicData;
            break;
            
     default:
    }
   }

}


