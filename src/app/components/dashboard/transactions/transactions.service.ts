import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../services/api-config.service';
import { PackageconversionComponent } from './packageconversion/packageconversion.component';
import { MeterReadingComponent} from './meterreading/meterreading.component';
@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  dynamicData = { url: '', component: null, registerUrl: '', listName: '', updateUrl: '' , primaryKey: '', deleteUrl: '', coustom: true};
  branchCode: any;
  role:any;
  constructor(
    private apiConfigService: ApiConfigService

  ) { }

  getRouteUrls(data) {
    switch (data) {
      case 'cashpayment':
        this.dynamicData.coustom = false;
        return this.dynamicData;
        break;
        case 'cashreceipt':
          this.dynamicData.coustom = false;
          return this.dynamicData;
          break;
          case 'bankpayment':
            this.dynamicData.coustom = false;
            return this.dynamicData;
            break;
            case 'bankreceipt':
              this.dynamicData.coustom = false;
              return this.dynamicData;
              break;
              case 'journalvoucher':
                this.dynamicData.coustom = false;
                return this.dynamicData;
                break;
		      case 'stockissues':
        this.dynamicData.coustom = false;
        return this.dynamicData;
        break;
      case 'purchaserequisition':
        this.dynamicData.coustom = false;
        return this.dynamicData;
        break;
      case 'purchaserequisitionapproval':
        this.dynamicData.coustom = false;
        return this.dynamicData;
        break;
      case 'stockreceipt':
        this.dynamicData.coustom = false;
        return this.dynamicData;
        break;
      case 'stockshort':
        this.dynamicData.coustom = false;
        return this.dynamicData;
        break;
      case 'oilconversion':
        this.dynamicData.coustom = false;
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
          this.dynamicData.coustom = true;
          return this.dynamicData;
          break;
          case 'stockexcess':
        this.dynamicData.coustom = false;
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
            this.dynamicData.coustom = true;
            return this.dynamicData;
            break;
     default:
    }
   }
}
