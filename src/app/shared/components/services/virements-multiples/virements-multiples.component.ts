import { Component, OnInit, OnDestroy } from '@angular/core';
import {ReceiverClass} from '../../../../models/receiver-class';
import {CommonServices} from '../../../../services/common.service';
import {UserDataService} from '../../../../models/user-data';
import 'rxjs/add/operator/takeWhile';
import * as moment from 'moment';
import {W2XWalletService} from '../../../../services/api/W2XWallet.service';
import {ErrorMessageHandlerService} from '../../../../services/error-message-handler.service';
import {GetCitizenContractService} from '../../../../services/api/getCitizenContract.service';
import {GetAllListAccountService} from '../../../../services/api/getAllListAccount.service';
import {ActivatedRoute} from '@angular/router';
import {CurrencyParams} from '../../../../models/currency_params';

@Component({
  selector: 'app-virements-multiples',
  templateUrl: './virements-multiples.component.html',
  styleUrls: ['./virements-multiples.component.scss'],
  providers: [W2XWalletService, GetCitizenContractService, GetAllListAccountService]
})
export class VirementsMultiplesComponent implements OnInit, OnDestroy {
  errorMessage_contract = '';
  errorMessage_virements = '';
  successMessage_1 = '';
  successMessage_2 = '';
  loading_contract = false;
  loading_virements = false;
  contract_to_find = true;
  contract_found = true;
  confirm_amounts = false;
  contract_number: string;
  contract_number_valid: string;
  contractsCustomer = [];
  contract_fromSelect2 = '';
  userRole = '';
  beneficiaryToSend = [];
  alive = true;

  amount_virementsMultiples: number;

  constructor(public commonServices: CommonServices,
              public activatedRoute: ActivatedRoute,
              public userDataService: UserDataService,
              public w2XWalletService: W2XWalletService,
              public getCitizenContractService: GetCitizenContractService,
              public getAllListAccountService: GetAllListAccountService,
              public errorMessageHandlerService: ErrorMessageHandlerService,
              public currencyParams: CurrencyParams) {}

  ngOnInit() {
    this.gotoContractToFindFunction();

    this.activatedRoute.parent.url
      .takeWhile(() => this.alive)
      .subscribe(resp =>  this.userRole = resp['0'].path);

    const profil = ((<any>this.userDataService.getUser).profil) ? (<any>this.userDataService.getUser).profil :
      localStorage.getItem('profil');

    if (!(this.userDataService.getMyAccounts()).length) {
      this.userDataService.setMyAccounts();
    }
  }

  ngOnDestroy() {
    this.alive = false;
    // this.commonServices.removeEmptySelect2OnDestroy();
  }


  public findContractFunction() {
    setTimeout(() => {this.gotoContractFoundFunction()}, 100)
  }

  public clearAmount() {this.amount_virementsMultiples = undefined; }
  public clearIndividualAmount(e: any) {
    e.target.previousElementSibling.value = '';
  }
  public chooseContractFunction(contract: any) {
    this.clearSearch();
    // "C201751015198 de 10.06.2017. Valide à partir de 29.05.2017. VALIDE. BICIS banque."
    this.contract_number = (contract.data['0'].text).split('.')['0'];
    this.contract_number_valid = (contract.data['0'].text).split('.')['1'] + '. Sélectionnez les destinataires:';
    this.findContractFunction();
    this.getContractsCustomerFunction(contract.data['0'].id);
  }
  public gotoContractToFindFunction() {
    this.commonServices.unSelectAllReceiversFunction();
    this.contract_to_find = true;
    this.contract_found = false;
    this.confirm_amounts = false;
    this.contract_number = undefined;
    this.contract_number_valid = undefined;
  }
  public gotoContractFoundFunction() {
    this.commonServices.unSelectAllReceiversFunction();
    this.contract_to_find = false;
    this.contract_found = true;
    this.confirm_amounts = false;
  }
  public gotoConfirmAmountsFunction() {
    this.makeBeneficiaryToSend();
    this.contract_to_find = false;
    this.contract_found = false;
    this.confirm_amounts = true;
  }

  public makeBeneficiaryToSend() {
    this.beneficiaryToSend = [];
    (this.commonServices.getSelectedReceivers()).forEach(item => {
      const name = (item.split('receiver_'))[1] || '';
      const value = ((window.document.getElementById('amount_to_' + name) as HTMLInputElement).value )
                   ? +(window.document.getElementById('amount_to_' + name) as HTMLInputElement).value : 0;
      const beneficiary_about = (this.contractsCustomer.filter(x => x.id === name))['0'];
      const _id = (this.contractsCustomer.filter(x => x.id === name))['0'].__id;
      this.beneficiaryToSend.push({beneficiary_id: name, montant: value, __id: _id, beneficiary_about: beneficiary_about});
    });
  }

  public getContractsCustomerFunction(idContract: number) {
    this.contractsCustomer = [];
    this.getCitizenContractService.getCitizensContract(idContract)
      .takeWhile(() => this.alive)
      .subscribe((result) => {
        const response = this.commonServices.xmlResponseParcer_complex( result._body );
        this.contractsCustomer = response.citizen;
        if (this.contractsCustomer && (this.contractsCustomer.length > 0)) {
          this.contractsCustomer.forEach(customer => {
            this.getAllListAccountService.getMyAccounts(customer.numTel)
              .takeWhile(() => this.alive)
              .subscribe(result1 => {
                const response1 = this.commonServices.xmlResponseParcer_complex(result1._body);
                const id = response1.accounts['0'].id;
                customer['__id'] = id;
              }, err1 => {console.log(err1); });
          })
        }
      }, (err) => {
        console.log(err);
      });
  }

  public submitFunction() {
    if (this.commonServices.getSelectedReceivers().length) {
      this.loading_virements = true;

      this.w2XWalletService.virementsMultiplesW2XW(+((this.userDataService.getMyAccounts())['0'].id_account), this.beneficiaryToSend)
        .takeWhile(() => this.alive)
        .subscribe((result) => {
            this.loading_virements = false;
            const response = this.commonServices.xmlResponseParcer_simple(result._body);
            if (+response.error === 0) {
              this.successMessage_1 = 'Bravo !';
              this.successMessage_2 = response.message;
              this.gotoContractToFindFunction();
            } else {
              this.errorMessage_virements = response.message;
            }
          },
          (err) => {
            this.loading_virements = false;
            console.log(err);
            if (err._body.type) {
              this.errorMessage_virements = this.errorMessageHandlerService.getMessageEquivalent(err._body.type);
            }
            if (err.statusText) {
              this.errorMessage_virements = this.errorMessageHandlerService.getMessageEquivalent(err.statusText);
            }
          });
    } else {return false; }
  }

  public setNewAmounttoAll() {
    this.contractsCustomer.forEach((obj) => {
      obj.lastlastAmountContract = this.amount_virementsMultiples;
    });
  }

  public receiverWasSelectedByUser(id: number): boolean {
    return ((this.commonServices.getIDSelectedReceivers()).indexOf(+id) !== -1);
  }

  public clearSearch() {
    this.errorMessage_contract = '';
    this.errorMessage_virements = '';
    this.successMessage_1 = '';
    this.successMessage_2 = '';
    this.amount_virementsMultiples = undefined;
  }

}
