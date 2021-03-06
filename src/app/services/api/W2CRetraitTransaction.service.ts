import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BackendService} from '../backend.service';
import {UrlParams} from '../../models/URL_PARAMS';
import {EnvoyeurClass} from '../../models/envoyeur-class';

@Injectable()
export class W2CRetraitTransactionService {

  constructor(public backendService: BackendService) {}


  public retrieveCash(code: string, principal: number,
                      commission: number, beneficiaire: EnvoyeurClass): Observable<any> {
    const token = localStorage.token;
    const pays = 221;

    const body =
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:run="http://runtime.services.cash.innov.sn/">
        <soapenv:Header/>
          <soapenv:Body>
              <run:W2CRetraitTransaction>
                  <sessionId>` + token + `</sessionId>
                  <code>` + code + `</code>
                  <principal>` + principal + `</principal>
                  <commission>` + commission + `</commission>
                  <beneficiaire>
                      <nom>` + beneficiaire.nom + `</nom>
                      <prenom>` + beneficiaire.prenom + `</prenom>
                      <adresse>` + ((beneficiaire.addresse) ? beneficiaire.addresse : undefined) + `</adresse>
                      <cellulaire>` + (beneficiaire.cellulaire) + `</cellulaire>
                  </beneficiaire>
                  <beneficiaireID>
                      <type>` + beneficiaire.id_type + `</type>
                      <pays>` + ((beneficiaire.id_pays) ? beneficiaire.id_pays : pays) + `</pays>
                      <valeur>` + beneficiaire.id_valeur + `</valeur>
                      <debut>` + beneficiaire.id_debut + `</debut>
                      <fin>` + beneficiaire.id_fin + `</fin>
                  </beneficiaireID>
              </run:W2CRetraitTransaction>
          </soapenv:Body>
      </soapenv:Envelope>`;

    return this.backendService.post(UrlParams.backendUrl, body);
  }
}
