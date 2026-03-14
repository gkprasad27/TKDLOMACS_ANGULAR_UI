import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RuntimeSettings } from '../models/common/RuntimeSettings';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RuntimeConfigService {
  // provide a safe default so other services can read .serverUrl during bootstrap
  runtimeConfig: any = { serverUrl: '' };
  tableColumnsData: any;

constructor(private injector: Injector, private httpClient: HttpClient) { }

    public loadRuntimeConfig():Promise<any>  {
      return this.httpClient.get(`../../assets/settings/runtime-config.json`)
        .pipe(tap((res) => this.runtimeConfig = res)).toPromise();
    }

    public getTableColumns():Promise<any>  {
      return this.httpClient.get(`../../assets/settings/table-col.json`)
        .pipe(tap((res) => this.tableColumnsData = res)).toPromise();
    }

}
