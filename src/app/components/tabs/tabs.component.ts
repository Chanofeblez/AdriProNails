/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon - 2 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit{

  @Input() navigation: string;

  private router = inject(Router);

  constructor() {
  }

  ngOnInit(): void {
  }

  onNavigate(name: string, navigate: boolean = true) {
      this.router.navigate([`/${name}`]);
  }
}
