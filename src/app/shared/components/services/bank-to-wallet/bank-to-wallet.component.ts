import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CurrencyParams} from '../../../../models/currency_params';

@Component({
  selector: 'app-services-bank-to-wallet',
  templateUrl: './bank-to-wallet.component.html',
  styleUrls: ['./bank-to-wallet.component.scss']
})
export class BankToWalletComponent implements OnInit {
  userRole = '';
  alive = true;


  constructor(
    public activatedRoute: ActivatedRoute,
    public currencyParams: CurrencyParams) { }

  ngOnInit() {
    this.activatedRoute.parent.url
      .takeWhile(() => this.alive)
      .subscribe(resp =>  this.userRole = resp['0'].path);

  }

}
