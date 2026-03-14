import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../services/api-config.service';
@Injectable({
  providedIn: 'root'
})
export class SalesService {
  dynamicData = { url: '', component: null, registerUrl: '', listName: '', updateUrl: '' , primaryKey: '', deleteUrl: '', coustom: true};

  constructor(
    private apiConfigService: ApiConfigService

  ) { }

  getRouteUrls(data) {
    switch (data) {
      case 'salesInvoice':
        this.dynamicData.coustom = false;
        return this.dynamicData;
        break;
      case 'salesReturn':
        this.dynamicData.coustom = false;
        return this.dynamicData;
        break;
      case 'stockTransfer':
        this.dynamicData.coustom = false;
        return this.dynamicData;
        break;
      case 'purchaseInvoice':
        this.dynamicData.coustom = false;
        return this.dynamicData;
        break;
      case 'purchaseReturn':
        this.dynamicData.coustom = false;
        return this.dynamicData;
        break;
     default:
    }
   }
}
