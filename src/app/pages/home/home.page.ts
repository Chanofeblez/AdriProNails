/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon - 2 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, inject, OnInit } from '@angular/core';
import { register } from 'swiper/element';
import {  CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { AppointmentService } from 'src/app/services/appointment.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/models/appointment.interface';
import { subDays, addDays } from 'date-fns';

register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  viewDate: Date = new Date();
  startOfWeek: Date;
  endOfWeek: Date;
  daysInWeek: { date: Date }[] = [];
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  refresh: Subject<any> = new Subject();
  hourStart: number = 10;
  hourEnd: number = 18;
  events: CustomCalendarEvent[] = [];
  selectedEvent: CustomCalendarEvent | null = null;
  popoverPosition = { x: 0, y: 0 };

  private appointmentService = inject(AppointmentService);
  private customerService = inject(CustomerService);
  private router = inject(Router);


  constructor() {}

  ionViewWillEnter() {
    this.loadAppointmentsData();
    this.updateWeekRange();
  }

  loadAppointmentsData() {
    this.appointmentService.getAllAppointments().subscribe((appointments: Appointment[]) => {
      this.events = [];

      // Itera sobre cada appointment y filtra por el rango de la semana actual
      appointments.forEach(appointment => {
        const appointmentDate = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);

        // Verifica si la fecha de la cita está dentro del rango de la semana actual
        if (appointmentDate >= this.startOfWeek && appointmentDate <= this.endOfWeek) {

          const endDate = new Date(appointmentDate);
          endDate.setHours(endDate.getHours() + 2);

          let cssClass = '';
          switch (appointment.status) {
            case 'CONFIRMED':
              cssClass = 'appointment-confirmed';
              break;
            case 'PENDING':
              cssClass = 'appointment-pending';
              break;
            case 'COMPLETED':
              cssClass = 'appointment-completed';
              break;
            default:
              cssClass = 'appointment-default';
          }

          // Llamada para obtener el nombre del cliente
          this.customerService.getCustomerByEmail(appointment.customerEmail).subscribe(customer => {
            const customerName = customer ? customer.name : 'Unknown';
            const customerId = customer ? customer.id : null;

            // Agrega el evento solo si la fecha está dentro del rango de la semana actual
            this.events.push({
              start: appointmentDate,
              end: endDate,
              title: `${customerName}`,
              cssClass: cssClass,
              customerId: customerId,
              customerEmail: appointment.customerEmail,
              status: appointment.status,
              appointmentId: appointment.id
            } as CustomCalendarEvent);
          });
        }
      });
    });
  }


  handleEvent(event: CustomCalendarEvent): void {
    console.log('Evento clickeado:', event);
  }

  updateWeekRange(): void {
    const currentDay = this.viewDate.getDay(); // 0 para domingo
    const distanceToStart = currentDay; // Sin ajuste ya que domingo es 0
    const distanceToEnd = 6 - currentDay; // 6 días hasta el sábado

    this.startOfWeek = new Date(this.viewDate);
    this.startOfWeek.setDate(this.startOfWeek.getDate() - distanceToStart);

    this.endOfWeek = new Date(this.viewDate);
    this.endOfWeek.setDate(this.endOfWeek.getDate() + distanceToEnd);

    this.daysInWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.startOfWeek);
      date.setDate(this.startOfWeek.getDate() + i);
      this.daysInWeek.push({ date });
    }
  }

  goToPreviousWeek(): void {
    this.viewDate = subDays(this.viewDate, 7);
    this.updateWeekRange();
    this.loadAppointmentsData(); // Cargar los appointments de la semana actualizada
    this.refresh.next(undefined);
  }

  goToNextWeek(): void {
    this.viewDate = addDays(this.viewDate, 7);
    this.updateWeekRange();
    this.loadAppointmentsData(); // Cargar los appointments de la semana actualizada
    this.refresh.next(undefined);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  formatHour(hour: number): string {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hour + 11) % 12 + 1); // Convierte a formato de 12 horas
    return `${formattedHour} ${suffix}`;
  }

  showPopover(event: CustomCalendarEvent, eventElement: EventTarget | null): void {
    if (!(eventElement instanceof HTMLElement)) {
      return; // Si no es un elemento HTML válido, detén la ejecución
    }

    if (this.selectedEvent === event) {
      this.closePopover();
      return;
    }

    this.selectedEvent = event;

    // Obtiene las coordenadas del elemento del evento en la pantalla
    const rect = eventElement.getBoundingClientRect();
    const popoverWidth = 200; // Ajusta según el ancho estimado del popover
    const popoverHeight = 100; // Ajusta según el alto estimado del popover
    const offsetX = 10; // Margen horizontal del popover
    const offsetY = 10; // Margen vertical del popover

    // Calcula la posición inicial del popover
    let posX = rect.left + rect.width + offsetX;
    let posY = rect.top;

    // Ajusta la posición si se sale de la pantalla
    if (posX + popoverWidth > window.innerWidth) {
      posX = rect.left - popoverWidth - offsetX; // Coloca el popover a la izquierda si se sale por la derecha
    }
    if (posY + popoverHeight > window.innerHeight) {
      posY = window.innerHeight - popoverHeight - offsetY; // Ajusta verticalmente si se sale por abajo
    }

    // Guarda la posición calculada en `popoverPosition`
    this.popoverPosition = { x: posX, y: posY };

    // Añade el listener para cerrar el popover cuando se haga clic fuera
    setTimeout(() => {
      document.addEventListener('touchstart', this.handleOutsideClick);
    });
  }

  closePopover(): void {
    this.selectedEvent = null;
    document.removeEventListener('touchstart', this.handleOutsideClick);
  }

  private handleOutsideClick = (event: TouchEvent): void => {
    const popoverElement = document.querySelector('.popover');
    if (popoverElement && !popoverElement.contains(event.target as Node)) {
      this.closePopover();
    }
  };


  goToBookingInfo(appointmentId: string): void {
    this.router.navigate([`/booking-info`, appointmentId]);
    this.selectedEvent = null;
  }
}

interface CustomCalendarEvent {
  start: Date;
  end: Date;
  title: string;
  cssClass: string;
  customerId?: string;
  customerEmail: string;
  status: string;
  appointmentId: string;
}
