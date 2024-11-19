/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon - 2 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.interface';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.page.html',
  styleUrls: ['./payment-summary.page.scss'],
})
export class PaymentSummaryPage implements OnInit {

  totalEarnings: number = 0;
  reportData: { date: string; earnings: number }[] = [];
  currentPeriod: string = 'day';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadEarningsData();
    this.currentPeriod = "day";
  }

  onPeriodChange(event: any) {
    this.currentPeriod = event.detail.value;
    this.loadEarningsData();
  }

  loadEarningsData() {
    this.appointmentService.getAllAppointments().subscribe(appointments => {
      // Filtrar appointments completados
      const completedAppointments = appointments.filter(appointment => appointment.status === 'COMPLETED');

      // Calcular ganancias según el período seleccionado
      let earningsByPeriod = this.calculateEarningsByPeriod(completedAppointments);

      // Ordenar en orden descendente por fecha
      earningsByPeriod = earningsByPeriod.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Asignar los datos ordenados a reportData
      this.reportData = earningsByPeriod;

      // Calcular el total de ganancias
      this.totalEarnings = earningsByPeriod.reduce((sum, report) => sum + report.earnings, 0);
    });
  }


  calculateEarningsByPeriod(appointments: Appointment[]): { date: string; earnings: number }[] {
    const earningsByPeriod: { date: string; earnings: number }[] = [];
    const periodFormat = this.currentPeriod === 'week' ? 'week' : this.getDateFormat(this.currentPeriod);

    const groupedAppointments = appointments.reduce((acc, appointment) => {
      let dateKey: string;

      if (this.currentPeriod === 'week') {
        // Agrupar por semana
        const appointmentDate = new Date(appointment.appointmentDate);
        const startOfWeek = new Date(appointmentDate);
        startOfWeek.setDate(appointmentDate.getDate() - appointmentDate.getDay()); // Primer día de la semana
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Último día de la semana

        dateKey = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else {
        // Agrupar por día, mes o año
        dateKey = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: this.currentPeriod === 'month' || this.currentPeriod === 'day' ? 'short' : undefined,
          day: this.currentPeriod === 'day' ? 'numeric' : undefined,
        });

      }



      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }
      acc[dateKey] += appointment.totalCost; // Asumiendo que `totalCost` representa la ganancia

      return acc;
    }, {} as { [key: string]: number });

    for (const date in groupedAppointments) {
      earningsByPeriod.push({ date, earnings: groupedAppointments[date] });
    }

    return earningsByPeriod;
  }


  getDateFormat(period: string): Intl.DateTimeFormatOptions {
    switch (period) {
      case 'day':
        return { day: 'numeric', month: 'short', year: 'numeric' };
      case 'week':
        return { day: 'numeric', month: 'short', year: 'numeric' }; // Puedes adaptar el formato de semana si es necesario
      case 'month':
        return { month: 'short', year: 'numeric' };
      case 'year':
        return { year: 'numeric' };
      default:
        return { day: 'numeric', month: 'short', year: 'numeric' };
    }
  }

}
