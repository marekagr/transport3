import { Component,inject, viewChild, TemplateRef,ChangeDetectorRef,ChangeDetectionStrategy,effect, computed ,signal} from '@angular/core';
import { CommonModule,AsyncPipe, NgIf } from "@angular/common";
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, of,Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError,filter } from 'rxjs/operators';

import { FullCalendarModule, CalendarOptions,FullCalendarComponent } from "@fullcalendar/angular";
// import themePlugin from "@fullcalendar/angular/themes/monarch"; // YOUR THEME
// import dayGridPlugin from "@fullcalendar/angular/daygrid";
// import interactionPlugin from '@fullcalendar/angular/interaction';
// import plLocale from 'fullcalendar/locales/pl';
import { TuiButton, TuiDialogService, TuiTextfield, TuiLabel ,TuiIcon,TuiInput,TuiFilterByInputPipe,type TuiFilterByInputOptions,TuiLoader, TuiError,TuiNotificationService,TuiNumberFormat} from '@taiga-ui/core';
import {TuiDay, TuiTime,TUI_DEFAULT_MATCHER, TUI_STRICT_MATCHER} from '@taiga-ui/cdk';
import {TuiInputDateTime,TuiChevron, TuiDataListWrapper, TuiSelect,TuiComboBox,TuiStringifyContentPipe,TuiInputNumber  } from '@taiga-ui/kit';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {LoginDialog} from '../../../components/login/login-dialog/login-dialog'
import {CalendarService} from '../services/calendar'
import {CalendarCommonService} from '../../../../common/services/calendar-common'
  import { AuthService } from '../../../../common/services/auth-service';
import {CalendarEvent} from '../models/calendar-event'
// import {StatusService} from '../services/status'
import { Status } from '../models/status';
import { PurposeOfOrder } from '../models/purposeOfOrder';
import { Target } from '../models/target';
import { Jos } from '../models/jos';
import {Car} from '../../../../common/models/car'



@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule,CommonModule,ReactiveFormsModule, FormsModule, TuiButton, TuiTextfield, TuiLabel, TuiInputDateTime,
    TuiInput,TuiSelect,TuiChevron, TuiDataListWrapper, TuiComboBox,TuiFilterByInputPipe,TuiLoader,
    TuiError,TuiInputNumber,TuiNumberFormat],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Calendar  {
    private readonly dialogService = inject(TuiDialogService);
    private readonly alerts = inject(TuiNotificationService);
    private readonly cdr = inject(ChangeDetectorRef);
    protected readonly calendarService = inject(CalendarService); // Kept protected for template access
    protected readonly calendarCommonService = inject(CalendarCommonService);    
    protected readonly authService = inject(AuthService);
    protected readonly showLoader = signal(false);
    // protected readonly statusService = inject(StatusService); // Kept protected for template access
    // private statusResource=this.calendarCommonService.getSharedStatusArray()   //this.calendarCommonService.getResource<Status[]>('status')   //get status from MongoDB
    dropdownStatus = computed(() => {return this.calendarCommonService.getSharedStatusArray() ?? [];});
    dropdownpurposeOfOrder = computed(() => {return this.calendarCommonService.getSharedStatusArray() ?? [];});
    dropdownTarget = computed(() => {return this.calendarCommonService.getSharedTargetArray() ?? [];});
    dropdownJos = computed(() => {return this.calendarCommonService.getSharedJosArray() ?? [];});
    configApp = computed(() => {return this.calendarCommonService.getSharedConfigApp() ?? null;});
    readonly stringifyStatus = (status: Status) => status.name;
    readonly stringifyTarget = (target: Target) => target.name;
     readonly stringifyJOS = (jos: Jos) => jos.NAZWA;
    readonly searchJos$ = new BehaviorSubject<string>('');
    readonly loading$ = new BehaviorSubject<boolean>(false);

    private readonly dialogTemplate = viewChild<TemplateRef<any>>('newOrderDialog'); // Grab a reference to the <ng-template> inside our HTML template        
    private readonly calendarComponent = viewChild<FullCalendarComponent>('calendar');// 1. Grab a reference to the <full-calendar> instance from the HTML    
  
    
    protected readonly eventForm = new FormGroup({ // Form for creating the event
      // title: new FormControl('Transport', { nonNullable: true, validators: [Validators.required] }),
      // dateOfOrder: new FormControl<[TuiDay, TuiTime]> ([TuiDay.currentLocal(),TuiTime.currentLocal()], { validators: [Validators.required] }),
      id_pac: new FormControl<number|null>(null, { validators: [Validators.required] }),
      jos: new FormControl<Jos|null>(null, { nonNullable: true, validators: [Validators.required] }),
      car: new FormControl<Car|null>(null, { nonNullable: true, validators: [Validators.required] }),
      start: new FormControl<[TuiDay, TuiTime] | null>(null, { validators: [Validators.required] }),
      end: new FormControl<[TuiDay, TuiTime] | null>(null, { validators: [Validators.required] }),
      status: new FormControl<Status|undefined>(undefined, { nonNullable: true, validators: [Validators.required] }),
      // purposeOfOrder: new FormControl('wypis do domu', { nonNullable: true, validators: [Validators.required] }),
      target: new FormControl<Target|null>(null, { nonNullable: true, validators: [Validators.required] }),

    });
   

    
  //   private eventsList = [
  //   { title: 'Transport 1', start: '2026-07-10T10:00:00', end: '2026-07-10T11:30:00',allDay: false }
  // ];

  constructor() {
    //  console.log('statusResource',this.statusResource)  
    // Automatically hooks reactive streams directly to FullCalendar's local options structure
    effect(() => {
      console.log('events from service',this.calendarService.events())
      const activeEvents = this.calendarService.events();
      this.calendarOptions = {
        ...this.calendarOptions,
        events: activeEvents
      };
      this.cdr.markForCheck();
    });
    effect(()=>{
      const sharedCalendarView=this.calendarCommonService.getSharedCalendarView()
      console.log('view change',sharedCalendarView)
      const calendarApi = this.calendarComponent()?.getApi();
      if (calendarApi) {
        calendarApi.changeView(sharedCalendarView);
      }      
    })   
    // this.calendarCommonService.watchMongoResource(this.statusResource)
  }



  // Spread the service configurations as structural defaults directly into your local property
  protected calendarOptions: CalendarOptions = {
    ...this.calendarService.baseCalendarConfig,
    dateClick: (info) => this.handleDateClick(info),
    events: []
  };

   handleDateClick(info: any) {
    if(! this.authService.isAuthenticated()){
       this.dialogService
                  .open<string>(new PolymorpheusComponent(LoginDialog), {
                      label: 'Logowanie do systemu',
                      size: 's',
                      data: false,
                  })
                  .pipe(switchMap((name) => this.alerts.open(name)))
                  .subscribe();
      
     
    }
    else{
     console.log('calendar click',info )
    //   const tuiDay = TuiDay.fromLocalNativeDate(info.date);
    
    //   // Default the form to span 1 hour (e.g., 12:00 to 13:00)
    //   const defaultStartTime = new TuiTime(12, 0);
    //   const defaultEndTime = new TuiTime(13, 0);

    //   this.eventForm.setValue({
    //     title: 'Transport',
    //     startDateTime: [tuiDay, defaultStartTime],
    //     endDateTime: [tuiDay, defaultEndTime]
    //  });
      this.eventForm.setValue(this.calendarService.getDefaultFormValues(info,this.calendarComponent()?.getApi()?.view?.type!))
       
      const template = this.dialogTemplate();
      if (template) {
        this.dialogService.open(template, { size: 'l', label: 'Nowe zlecenie transportu',dismissible:false }).subscribe();
      }
    }
  }

  protected readonly itemsJos$ = this.searchJos$.pipe(
	        debounceTime(0), // ensure form control is updated after last input
	        // filter(() => !this.value), // click on datalist item should not trigger new api request
	        tap(() => this.showLoader.set(true)),
	        debounceTime(300),
	        switchMap((query) => (query.length > 2 ? this.calendarCommonService.getResourceParams<Jos>('jos',{query}) : of(null))),
	        tap(() => this.showLoader.set(false)),
	);
  



  // private formatToIsoString(dateTimeTuple: [TuiDay, TuiTime]): string {
  //   const [tuiDay, tuiTime] = dateTimeTuple;
  //   const hours = String(tuiTime.hours).padStart(2, '0');
  //   const minutes = String(tuiTime.minutes).padStart(2, '0');
  //   const year = tuiDay.year;
  //   const month = String(tuiDay.month + 1).padStart(2, '0');
  //   const day = String(tuiDay.day).padStart(2, '0');
    
  //   return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  // }

  protected saveEvent(observer: any) {
    //  eventForm = new FormGroup({ // Form for creating the event
    //   dateOfOrder: new FormControl<[TuiDay, TuiTime]> ([TuiDay.currentLocal(),TuiTime.currentLocal()], { validators: [Validators.required] }),
    //   start: new FormControl<[TuiDay, TuiTime] | null>(null, { validators: [Validators.required] }),
    //   end: new FormControl<[TuiDay, TuiTime] | null>(null, { validators: [Validators.required] }),
    //   orderDepartment: new FormControl('O/Chirurgii', { nonNullable: true, validators: [Validators.required] }),
    //   purposeOfOrder: new FormControl('wypis do domu', { nonNullable: true, validators: [Validators.required] }),
    //   target: new FormControl('Tarnobrzeg', { nonNullable: true, validators: [Validators.required] }),
    //   status: new FormControl('Rezerwacja', { nonNullable: true, validators: [Validators.required] }),
    //   patientPosition: new FormControl(null, { }),
    //   personValue: new FormControl(this.persons[0]),
    //   target: new FormControl('O/Chirurgii', { nonNullable: true, validators: [Validators.required] }),
    // });



  if (this.eventForm.invalid){ 
    this.eventForm.markAllAsTouched();
    return;
  }

  const rawValue = this.eventForm.getRawValue();

  const  eventPayload:CalendarEvent = {
      car:rawValue.car!,
      jos: rawValue.jos!,
      target: rawValue.target!,
      status: rawValue.status!,
      start: rawValue.start?this.calendarService.formatToIsoString(rawValue.start)  : "",
      end: rawValue.end ? this.calendarService.formatToIsoString(rawValue.end) : "",
    };
    // const dateOfOrder = this.eventForm.controls.dateOfOrder.value;
    // const startValue = this.eventForm.controls.startDateTime.value;
    // const endValue = this.eventForm.controls.endDateTime.value;

    if (rawValue.start && rawValue.end) {
      this.calendarService.addEvent(eventPayload);
    }

    observer.complete();
    
  }

  //  protected readonly filterTarget: TuiFilterByInputOptions<Target>['filter'] = (
  //       items,
  //       query,
  //   ) => {
       
  //       return filtered.length === 1 && TUI_STRICT_MATCHER(filtered[0], query)
  //           ? items // Reset filtering
  //           : filtered;
  //   };


}

  
