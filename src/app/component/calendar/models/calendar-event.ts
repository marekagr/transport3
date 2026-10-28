import {Jos} from './jos'
import {Target} from './target'
import { Status } from './status';


export interface CalendarEvent {
  start: string;
  end: string;
  jos: Jos;
  target:Target;
  status:Status;
} 