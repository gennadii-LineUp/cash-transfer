import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EnvoyeurClass} from '../../../../models/envoyeur-class';
import {DatepickerClass} from '../../../../models/datepicker-class';
import {CustomDatepickerI18n, I18n} from '../../../../models/datepicker-i18n';
import {NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';
import {PassportClass} from '../../../../models/passport-class';
import {CommonServices} from '../../../../services/common.service';

@Component({
  selector: 'app-get-user-id',
  templateUrl: './get-user-id.component.html',
  styleUrls: ['./get-user-id.component.scss'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // french language
})
export class GetUserIdComponent implements OnInit {
  envoyeur = new EnvoyeurClass('', '', '', '', '', 'SEN', '', '', '');
  select_id_type_active: string;
  select_id_type_values = <Array<PassportClass>>[
    { type: 'CARTE D\'IDENTITE',  dateDebut: '', dateFin: '', pays: '', valeur: '' },
    { type: 'PASSEPORT',          dateDebut: '', dateFin: '', pays: '', valeur: '' },
    { type: 'PERMIS DE CONDUIRE', dateDebut: '', dateFin: '', pays: '', valeur: '' },
    { type: 'AUTRE',              dateDebut: '', dateFin: '', pays: '', valeur: '' }
  ];
  date = '11/13/2016';
  datepickerDebut;
  datepickerExpiration;
  minDate = {year: 1950, month: 1, day: 1};
  maxDate = {year: 2060, month: 1, day: 1};
  _envoyeur_documents = Array<PassportClass>(0);

  @Output()
  userData = new EventEmitter<EnvoyeurClass>();

  @Input()
  set setDefaultUser(defaultEnvoyeur: EnvoyeurClass) {
    console.log(defaultEnvoyeur);
    this.envoyeur = defaultEnvoyeur;
    this.datepickerDebut = new DatepickerClass(undefined, undefined, undefined);
    this.datepickerExpiration = new DatepickerClass(undefined, undefined, undefined);
    console.log(this.envoyeur);
  }
  @Input()
  set envoyeur_documents(data: Array<PassportClass>) {
    this._envoyeur_documents = data;
    console.log(this._envoyeur_documents);
    this.select_id_type_values = data;
  }

  constructor(public commonServices: CommonServices) {}

  ngOnInit() {
    this.sendData();
  }

  public clearEnvoyeur(field: string) {this.envoyeur[field] = undefined; }
  public clearDP(type: string) {
    if (type === 'dpDebut') {
      this.envoyeur.id_debut = '';
      this.datepickerDebut = new DatepickerClass(undefined, undefined, undefined);
    }
    if (type === 'dpExpiration') {
      this.envoyeur.id_fin = '';
      this.datepickerExpiration = new DatepickerClass(undefined, undefined, undefined);
    }
    this.sendData();
  }

  public setDocumentType(data:string) {
    console.log(data);
    this.select_id_type_values.forEach((document) => {
      if (document.type===data) {
        console.log(document);
        this.envoyeur.id_type = document.type;
        this.envoyeur.id_valeur = document.valeur;
        const dateDebut = this.commonServices.fromServerDateMoment(document.dateDebut);
        const dateFin = this.commonServices.fromServerDateMoment(document.dateFin);
        this.datepickerDebut = new DatepickerClass(+dateDebut.split('/')[2],
                                                  +dateDebut.split('/')[1],
                                                  +dateDebut.split('/')[0]);
        this.datepickerExpiration = new DatepickerClass(+dateFin.split('/')[2],
                                                      +dateFin.split('/')[1],
                                                      +dateFin.split('/')[0]);
        this.transformDataToString(this.datepickerDebut, 'dpDebut');
        this.transformDataToString(this.datepickerExpiration, 'dpExpiration');
        console.log(this.envoyeur);
      }
    });
  }

  public transformDataToString(e: any, type: string) {
    let _datepickerDebut = '';
    let _datepickerExpiration = '';
    if (type === 'dpDebut') {
      if (e && e.year && e.month && e.day) {
        _datepickerDebut = '' + e.year + '-'
          + ((('' + e.month).length > 1) ? e.month : ('0' + e.month)) + '-'
          + ((('' + e.day).length > 1) ? e.day : ('0' + e.day));
      }
      this.envoyeur.id_debut = (_datepickerDebut.length > 0) ? _datepickerDebut : undefined;
    }
    if (type === 'dpExpiration') {
      if (e && e.year && e.month && e.day) {
        _datepickerExpiration = '' + e.year + '-'
          + ((('' + e.month).length > 1) ? e.month : ('0' + e.month)) + '-'
          + ((('' + e.day).length > 1) ? e.day : ('0' + e.day));
      }
      this.envoyeur.id_fin = (_datepickerExpiration.length > 0) ? _datepickerExpiration : undefined;
    }
    this.sendData();
  }

  public sendData() {
    this.userData.emit(this.envoyeur);
    console.dir(this.envoyeur);
  }
}
