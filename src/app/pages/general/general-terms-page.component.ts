import {Component, OnInit} from '@angular/core';
import {UserDataService} from '../../models/user-data';

@Component({
  selector: 'app-general-privacy-page',
  template: `<app-header-general *ngIf="!userRole"></app-header-general>
             <app-header-all-users  *ngIf="userRole" [userRole]="userRole"></app-header-all-users>

            <app-terms></app-terms>`,
  styles: [``]
})
export class GeneralTermsPageComponent implements OnInit {
  userRole = '';

  constructor(public userDataService: UserDataService) { }


  ngOnInit() {
    if (this.userDataService.getUser().profil || localStorage.getItem('profil')) {
      this.userRole = ((<any>this.userDataService.getUser).profil) ?
        (<any>this.userDataService.getUser).profil.toLowerCase() :
        (localStorage.getItem('profil')).toLowerCase();
    }
  }

}

