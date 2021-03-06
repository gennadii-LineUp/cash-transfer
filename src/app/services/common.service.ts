import { Injectable } from '@angular/core';
import {ReceiverClass} from '../models/receiver-class';
import * as moment from 'moment';

@Injectable()
export class CommonServices {
  selectedReceivers = [];

  constructor() {}


  public accordionCloseAllItemsFunction() {
    const accordionItems: NodeListOf<Element> = window.document.querySelectorAll('div.accordionItem');
    for (let i = 0; i < accordionItems.length; i++) {
      accordionItems[i].className = 'accordionItem close-item';
    }
  }


  public accordionToggleItemFunction(e: any) {
    const currentClass = e.currentTarget.className;

    const accordionItems: NodeListOf<Element> = window.document.querySelectorAll('div.accordionItem');
    for (let i = 0; i < accordionItems.length; i++) {
      if (accordionItems[i].className === 'accordionItem close-item send-request') {
        continue;
      }
      accordionItems[i].className = 'accordionItem close-item';
    }

    const currentAccordionItem = e.currentTarget;
    if ((currentClass === 'accordionItem close-item send-request')) {return true; }
    if ((currentClass === 'accordionItem close-item')) {
      currentAccordionItem.classList.remove('close-item');
      currentAccordionItem.classList.add('open');
    } else {
      currentAccordionItem.className = 'accordionItem close-item';
    }
  }

  public accordionToggleNotifFunction(e: any) {
    const currentClass = e.currentTarget.className;

    const accordionItems: NodeListOf<Element> = window.document.querySelectorAll('div.accordionItem');
    for (let i = 0; i < accordionItems.length; i++) {
      if (accordionItems[i].className === 'accordionItem close-item') {
        continue;
      }
      accordionItems[i].className = 'accordionItem close-item';
    }

    const currentAccordionItem = e.currentTarget;
    if ((currentClass === 'accordionItem close-item')) {
      currentAccordionItem.classList.remove('close-item');
      currentAccordionItem.classList.add('open');
    } else {
      currentAccordionItem.className = 'accordionItem open';
    }
  }



  public defineReceiversFunction(e: any) {
    const currentReceiver = e.currentTarget;
    currentReceiver.classList.toggle('active');
    this.countSelectedReceiversFunction();
  }

  public selectAllReceiversFunction() {
    const allItems: NodeListOf<Element> = window.document.querySelectorAll('div.search__user');
    for (let i = 0; i < allItems.length; i++) {
      allItems[i].classList.add('active');
    }
    this.countSelectedReceiversFunction();
  }

  public unSelectAllReceiversFunction() {
    const allItems: NodeListOf<Element> = window.document.querySelectorAll('div.search__user');
    for (let i = 0; i < allItems.length; i++) {
      allItems[i].classList.remove('active');
    }
    this.countSelectedReceiversFunction();
  }

  public countSelectedReceiversFunction() {
    const allItems: NodeListOf<Element> = window.document.querySelectorAll('div.search__user.active');
    this.selectedReceivers = [];
    for (let i = 0; i < allItems.length; i++) {
      this.selectedReceivers.push(allItems[i].id);
    }
  }

  public getSelectedReceivers(): any {
    return this.selectedReceivers;
  }
  public getIDSelectedReceivers(): any {
    let _selectedReceivers = [];
    this.selectedReceivers.forEach(item => {
      const id = (item.split('receiver_'))[1] || 0;
      _selectedReceivers.push(+id);
    });
    return _selectedReceivers;
  }

  public setSelectedReceivers(value: any) {
    this.selectedReceivers = value;
  }


  public xmlResponseParcer_simple(response: string): any {
    const arr = (((response.split('<return>'))[1]).split('</return>'))[0].split('><');

    // remove '<' at the beginning of 1st element
    arr[0] = (arr[0]).substr(1);

    // remove '>' at the end of last element
    arr[arr.length - 1] = (arr[arr.length - 1]).substring(0, (arr[arr.length - 1]).length - 1 );

    const result = {};
    for (let i = 0; i < arr.length; i++) {
        const name = ((arr[i]).split('>'))[0];
        const value = ((((arr[i]).split('<'))[0]).split('>'))[1];
        result[name] = value;
    }
    return result;
  }


  public xmlResponseParcer_complex(response: string): any {
    const arr = (((response.split('<return>'))[1]).split('</return>'))[0].split('><');
    // remove '<' at the beginning of 1st element
    arr[0] = (arr[0]).substr(1);

    // remove '>' at the end of last element
    arr[arr.length - 1] = (arr[arr.length - 1]).substring(0, (arr[arr.length - 1]).length - 1 );

    const result = {};
    let small_obj = {};
    let _arr = arr;
    const store_name = [];
    const store_value = [];
    const arr_objects = [];
    let arr_field = '';

    for (let i = 0; i < arr.length; i++) {

      if ((arr[i]).split('>').length === 1) {
        arr_field = arr[i];
        const ind_last = (arr.slice(i)).indexOf('/' + arr_field);
        _arr = arr.splice(i, ind_last);
        _arr.shift();
        store_name.push(arr_field);
        store_value.push(_arr);

      } else {
        const name = ((arr[i]).split('>'))[0];
        const value = ((((arr[i]).split('<'))[0]).split('>'))[1];
        result[name] = value;
      }
    }

    for (let i = 0; i < store_value.length; i++) {
        const _store = store_value[i];
        for (let j = 0; j < _store.length; j++) {
          const name = ((_store[j]).split('>'))[0];
          const value = ((((_store[j]).split('<'))[0]).split('>'))[1];
          small_obj[name] = value;
          if (j === (_store.length - 1)) {
            arr_objects.push(small_obj);
            small_obj = {};
          }
        }
    }
    result[arr_field] = arr_objects;
    return result;
  }

  public xmlResponseParcer_compl_body(response: string): any {
    const arr = (((response.split('<soap:Body>'))[1]).split('</soap:Body>'))[0].split('><');
    // remove '<' at the beginning of 1st element
    arr[0] = (arr[0]).substr(1);
    arr.pop();
    // remove '>' at the end of last element
    // arr[arr.length - 1] = (arr[arr.length - 1]).substring(0, (arr[arr.length - 1]).length - 1 );

    const result = {};
    let small_obj = {};
    let _arr = arr;
    const store_name = [];
    const store_value = [];
    const arr_objects = [];
    let arr_field = '';

    for (let i = 0; i < arr.length; i++) {

      if ((arr[i]).split('>').length === 1) {
        arr_field = arr[i];
        const ind_last = (arr.slice(i)).indexOf('/' + arr_field);
        _arr = arr.splice(i, ind_last);
        _arr.shift();
        store_name.push(arr_field);
        store_value.push(_arr);

      } else {
        const name = ((arr[i]).split('>'))[0];
        const value = ((((arr[i]).split('<'))[0]).split('>'))[1];
        result[name] = value;
      }
    }

    for (let i = 0; i < store_value.length; i++) {
      const _store = store_value[i];
      for (let j = 0; j < _store.length; j++) {
        const name = ((_store[j]).split('>'))[0];
        const value = ((((_store[j]).split('<'))[0]).split('>'))[1];
        small_obj[name] = value;
        if (j === (_store.length - 1)) {
          arr_objects.push(small_obj);
          small_obj = {};
        }
      }
    }
    result[arr_field] = arr_objects;
    return result;
  }


  public xmlResponseParcer_complexReturn(response: string): any {
    const arr = (((response.split('ns2="http://runtime.services.cash.innov.sn/">'))[1]).split('</ns2:'))[0].split('><');
    // remove '<' at the beginning of 1st element
    arr[0] = (arr[0]).substr(1);

    // remove '>' at the end of last element
    arr[arr.length - 1] = (arr[arr.length - 1]).substring(0, (arr[arr.length - 1]).length - 1 );

    const result = {};
    let small_obj = {};
    let _arr = arr;
    const store_name = [];
    const store_value = [];
    const arr_objects = [];
    let arr_field = '';

    for (let i = 0; i < arr.length; i++) {

      if ((arr[i]).split('>').length === 1) {
        arr_field = arr[i];
        const ind_last = (arr.slice(i)).indexOf('/' + arr_field);
        _arr = arr.splice(i, ind_last);
        _arr.shift();
        store_name.push(arr_field);
        store_value.push(_arr);

      } else {
        const name = ((arr[i]).split('>'))[0];
        const value = ((((arr[i]).split('<'))[0]).split('>'))[1];
        result[name] = value;
      }
    }

    for (let i = 0; i < store_value.length; i++) {
      const _store = store_value[i];
      for (let j = 0; j < _store.length; j++) {
        const name = ((_store[j]).split('>'))[0];
        const value = ((((_store[j]).split('<'))[0]).split('>'))[1];
        small_obj[name] = value;
        if (j === (_store.length - 1)) {
          arr_objects.push(small_obj);
          small_obj = {};
        }
      }
    }
    result[arr_field] = arr_objects;
    return result;
  }


  public xmlResponseParcer___complex(response: string): any {
    const arr = (((response.split('<return>'))[1]).split('</return>'))[0].split('><');
    // remove '<' at the beginning of 1st element
    arr[0] = (arr[0]).substr(1);

    // remove '>' at the end of last element
    arr[arr.length - 1] = (arr[arr.length - 1]).substring(0, (arr[arr.length - 1]).length - 1 );

    let result = {};
    let small_obj = {};
    let _arr = arr;
    let store_name = [];
    let store_value = [];
    let arr_objects = [];
    let arr_field = '';

    for (let i = 0; i < arr.length; i++) {

      if ((arr[i]).split('>').length === 1) {
        arr_field = arr[i];
        const ind_last = (arr.slice(i)).indexOf('/' + arr_field);
        _arr = arr.splice(i, ind_last);
        _arr.shift();
        store_name.push(arr_field);
        store_value.push(_arr);

      } else {
        const name = ((arr[i]).split('>'))[0];
        const value = ((((arr[i]).split('<'))[0]).split('>'))[1];
        result[name] = value;
      }
    }
    for (let i = 0; i < store_value.length; i++) {
      const _store = store_value[i];
      for (let j = 0; j < _store.length; j++) {
        const name = ((_store[j]).split('>'))[0];
        const value = ((((_store[j]).split('<'))[0]).split('>'))[1];
        small_obj[name] = value;
        if (j === (_store.length - 1)) {
          arr_objects.push(small_obj);
          small_obj = {};
        }
      }
    }
    result[arr_field] = arr_objects;
    return result;
  }


  public xmlResponseParcer_errors(response: string): any {
    const arr = (((response.split('<soap:Fault>'))[1]).split('</soap:Fault>'))[0].split('><');

    // remove '<' at the beginning of 1st element
    arr[0] = (arr[0]).substr(1);

    // remove '>' at the end of last element
    arr[arr.length - 1] = (arr[arr.length - 1]).substring(0, (arr[arr.length - 1]).length - 1 );

    const result = {};
    for (let i = 0; i < arr.length; i++) {
      const name = ((arr[i]).split('>'))[0];
      const value = ((((arr[i]).split('<'))[0]).split('>'))[1];
      result[name] = value;
    }
    return result;
  }


  public colorAmountDependOnValue(selectorForParentElement: string) {
    const amounts = window.document.querySelectorAll(selectorForParentElement);
    for (let i = 0; i < amounts.length; i++) {
      const direction = (<HTMLSpanElement>amounts[i].firstElementChild.lastChild.previousSibling).innerText[0]; // + or -
      (<HTMLSpanElement>amounts[i].firstElementChild.lastChild.previousSibling).classList.add('profit');
      if (direction === '-') {
        (<HTMLSpanElement>amounts[i].firstElementChild.lastChild.previousSibling).classList.add('lesion');
      }
    }
  }

  public fromServerDateMoment(stringDate: string): string {
    return moment(stringDate).local().format('DD/MM/YYYY');
  }

  public fromServerTimeMoment(stringDate: string): string {
    return moment(stringDate).local().format('HH:mm:ss');
  }

  public removeEmptySelect2OnDestroy() {
    const select2 = <HTMLCollection>window.document.getElementsByClassName('select2-container');
    if (select2 && select2.length > 0) {
      for (let i = 0; i < select2.length; i++) {
        if (select2[i] && select2[i].classList.contains('select2-container--open')) {
          select2[i].classList.remove('select2-container--open');
        }
      }
    }
  }
  public removeEmptySelect2fromServices() {
    const select2 = <HTMLCollection>window.document.getElementsByClassName('select2-container');
    if (select2 && select2.length > 0) {
      for (let i = 0; i < select2.length; i++) {
        window.document.body.removeChild(select2[i]);
      }
    }
    const _select2 = <HTMLCollection>window.document.getElementsByClassName('select2-container');
  }


}
