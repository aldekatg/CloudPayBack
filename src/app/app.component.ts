import {Component, Input} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {DateService} from '../app/shared/data.service'
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Task, TaskService} from "./shared/task.service";
import DateTimeFormat = Intl.DateTimeFormat;
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from "moment";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'CloudPay';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  dateData = [];
  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
    this.tasksService.load().subscribe(value => {
      for (let i = 0; i < value.length; i++) {
        let data = Object.keys(value[i]);
        for (let z = 0; z < data.length; z++) {
          this.dateData.push(value[i][data[z]].title)
        }
      }
      this.dateData = this.dateData.filter(function (x) {
        return x !== undefined && x !== null;
      });
      console.log(this.dateData)
    }, error => console.log(error))
  }

  constructor(private _http: HttpClient,
              public  dateService: DateService,
              private tasksService: TaskService,) {

    console.log(dateService.date)
  }

  datePick() {
    this.tasksService.load().subscribe(value => {
      console.log(value);
      // this.dataSource = value;
    }, error => console.log(error))
  }

  submit() {
    const {title} = this.form.value
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    }
    this.tasksService.create(task).subscribe(task => {
      this.form.reset()
    }, error => console.log(error))
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
}
