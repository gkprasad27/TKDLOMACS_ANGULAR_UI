import { Injectable } from '@angular/core';

import { ApiConfigService } from '../../../services/api-config.service';
import { LeaveopeningbalancesComponent } from './leaveopeningbalances/leaveopeningbalances.component';
import { LeavetypesComponent } from './leavetypes/leavetypes.component';
import { PTMasterComponent } from './ptmaster/ptmaster.component';
import { StructureCreationComponent } from './structure-creation/structure-creation.component';
import { ComponentMasterComponent } from './componentmaster/componentmaster.component';
import { PFMasterComponent} from './pfmaster/pfmaster.component';
import { CTCBreakupComponent} from './ctcbreakup/ctcbreakup.component';
import { SalaryProcessComponent} from './salaryproces/salaryprocess.component';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  dynamicData = { url: '', component: null, registerUrl: '', listName: '', updateUrl: '', primaryKey: '', deleteUrl: '', coustom: true };


  constructor(
    private apiConfigService: ApiConfigService
  ) { }

  getRouteUrls(data) {
    //debugger;
    const user = JSON.parse(localStorage.getItem('user'));
    switch (data) {
      case 'ptmaster':
        this.dynamicData.url = this.apiConfigService.getPTList;
        this.dynamicData.component = PTMasterComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerPT;
        this.dynamicData.updateUrl = this.apiConfigService.updatePT;
        this.dynamicData.deleteUrl = this.apiConfigService.deletePT;
        this.dynamicData.listName = 'ptList';
        this.dynamicData.primaryKey = 'id';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;
      case 'componentmaster':
        this.dynamicData.url = this.apiConfigService.getComponentsList;
        this.dynamicData.component = ComponentMasterComponent;
        this.dynamicData.registerUrl = ['/', this.apiConfigService.registerComponent, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.updateUrl = ['/', this.apiConfigService.updateComponent, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.deleteUrl = this.apiConfigService.deleteComponent;
        this.dynamicData.listName = 'componentsList';
        this.dynamicData.primaryKey = 'componentCode';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;
      case 'structureCreation':
        this.dynamicData.url = this.apiConfigService.getStructuresList;
        this.dynamicData.component = StructureCreationComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerStructure;
        this.dynamicData.updateUrl = this.apiConfigService.updateStructure;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteStructure;
        this.dynamicData.listName = 'structuresList';
        this.dynamicData.primaryKey = 'structureCode';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;
        case 'pfmaster':
        this.dynamicData.url = this.apiConfigService.getPfList;
        this.dynamicData.component = PFMasterComponent;
        this.dynamicData.registerUrl = ['/', this.apiConfigService.registerPF, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.updateUrl = ['/', this.apiConfigService.updatePF, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.deleteUrl = this.apiConfigService.deletePF;
        this.dynamicData.listName = 'pfList';
        this.dynamicData.primaryKey = 'id';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;
        case 'CTCBreakup':
        this.dynamicData.url = this.apiConfigService.getCTCList;
        this.dynamicData.component = CTCBreakupComponent;
        this.dynamicData.listName = 'structuresList';
        this.dynamicData.primaryKey = 'structureCode';
        this.dynamicData.coustom = false;
        return this.dynamicData;
        case 'salaryprocess':
          this.dynamicData.url = this.apiConfigService.getCTCList;
          this.dynamicData.component = SalaryProcessComponent;
          this.dynamicData.listName = 'structuresList';
          this.dynamicData.primaryKey = 'structureCode';
          this.dynamicData.coustom = false;
          return this.dynamicData;
      default:
    }
  }

}
