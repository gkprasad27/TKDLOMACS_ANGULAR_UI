import { Injectable } from '@angular/core';

import { ApiConfigService } from '../../../services/api-config.service';
import { LeavetypeComponent } from './leavetype/leavetype.component';
import { LeaveopeningbalanceComponent } from './leaveopeningbalance/leaveopeningbalance.component';
import { LeaveRequestComponent } from './leaverequest/leaverequest.component';
import { LeaveApprovalComponent } from './leaveapproval/leaveapproval.component';
import { ApplyodComponent } from './applyod/applyod.component';
import { AdvanceComponent } from './advance/advance.component';
import { odApprovalComponent } from './odapproval/odapproval.component';
import { advanceApprovalComponent } from './advanceapproval/advanceapproval.component';
import { VehicleRequisitionsComponent } from './vehiclerequisition/vehiclerequisition.component';
import { VehicleApprovalsComponent } from './vehicleapproval/vehicleapproval.component';
import { ApprovalTypeComponent } from './approvaltype/approvaltype.component';
import { PermissionRequestComponent } from './permissionrequest/permissionrequest.component';
import { PermissionApprovalsComponent } from './permissionapproval/permissionapproval.component';

@Injectable({
  providedIn: 'root'
})
export class selfService {
  dynamicData = { url: '', component: null, registerUrl: '', listName: '', updateUrl: '', primaryKey: '', deleteUrl: '', coustom: true };
    apiService: any;


  constructor(
    private apiConfigService: ApiConfigService
  ) { }

  getRouteUrls(data) {
    //debugger;
    //alert("hi");
    const user = JSON.parse(localStorage.getItem('user'));
    switch (data) {
      case 'leaveopeningbalance':
        
        this.dynamicData.url = this.apiConfigService.getLeaveopeningbalanceList;
        this.dynamicData.component = LeaveopeningbalanceComponent;
        this.dynamicData.registerUrl = ['/', this.apiConfigService.registerLeaveopeningbalance, user.userName, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.updateUrl = ['/', this.apiConfigService.updateLeaveopeningbalance, user.userName, user.companyCode ? user.companyCode : "0"].join('/');
        //this.dynamicData.registerUrl = this.apiConfigService.registerLeaveopeningbalance;
        //this.dynamicData.updateUrl = this.apiConfigService.updateLeaveopeningbalance;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteLeaveopeningbalance;
        this.dynamicData.listName = 'lopList';
        this.dynamicData.primaryKey = 'empCode';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;
      case 'Leaverequest':
        this.dynamicData.url = ['/', this.apiConfigService.getLeaveRequestList,user.userName].join('/');
        this.dynamicData.component = LeaveRequestComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerLeaveRequests;
        this.dynamicData.updateUrl = this.apiConfigService.updateLeaveRequests;
        //this.dynamicData.deleteUrl = this.apiConfigService.deleteLeaveTypes;
        this.dynamicData.listName = 'LeaveApplDetailsList';
        this.dynamicData.primaryKey = 'empCode';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;

      case 'approvaltype':
        //this.dynamicData.url = ['/', this.apiConfigService.getapprovaltypeList);
        this.dynamicData.url = this.apiConfigService.getapprovaltypeList;
        this.dynamicData.component = ApprovalTypeComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerapprovaltype;
        this.dynamicData.updateUrl = this.apiConfigService.updateapprovaltype;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteapprovaltype;
        this.dynamicData.listName = 'approvalTypeList';
        this.dynamicData.primaryKey = 'id';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;
      case 'applyod':
        this.dynamicData.url = ['/', this.apiConfigService.applyodRequestList, user.userName].join('/');
        this.dynamicData.component = ApplyodComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerodRequest;
        this.dynamicData.updateUrl = this.apiConfigService.updateapplyodRequest;
        this.dynamicData.listName = 'ApplyodDetailsList';
        this.dynamicData.primaryKey = 'empCode';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;
      case 'vehiclerequisition':
        this.dynamicData.url = ['/', this.apiConfigService.applyvehiclerqsnRequestList, user.userName].join('/');
        this.dynamicData.component = VehicleRequisitionsComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registervehiclerqsnRequest;
        this.dynamicData.updateUrl = this.apiConfigService.updatevehiclerqsnRequest;
        this.dynamicData.listName = 'vhclrqsnDetailsList';
        this.dynamicData.primaryKey = 'empCode';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;

      case 'advance':
        this.dynamicData.url = ['/', this.apiConfigService.applyadvanceRequestList, user.userName].join('/');
        this.dynamicData.component = AdvanceComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registeradvanceRequest;
        this.dynamicData.updateUrl = this.apiConfigService.updateapplyadvanceRequest;
        this.dynamicData.listName = 'ApplyAdvanceDetailsList';
        this.dynamicData.primaryKey = 'employeeId';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;

      case 'permissionrequest':
        this.dynamicData.url = ['/', this.apiConfigService.permissionRequestList, user.userName].join('/');
        this.dynamicData.component = PermissionRequestComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerpermissionRequest;
        this.dynamicData.updateUrl = this.apiConfigService.updatepermissionRequest;
        this.dynamicData.listName = 'PermissionApplDetailsList';
        this.dynamicData.primaryKey = 'employeeId';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;

      case 'leaveApproval':
        this.dynamicData.url = this.apiConfigService.getStructuresList;
        this.dynamicData.component = LeaveApprovalComponent;
        this.dynamicData.listName = 'structuresList';
        this.dynamicData.primaryKey = 'structureCode';
        this.dynamicData.coustom = false;
        return this.dynamicData;

      case 'permissionapproval':
        this.dynamicData.url = this.apiConfigService.getStructuresList;
        this.dynamicData.component = PermissionApprovalsComponent;
        this.dynamicData.listName = 'structuresList';
        this.dynamicData.primaryKey = 'structureCode';
        this.dynamicData.coustom = false;
        return this.dynamicData;
     
      case 'odApproval':
        this.dynamicData.url = this.apiConfigService.getStructuresList;
        this.dynamicData.component = odApprovalComponent;
        this.dynamicData.listName = 'structuresList';
        this.dynamicData.primaryKey = 'structureCode';
        this.dynamicData.coustom = false;
        return this.dynamicData;

      case 'vehicleapproval':
        this.dynamicData.url = this.apiConfigService.getStructuresList;
        this.dynamicData.component = VehicleApprovalsComponent;
        this.dynamicData.listName = 'structuresList';
        this.dynamicData.primaryKey = 'structureCode';
        this.dynamicData.coustom = false;
        return this.dynamicData;

      case 'advanceApproval':
        this.dynamicData.url = this.apiConfigService.getStructuresList;
        this.dynamicData.component = advanceApprovalComponent;
        this.dynamicData.listName = 'structuresList';
        this.dynamicData.primaryKey = 'structureCode';
        this.dynamicData.coustom = false;
        return this.dynamicData;

      case 'leavetype':
        this.dynamicData.url = this.apiConfigService.getLeaveTypeatLists;
        this.dynamicData.component = LeavetypeComponent;
        this.dynamicData.registerUrl = ['/', this.apiConfigService.registerLeaveTypes, user.companyCode ? user.companyCode : "0"].join('/');
        this.dynamicData.updateUrl = ['/', this.apiConfigService.updateLeaveTypes, user.companyCode ? user.companyCode : "0"].join('/');
        //this.dynamicData.updateUrl = this.apiConfigService.updateLeaveTypes;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteLeaveTypes;
        this.dynamicData.listName = 'leavetypeList';
        this.dynamicData.primaryKey = 'id';
        this.dynamicData.coustom = true;
        
        return this.dynamicData;
        break;
      default:
    }
  }

}
