import { Component, OnInit } from '@angular/core';
import {CommonServices} from '../../../../services/common.service';
import {UserDataGlossary} from '../../../../models/user-data';
import {ErrorMessageHandlerService} from '../../../../services/error-message-handler.service';
import {W2ISoldeService} from '../../../../services/api/W2ISolde.service';

@Component({
  selector: 'app-services-consultation-solde',
  templateUrl: './consultation-solde.component.html',
  styleUrls: ['./consultation-solde.component.scss'],
  providers: [UserDataGlossary, ErrorMessageHandlerService, W2ISoldeService]
})
export class ConsultationSoldeComponent implements OnInit {
  loading = false;
  showHistorySolde = false;
  errorMessage = '';
  errorMessagHistory = '';
  solde: number;

  showRequestResult = false;


  constructor(public commonServices: CommonServices,
              public userDataGlossary: UserDataGlossary,
              public errorMessageHandlerService: ErrorMessageHandlerService,
              public w2ISoldeService: W2ISoldeService) { }

  ngOnInit() {
  }

  public submitSoldeFunction() {
    this.loading = true;
    this.errorMessage = '';

    this.w2ISoldeService.getSolde(1979)
      .subscribe(result => {
        this.loading = false;
        console.log(result._body);
        const response = this.commonServices.xmlResponseParcer_simple( result._body );

        console.dir( response );
        if (+response.error === 0) {
          this.showRequestResult = !this.showRequestResult;
          this.solde = +response.solde;
          /////////////////////////////
          this.w2ISoldeService.getHistorySolde(1979)
            .subscribe(resulHistory => {
              console.log(resulHistory._body);
              const responsHistory = this.commonServices.xmlResponseParcer_complex( resulHistory._body );
              console.dir( responsHistory );
              // if (+responsHistory.error === 0) {
              //   this.showHistorySolde = true;
              // } else {
              //   this.errorMessagHistory = this.errorMessageHandlerService.getMessageEquivalent(responsHistory.errorMessage);
              // }

            }, (err) => {
              this.loading = false;
              console.log(err);
              this.errorMessagHistory = this.errorMessageHandlerService.getMessageEquivalent(err._body.type);
            });
          /////////////////////////
        } else {
          this.errorMessage = this.errorMessageHandlerService.getMessageEquivalent(response.errorMessage);
        }

      }, (err) => {
        this.loading = false;
        console.log(err);
        this.errorMessage = this.errorMessageHandlerService.getMessageEquivalent(err._body.type);
      });
  }

  public clearAll() {
    this.solde = undefined;
  }


}
