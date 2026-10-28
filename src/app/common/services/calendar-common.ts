import { Injectable, inject,signal,computed,WritableSignal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs'
import {GlobalVariable} from '../../../global'

@Injectable({
  providedIn: 'root'
})
export class CalendarCommon {
  private readonly http = inject(HttpClient);
  globalUrl=GlobalVariable.BASE_API_URL;

  private readonly _sharedCalendarView=signal("dayGridMonth")
  public readonly getSharedCalendarView = computed(() => this._sharedCalendarView());
  private readonly _sharedDateStart = signal<Date | null>(null);
  private readonly _sharedDateEnd = signal<Date | null>(null);
  private readonly _shareMonthName = signal<string>('');
  public readonly getSharedDateStart = computed(() => this._sharedDateStart());
  public readonly getSharedDateEnd = computed(() => this._sharedDateEnd());
//   public readonly getSharedMonthName = computed(() => this._shareMonthName());
  public readonly getSharedMonthName = this._shareMonthName.asReadonly();




 setViewCalendar(widok: string) { this._sharedCalendarView.set(widok); }

 setSharedDateStart(data:Date) {this._sharedDateStart.set(data);}

 setSharedDateEnd(data:Date) { 
    // activeEnd is exclusive (e.g., Sunday 23:59:59 becomes Monday 00:00:00), 
      // so we subtract 1 day to show the true visible end date to the user.
      const realEnd = new Date(data);
      realEnd.setDate(realEnd.getDate() - 1);
      this._sharedDateEnd.set(data); 
    }

 setSharedMonth(month:string) { this._shareMonthName.set(month); } 


 /**
   * reusable function which get data from mongoDB
   * @param collection 
   * @returns 
   */
  public getResource<T>(collection: string) {
  return httpResource<T>(() => ({
    url: `${this.globalUrl}/${collection}`,
    method: 'GET',
  }));
}

}
