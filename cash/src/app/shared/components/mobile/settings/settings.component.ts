import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-mobile-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class MobileSettingsComponent implements OnInit {
  mobile: boolean;
  ww = 0;
  hh = 0;
  menuItems = [
    {caption: 'Account settings', routing: '/profile'},
    {caption: 'About us', routing: '/about-us'},
    {caption: 'Terms & Conditions', routing: '/terms-conditions'},
    {caption: 'FAQ', routing: '/faq'},
    {caption: 'Privacy policy', routing: '/privacy-policy'},
    {caption: 'Cancellation & Refund Policy', routing: '/cancellation-refund'},
    {caption: 'Share', routing: '/share'},
  ];
  @Input() userRole: string;



  constructor() {
    this.mobile = (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) < 500) ? true : false;
  }

  ngOnInit() {}

  getSize() {
    this.ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    console.log(document.documentElement.clientWidth + '  ' + window.innerWidth);
    this.hh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  }
}
