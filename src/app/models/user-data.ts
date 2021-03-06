import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {ReceiverClass} from './receiver-class';
import {Router} from '@angular/router';
import {GetAllListAccountService} from '../services/api/getAllListAccount.service';
import {CommonServices} from '../services/common.service';
import {GetAllCustomerService} from '../services/api/getAllCustomer.service';
import {GetAllCitizenService} from '../services/api/getAllCitizen.service';
import {GetAllContractsService} from '../services/api/getAllContracts.service';
import * as moment from 'moment';
import {Select2optionClass} from './select2option-class';
import {MarkerClass} from './marker-class';

@Injectable()
export class UserDataService {
  errorMessage = '';
  user = new ReceiverClass('', '', '', '', 0, '', '', '', '', '', '');
  // sender_default = [new ReceiverClass('skype', 'gena_ukr79', '', '', 0, '', '', '', '', '', '')];
  citizens = [];
  clients = [];
  citizensClients = [];
  receivers = [];
  _agentsMarkers_nearest = Array<MarkerClass>(0);
  _agentsMarkers_rest = Array<MarkerClass>(0);
  receiversForSelect2 = Array<Select2optionClass>(0);
  contractsForSelect2 = Array<Select2optionClass>(0);
  allContracts = [];

  myAccounts = [];
  _myAccounts = new Subject<Array<any>>();
  myAccounts$ = this._myAccounts.asObservable();

  constructor(public router: Router,
              public getAllListAccountService: GetAllListAccountService,
              public commonServices: CommonServices,
              public getAllCustomerService: GetAllCustomerService,
              public getAllCitizenService: GetAllCitizenService,
              public getAllContractsService: GetAllContractsService) {}

  public setMyAccounts() {
    // this.myAccounts.forEach(myAccount => {
    //   myAccount.telephone = (this.getUser().telephone) ?  this.getUser().telephone : localStorage.telephone;
    // });
    if (localStorage.telephone && localStorage.token) {
        this.getAllListAccountService.getMyAccounts(localStorage.telephone)
          .subscribe(result1 => {
            const response1 = this.commonServices.xmlResponseParcer_complex(result1._body);
            const accounts = response1.accounts;
            if (accounts && accounts.length) {
              if (accounts['0'].status === 'ACTIF') {
                // this.setUserId(accounts['0'].id);
                this.myAccounts = [];
                for (let i = 0; i < accounts.length; i++) {
                  this.myAccounts.push(new ReceiverClass(localStorage.nom || 'add a nom',
                                                        localStorage.prenom || 'add a prenom',
                                                        localStorage.telephone || 'add a phone',
                                                        'please add an address',
                                                        +accounts[i].id,
                                                        localStorage.profil || 'add a profil',
                                                        '',
                                                        '',
                                                        accounts[i].status,
                                                        accounts[i].type,
                                                        accounts[i].uoId));
                }
              }
            }
            if (!this.user.nom || !this.user.prenom || !this.user.telephone || !this.user.id_account) {
              this.setUser(localStorage.nom || 'add a nom',
                          localStorage.prenom || 'add a prenom',
                          localStorage.profil || 'add a profil',
                          localStorage.telephone || 'add a phone');
              this.setUserId(this.myAccounts['0'].id_account, this.myAccounts['0'].uoId);
              this._myAccounts.next(this.getMyAccounts());
            }
          }, (err) => {
            console.log(err);
            this.setErrorMessage(err);
          });
    } else {
      this.logOut();
    }
  }

  public getMyAccounts(): any {
    return this.myAccounts;
  }

  set agentsMarkers_nearest(value: Array<MarkerClass>) {
    this._agentsMarkers_nearest = value;
  }

  get agentsMarkers_nearest(): Array<MarkerClass> {
    return this._agentsMarkers_nearest;
  }

  set agentsMarkers_rest(value: Array<MarkerClass>) {
    this._agentsMarkers_rest = value;
  }

  get agentsMarkers_rest(): Array<MarkerClass> {
    return this._agentsMarkers_rest;
  }

  public setAllContracts() {
    this.allContracts = [];
    if (this.myAccounts['0'] && this.myAccounts['0'].uoId) {
      this.getAllContractsService.getAllContracts(this.myAccounts['0'].uoId)
        .subscribe(result => {
          const response = (this.commonServices.xmlResponseParcer_complex(result._body)).contract;
          if (response) {
            this.allContracts = response;
            this.setContractsForSelect2(response);
          }
        }, (err) => {console.log(err); this.setErrorMessage(err); });
    } else {
      this.getAllListAccountService.getMyAccounts(localStorage.telephone)
        .subscribe(result1 => {
          const response1 = this.commonServices.xmlResponseParcer_complex(result1._body);
          const accounts = response1.accounts;
          if (accounts && accounts.length) {
            if (accounts['0'].status === 'ACTIF') {
                  this.getAllContractsService.getAllContracts(accounts['0'].uoId)
                    .subscribe(result => {
                      const response = (this.commonServices.xmlResponseParcer_complex(result._body)).contract;
                      if (response) {
                        this.allContracts = response;
                        this.setContractsForSelect2(response);
                      }
                    }, (err) => {console.log(err); this.setErrorMessage(err); });
              }
            }
        }, (err) => {
          console.log(err);
          this.setErrorMessage(err);
        });
    }
  }

  public getAllContracts(): any {
    return this.allContracts;
  }

  public setUser(nom: string, prenom: string, profil: string, telephone: string) {
    this.user.nom = nom;
    this.user.prenom = prenom;
    this.user.profil = profil;
    this.user.telephone = telephone;
  }
  public setUserId(id_account: string, uoId: string) {
    this.user.id_account = +id_account;
    this.user.uoId = uoId;
   }

  public getUser(): ReceiverClass {
    return this.user;
  }

  public setCitizens() {
    this.receivers = [];
    this.citizens = [];
    this.getAllCitizenService.getAllCitizens()
        .subscribe(result => {
          const response = (this.commonServices.xmlResponseParcer_complex(result._body)).uos;
          this.citizens = (response.length) ? response : [];
          this.receivers = this.citizens;
        }, (err) => {console.log(err); this.setErrorMessage(err); });
  }
  public getCitizens(): any {
    return this.citizens;
  }

  public setReceiversForSelect2(receivers: Array<ReceiverClass>) {
    this.receiversForSelect2 = [];
    this.receivers = [];
    this.receivers = receivers;
      receivers.forEach(item => {
      let text = (item.nom) ? (item.nom) : '';
      text += (item.prenom) ? (' ' + item.prenom) : '';
      text += (item.telephone) ? (', ' + item.telephone) : '';
      text += (item.numTel) ? (', ' + item.numTel) : '';

      let id = (item.numTel) ? (item.numTel) : '';
      if (!id) {id = (item.telephone) ? (item.telephone) : 'undefined'; }

      this.receiversForSelect2.push(new Select2optionClass(id, text));
    });
  }
  public getReceiversForSelect2(): Array<Select2optionClass> {
    return this.receiversForSelect2;
  }


  public setContractsForSelect2(contracts: Array<any>) {
    this.contractsForSelect2 = [];
    if (contracts && contracts.length > 0) {
      contracts.forEach(item => {
        let text = (item.reference) ? (item.reference) : '';
        text += (item.dateCreation) ? (' de ' + this.commonServices.fromServerDateMoment(item.dateCreation)) : '';
        text += (item.debut) ? ('. Valide à partir de ' + this.commonServices.fromServerDateMoment(item.debut)) : '';
        text += (item.statut) ? ('. ' + item.statut) : '';
        text += (item.banque) ? ('. ' + item.banque + ' banque.') : '';
        const id = (item.id) ? (item.id) : '';

        this.contractsForSelect2.push(new Select2optionClass(id, text));
      });
    }

  }
  public getContractsForSelect2(): Array<Select2optionClass> {
    return this.contractsForSelect2;
  }


  public getReceiverFromSelect2(numTel: string): ReceiverClass {
    let receiver = new ReceiverClass('', '', '', '', 0, '', '', '', '', '', '');
    Object.keys(this.getReceivers()).forEach(key => {
      if (this.getReceivers()[key].numTel === numTel) {
        receiver = this.getReceivers()[key];
      }
    });
   return receiver;
  }


  public setClients() {
    this.clients = [];
    this.receivers = [];
    this.getAllCustomerService.getAllCustomer()
      .subscribe(result => {
        const response = (this.commonServices.xmlResponseParcer_complex(result._body)).uos;
        this.clients = (response.length) ? response : [];
        this.receivers = this.clients;
       }, (err) => {
        console.log(err);
        this.setErrorMessage(err); });
  }
  public getClients(): any {
    return this.clients;
  }


  public setReceivers(profil) {
    if (!this.citizens.length) {this.setCitizens(); }
    if (!this.clients.length)  {this.setClients(); }


    switch (profil) {
      case 'citizen': {
        if (!this.citizens.length) {
          this.setCitizens();
        } break;
      }
      case 'client': {
        if (!this.clients.length) {
          this.setClients();
        } break;
      }
      case 'agent': {
        break;
      }

      default:  console.log('=== there is a new type of user ! ===');
    }
  }

  public getReceivers(): Array<ReceiverClass> {
    return this.receivers;
  }

  public setCitizensClients(citizensClients: any) {
    this.citizensClients = citizensClients;
   }
  public getCitizensClients(): any {
    return this.citizensClients;
  }

  public checkUserRole(): boolean {
    const active_profil = this.user.profil;
    if (active_profil) {   // after login succes
      if (localStorage.profil) {
        if (active_profil !== localStorage.profil) {this.logOut(); }
      }
      if (active_profil === 'agent') {return true; }
      return false;
    } else { // after page refreshed
      if (localStorage.profil && (localStorage.profil === 'agent')) {return true; }
      return false;
    }
  }

  public setErrorMessage(message: string) {
    this.errorMessage = message;
  }
  public getErrorMessage(): string {
    return this.errorMessage;
  }

  public logOut() {
    this.router.navigate(['/authorisation']);
    localStorage.removeItem('token');
    localStorage.removeItem('nom');
    localStorage.removeItem('prenom');
    localStorage.removeItem('profil');
    localStorage.removeItem('telephone');
    this.clearAll();
  }

  public clearAll() {
    this.user = new ReceiverClass('', '', '', '', 0, '', '', '', '', '', '');
    this.citizens = [];
    this.clients = [];
    this.citizensClients = [];
    this.receiversForSelect2 = Array<Select2optionClass>(0);
    this.contractsForSelect2 = Array<Select2optionClass>(0);
    this.allContracts = [];
    this.myAccounts = [];
  }
}
