import { Injectable } from '@angular/core';

@Injectable()
export class UserDataGlossary {

  myAccounts = [
    { login: '773151459', firstName: 'Lex', lastName: 'Luthor', email: 'lexluthor@gmail.com', account_id: 3 },
    { login: '773151459', firstName: 'Lex', lastName: 'Luthor', email: 'lexluthor@ukr.net', account_id: 7 },
    { login: '773151459', firstName: 'Lex', lastName: 'Luthor', email: 'lexluthor@yahoo.com', account_id: 8 }
  ];

  myTransactions = [
    { firstName: 'Clark', lastName: 'Kent', amount: 123.49, direction: '-', currency: 'USD', date: '11.12.2017', tyme: '11:12', email: 'ClarkKent@gmail.com', account_id: 9 },
    { firstName: 'Clark', lastName: 'Kent', amount: 123.49, direction: '-', currency: 'USD', date: '10.12.2017', tyme: '09:12', email: 'ClarkKent@gmail.com', account_id: 9 },
    { firstName: 'Clark', lastName: 'Kent', amount:  54.18, direction: '+', currency: 'USD', date: '09.12.2017', tyme: '11:30', email: 'ClarkKent@gmail.com', account_id: 9 },
  ];

  beneficiaires = [
    { firstName: 'KANE', lastName: 'MOMAR', phone: '773151459', address: 'DAKAR', account_id: 9 }
  ];


}
