import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BackendService} from '../backend.service';
import {UrlParams} from '../../models/URL_PARAMS';

@Injectable()
export class GetAllCustomerService {

  constructor(public backendService: BackendService) {}


  public getAllCustomer(): Observable<any> {
    const token = localStorage.token;

    const body =
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:run="http://runtime.services.cash.innov.sn/">
         <soapenv:Header/>
         <soapenv:Body>
            <run:getAllCustomer>
               <sessionId>` + token + `</sessionId>
               <pays>221</pays>
            </run:getAllCustomer>
         </soapenv:Body>
      </soapenv:Envelope>`;

    return this.backendService.post(UrlParams.backendUrl, body);
  }


}
