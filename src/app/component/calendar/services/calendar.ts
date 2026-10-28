import { Service,signal,computed, Injectable ,inject} from '@angular/core';
import { httpResource, HttpResourceRef,HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/angular';
import themePlugin from "@fullcalendar/angular/themes/monarch"; // V7 Theme Plugin
import dayGridPlugin from "@fullcalendar/angular/daygrid";
import interactionPlugin from '@fullcalendar/angular/interaction';
import timeGridPlugin from "@fullcalendar/angular/timegrid"; // 1. Import timeGrid
import plLocale from 'fullcalendar/locales/pl';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import {GlobalVariable} from '../../../../global'
import {CalendarCommon} from '../../../common/services/calendar-common'
import {CalendarEvent} from '../models/calendar-event'
import {Status} from '../models/status'
import { ConfigApp } from '../models/config-app';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  protected readonly calendarCommonService = inject(CalendarCommon);
  private readonly http = inject(HttpClient);
  private readonly currentRangeStart = signal<Date | null>(null);
  public readonly currentRangeEnd = signal<Date | null>(null);
  public readonly currentMonthName = signal<string>('');
  globalUrl=GlobalVariable.BASE_API_URL;

// Signal state managing the events array internally
  private readonly _events = signal<CalendarEvent[]>([
    { start: '2026-10-10T10:00:00', end: '2026-10-10T11:30:00', target:{_id:0,name:'Tarnobrzeg'}, status:{_id:0,name:'rezerwacja wstępna'} ,
    jos:{ _id: '', NAZWA: '', idk_jos: '',stan_dostepn:'',idk_jos_nadrz: '',typ: '',podtyp: '', opk: ''},car:this.calendarCommonService.getSharedConfigApp()[0]?.defaultCar[0]?.car}
  ]);

  // Public readonly value exposing current events
  public readonly events = computed(() => this._events());


  public readonly baseCalendarConfig: Partial<CalendarOptions> = {
    initialView: "dayGridMonth",
    plugins: [themePlugin, dayGridPlugin, interactionPlugin,timeGridPlugin],
    weekends: true,
    locale: plLocale, 
    displayEventEnd: true, 
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', meridiem: false, hour12: false },
    // This hook runs automatically when dates or views shift
    datesSet: (dateInfo: any) => {
      const view = dateInfo.view;
      
      // 1. Save the exact visible Date objects
      this.calendarCommonService.setSharedDateStart(view.activeStart);
      
      // activeEnd is exclusive (e.g., Sunday 23:59:59 becomes Monday 00:00:00), 
      // so we subtract 1 day to show the true visible end date to the user.
      // const realEnd = new Date(view.activeEnd);
      // realEnd.setDate(realEnd.getDate() - 1);
      this.calendarCommonService.setSharedDateEnd(view.activeEnd);

      // 2. Extract the current view title (e.g., "Lipiec 2026" or "6 – 12 lipca 2026")
      this.calendarCommonService.setSharedMonth(view.title);
    }
  };

  /**
   * Transforms Taiga UI [TuiDay, TuiTime] structures into a standard FullCalendar ISO string.
   */
  public formatToIsoString(dateTimeTuple: [TuiDay, TuiTime]|null): string {
     if (!dateTimeTuple) return ''

    const [tuiDay, tuiTime] = dateTimeTuple;
    const hours = String(tuiTime.hours).padStart(2, '0');
    const minutes = String(tuiTime.minutes).padStart(2, '0');
    const year = tuiDay.year;
    const month = String(tuiDay.month + 1).padStart(2, '0');
    const day = String(tuiDay.day).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }

  /**
   * Adds a new event to the list immutably.
   */
  public addEvent( data:CalendarEvent): void {
    // const newEvent: CalendarEvent = {
    //   // dateOfOrder:this.formatToIsoString(dateOfOrder),
    //   start: this.formatToIsoString(start),
    //   end: this.formatToIsoString(end),
      
    //   target,
    //   status,
      
    // };

    // Update state via mutating signal values immutably
  this.http.post<CalendarEvent>(`${this.globalUrl}/calendarEvent`,data).subscribe({
    next: (newEvent)=>{this._events.update(prevEvents => [...prevEvents, newEvent]);},
    error: (err)=>console.error('error creating event',err)
  })
    // this._events.update(prevEvents => [...prevEvents, data]);
  }


  /**
   * Generates default form values based on a clicked calendar date.
   */
  public getDefaultFormValues(dane: any,calendarView:string) {
    const nativeDate=dane.date
    const currentData=new Date()

    const tuiDay = TuiDay.fromLocalNativeDate(nativeDate);
    const tuiTime = TuiTime.fromLocalNativeDate(nativeDate)
    const defaultStartTime = new TuiTime(calendarView=="dayGridMonth"?10:tuiTime.hours,calendarView!="dayGridMonth"?0:tuiTime.minutes);
    const defaultEndTime = new TuiTime(calendarView=="dayGridMonth"?11:tuiTime.hours+1,calendarView!="dayGridMonth"?0:tuiTime.minutes);
    const status=this.calendarCommonService.findByField(this.calendarCommonService.getSharedStatusArray(),'name','Rezerwacja')
    
    const car=this.calendarCommonService.getSharedConfigApp()[0]?.defaultCar[0]?.car||null
    console.log('defaultCAr',car)

    return {
    
      // dateOfOrder:[TuiDay.fromLocalNativeDate(currentData), TuiTime.fromLocalNativeDate(currentData)] as [TuiDay, TuiTime],
      id_pac:null,
      jos:null,
      start: [tuiDay, defaultStartTime] as [TuiDay, TuiTime],
      end: [tuiDay, defaultEndTime] as [TuiDay, TuiTime],
      status:status,
      target:null,
      car:car||null
    };
  }




// protected readonly status: readonly Status[] = [
//     {_id: 1, name: 'Rezerwacja'},
//     {_id: 2, name: 'Zatwierdzony'},
//     {_id: 3, name: 'Zrealizowany'},
//     {_id: 4, name: 'Niezrealizowany'},	       
// ];


}
