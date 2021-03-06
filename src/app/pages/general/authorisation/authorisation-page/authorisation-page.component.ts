import {Component, OnDestroy, Input} from '@angular/core';
import {LoginService} from '../../../../services/api/login.service';
import {UserDataService} from '../../../../models/user-data';
import {ErrorMessageHandlerService} from '../../../../services/error-message-handler.service';
import {CommonServices} from '../../../../services/common.service';
import {AuthorisationClass} from '../../../../models/authorisation-class';

@Component({
  selector: 'app-authorisation-page',
  templateUrl: './authorisation-page.component.html',
  styleUrls: ['./authorisation-page.component.scss']
})
export class AuthorisationPageComponent implements OnDestroy {
  errorMessage = '';
  loading = false;
  alive = true;

  @Input() authorisation: AuthorisationClass;


  constructor(public loginService: LoginService,
              public userDataService: UserDataService,
              public errorMessageHandlerService: ErrorMessageHandlerService,
              public commonServices: CommonServices) { }

  ngOnDestroy() {
    this.alive = false;
  }

  public loginFunction() {
    this.loading = true;
    this.errorMessage = '';

    this.loginService.login(this.authorisation)
      .takeWhile(() => this.alive)
      .subscribe(result => {
        this.loading = false;
        const response = this.commonServices.xmlResponseParcer_simple( result._body );

        if (+response.error === 0
          && response.message === 'Authentification success'
          && response.profil) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('nom', response.nom);
          localStorage.setItem('prenom', response.prenom);
          localStorage.setItem('profil', response.profil.toLowerCase());

          this.loginService.usersRouting((response.profil).toLowerCase());

          // if (response.nom === 'wari') {
          //   localStorage.setItem('telephone', '776666666');
          //   this.userDataService.setUser(response.nom, response.prenom, response.profil.toLowerCase(), '776666666');
          // } else {
            localStorage.setItem('telephone', response.telephone);
            this.userDataService.setUser(response.nom, response.prenom, response.profil.toLowerCase(), response.telephone);
            this.userDataService.setMyAccounts();
          // }
        } else {
          this.errorMessage = this.errorMessageHandlerService.getMessageEquivalent(response.message);
        }
      }, (err) => {
        this.loading = false;
        console.log(err);
        this.errorMessage = this.errorMessageHandlerService.getMessageEquivalent(err._body.type);
        if (!this.errorMessage) {
          this.errorMessage = this.errorMessageHandlerService._getMessageEquivalent(err._body);
        }
      });
  }


}
