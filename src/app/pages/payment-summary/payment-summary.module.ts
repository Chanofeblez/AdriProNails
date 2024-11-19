/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon - 2 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentSummaryPageRoutingModule } from './payment-summary-routing.module';

import { PaymentSummaryPage } from './payment-summary.page';
import { ComponentModule } from "../../components/component.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentSummaryPageRoutingModule,
    ComponentModule
],
  declarations: [PaymentSummaryPage]
})
export class PaymentSummaryPageModule { }
