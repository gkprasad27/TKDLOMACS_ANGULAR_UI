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


@Injectable({
  providedIn: 'root'
})
export class MastersService {
  dynamicData = { url: '', component: null, registerUrl: '', listName: '', updateUrl: '', primaryKey: '', deleteUrl: '' };
  branchCode: any;
  role: any;

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
        this.dynamicData.primaryKey = 'employeeId';
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
        this.dynamicData.listName = 'MembersList';
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
        this.dynamicData.updateUrl = this.apiConfigService.updatedepartment
        this.dynamicData.deleteUrl = this.apiConfigService.deletedepartment;
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
      default:
    }
  }

}
