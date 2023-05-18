import { Component, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CustomEvent } from './utils/models/custom-event';
import { DaysPerWeek } from './utils/models/days-per-week';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Input() events!: CustomEvent[];

  constructor() {
    this._initializeForm();
    this.daysPerWeek = this.getWeeksInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
    console.log("Dias del mes", this.daysPerWeek);
  }


  title = 'calendar-component';
  public daysPerWeek: Array<DaysPerWeek[]> = [];
  public currentDate: Date = new Date();
  public daysOfWeek: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  public isAddingEvent: boolean = false;
  public activeDay: Date = new Date();
  public eventForm!: UntypedFormGroup;

  public getWeeksInMonth(year: number, month: number): Array<DaysPerWeek[]> {
    let isFirstWeek = true;
    const weeks: Array<DaysPerWeek[]> = [],
     firstDate: Date = new Date(year, month, 1),
     lastDate: Date = new Date(year, month + 1, 0),
     numDays: number = lastDate.getDate();   
 
    let dayOfWeekCounter = firstDate.getDay() - 1;
    let dayOfWeek = firstDate.getDay() - 1;
     
    for (let date = 1; date <= numDays; date++) {   
     if (dayOfWeekCounter === 0 || weeks.length === 0) weeks.push([]);
     if (isFirstWeek) {
      if(dayOfWeek === -1) dayOfWeek = 6;
       for (let i = 0; i < dayOfWeek; i++) {
         weeks[weeks.length - 1].push({ date: new Date(year, month, -(dayOfWeek-i-1)), dayOfWeek: i, events: [], outOfMonth: true });   
       }
       isFirstWeek = false;
     }
     weeks[weeks.length - 1].push({ date: new Date(year, month, date), dayOfWeek, events: [] });
     if(date === numDays) {
       for(let i = dayOfWeek+1; i < 7; i++) {
         date++;
         weeks[weeks.length - 1].push({ date: new Date(year, month, date), dayOfWeek: i, events: [], outOfMonth: true });   
        }
      }   
      if (dayOfWeek == 6) dayOfWeek = 0;
      else dayOfWeek += 1;
      dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
    }
    return weeks.filter(w => !!w.length);    
   }
 
   public changeMonth(action: string): void {
     if(action == "+") this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
     else this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
     this.daysPerWeek = this.getWeeksInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
   }
 
   public openModalNewEvent(day: DaysPerWeek) {
    if(day.outOfMonth) {
      this.currentDate = new Date(day.date);
      this.daysPerWeek = this.getWeeksInMonth(day.date.getFullYear(), day.date.getMonth())
    }
     this.isAddingEvent = true;
     console.log("Dia seleccionado", day)
   }
 
   public saveEvent(e: Event) {
     let event: CustomEvent = {
       title: this.eventForm.controls["title"].value,
       description: this.eventForm.controls["description"].value,
       day: new Date(this.eventForm.controls["date"].value)
     }
     this.isAddingEvent = false;
     this._initializeForm();
   }
 
   public change(e: Event) {
     console.log("change", e);
   }
 
   private _initializeForm(): void {
     this.eventForm = new UntypedFormGroup({
       title: new UntypedFormControl(""),
       description: new UntypedFormControl(""),
       date: new UntypedFormControl("")
     })
   }
}
