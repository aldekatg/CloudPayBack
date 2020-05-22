import {Component, Input, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {DateService} from '../app/shared/data.service'
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Task, TaskService} from "./shared/task.service";
import {newArray} from "@angular/compiler/src/util";
import * as moment from "moment";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {animate, state, style, transition, trigger} from "@angular/animations";

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
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  title = 'CloudPay';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  tableName: string[] = ['date', 'name', 'phone'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  value;
  dataStorage = [];
  form: FormGroup;

  ngOnInit() {
    this.dataStorage = [];
    this.form = new FormGroup({
      date: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
    })

    this.tasksService.load().subscribe(value => {
      let data = Object.keys(value);
      for (let i = 0; i < data.length; i++) {
        let info = Object.keys(value[data[i]])
        for (let z = 0; z < info.length; z++) {
          this.dataStorage.push(value[data[i]][info[z]])
          console.log(this.dataStorage);
        }
      }
    }, error => console.log(error))
  }

  constructor(private _http: HttpClient,
              public  dateService: DateService,
              private tasksService: TaskService) {

  }

  datePick() {
    this.tasksService.load().subscribe(value => {
      console.log(value);
    }, error => console.log(error))
  }

  submit() {
    let datePerson = this.form.value.date;
    let name = this.form.value.name;
    let phone = this.form.value.phone;
    const task: Task = {
      datePerson,
      name,
      phone,
    }
    this.tasksService.create(task).subscribe(task => {
      this.dataStorage.push(task)
      this.form.reset()
    }, error => console.log(error))
    console.log(this.dataStorage)
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
}
