/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon - 2 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {

  customersWithCourses: { customerId: string; customerName: string; customerEmail: string; courses: any[] }[] = [];

  private customerService = inject(CustomerService);
  private router = inject(Router);

  constructor() {}

  ngOnInit() {
    this.loadCustomersWithCourses();
  }

  loadCustomersWithCourses() {
    this.customerService.getAllCustomers().subscribe(customers => {
      this.customersWithCourses = customers
        .filter(customer => customer.customerCourses && customer.customerCourses.length > 0)
        .map(customer => ({
          customerId : customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          courses: customer.customerCourses?.map(course => course.course) || []
        }))
        .sort((a, b) => a.customerName.localeCompare(b.customerName));
    });
  }

  goToCustomerInfo(customerId: string, customerEmail: string) {
    this.router.navigate(['/customer-info', customerId, customerEmail]);
  }

}
