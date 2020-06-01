import {Component, Input, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {DateService} from '../app/shared/data.service'
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Task, TaskService} from "./shared/task.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogOverviewComponent} from "./dialog-overview/dialog-overview.component";
import * as moment from "moment";
import {MatSort} from "@angular/material/sort";
import {MatSnackBar} from "@angular/material/snack-bar";

export interface DialogData {
  name: string;
  phone: string;
  datePerson: string;
  status?: string;
}

const STATUS_DATA = [
  {value: 'call-0', viewValue: 'Связаться'},
  {value: 'sink-1', viewValue: 'Думает'},
  {value: 'pay-2', viewValue: 'Жду оплату'},
  {value: 'payed-2', viewValue: 'Оплачено'},
  {value: 'cancel-2', viewValue: 'Отказ'}
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent {
  title = 'CloudPay';
  dataStorage: MatTableDataSource<any>;
  dataStorageDead: MatTableDataSource<any>;
  table: string[] = ['date', 'deadLine', 'name', 'phone', 'status', 'btn'];
  tableData: string[] = ['date', 'dateStart', 'name', 'phone', 'status'];
  data = [];
  dataDeadLine = [];
  index = []
  spinner = true;
  form: FormGroup;
  status = STATUS_DATA;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private _http: HttpClient,
              private tasksService: TaskService,
              public dialog: MatDialog,
              public dateService: DateService,
              private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.dataStorage = new MatTableDataSource<any>()
    this.dataStorageDead = new MatTableDataSource<any>()
    this.form = new FormGroup({
      dateStart: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      status: new FormControl
    })
    this.loadData();
  }

  loadData() {
    this.data = [];
    this.dataDeadLine = [];

// загрузка данных из firebase
    this.tasksService.load().subscribe(value => {
      let data = Object.keys(value);
      for (let i = 0; i < data.length; i++) {
        let info = Object.keys(value[data[i]])
        for (let z = 0; z < info.length; z++) {
          value[data[i]][info[z]]['id'] = info[z];
          this.changeClick(value[data[i]][info[z]]);
          value[data[i]][info[z]]['deadLine'] = this.deadLine(value[data[i]][info[z]].dateStart, value[data[i]][info[z]].datePerson)
          this.data.push(value[data[i]][info[z]]);
          if (value[data[i]][info[z]].deadLine < 4)
            this.dataDeadLine.push(value[data[i]][info[z]])
          if (value[data[i]][info[z]].status == 'Отказ') {
            this.dataDeadLine.splice(this.dataDeadLine.indexOf(value[data[i]][info[z]]), 1);
          }
        }


      }
      this.spinner = false;
      this.dataStorage.data = this.data;
      this.dataStorageDead.data = this.dataDeadLine;
      this.dataStorageDead.sort = this.sort;
    }, error => console.log(error))

  }


  changeClick(item) {
    switch (item.status) {
      case 'Оплачено': {
        item['color'] = '#009933';
        break;
      }
      case 'Связаться': {
        item['color'] = '#9933CC';
        break;
      }
      case 'Думает': {
        item['color'] = '#6666FF';
        break;
      }
      case 'Отказ': {
        item['color'] = '#FF3333';
        break;
      }
      case 'Жду оплату': {
        item['color'] = '#FF6633';
        break;
      }
      default: {
        item['color'] = 'white';
        break;
      }
    }
  }

  saveBtn(item) {
    if (item.status == 'Оплачено') {
      item.datePerson = this.payedFunc(item.datePerson);
      console.log(item.datePerson)
      this.deadLine(item.dateStart, item.datePerson);
    } else if (item.status == 'Отказ') {
      console.log('ОТКАЗ');
    }
    this.tasksService.change(item).subscribe(value => {
      console.log(value);
      this.openSnackBar(item.status, 'status');
      this.loadData();
    }, error => {
      console.log(error);
    })
  }

  openSnackBar(value, when) {
    if (when == 'status') {
      this._snackBar.open('Статус изменен на: ' + value, 'Закрыть', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } else if (when == 'create') {
      this._snackBar.open('Новый пользователь ' + value + ' добавлен.', 'Закрыть', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    }
  }

  submit() {
    let datePerson = this.form.value.dateStart;
    let name = this.form.value.name;
    let phone = this.form.value.phone;
    let dateStart = this.form.value.dateStart;
    let status = 'Связаться';

    datePerson = this.dateFormatter(datePerson);
    datePerson = this.payedFunc(datePerson)
    dateStart = this.dateFormatter(dateStart);

    const task: Task = {
      datePerson,
      dateStart,
      name,
      phone,
      status
    }
    this.tasksService.create(task).subscribe(task => {
      this.data.push(task);
      this.form.reset();
      this.loadData();
      this.openSnackBar(task.name, 'create');
    }, error => console.log(error))
  }

  payedFunc(item) { // Логика при статусе "Оплативший"
    let date = moment(item, "DD-MM-YYYY");
    let day = date.date();
    let month = date.month() + 2;
    let year = date.year();
    console.log(day + '-' + month + '-' + year);
    return day + '-' + month + '-' + year;
  }

  dateFormatter(dateGet) {
    let date = new Date(dateGet);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    return dd + "-" + mm + "-" + yyyy;
  }

  deadLine(dateStart, dateEnd) { // Функция считает разность между текущей датой и датой окончания абонемента
    let currentDay = this.dateService.date.value.format('DD-MM-YYYY');
    let a = moment(dateStart, "DD-MM-YYYY");
    let b = moment(dateEnd, "DD-MM-YYYY");
    let c = moment(currentDay, "DD-MM-YYYY");

    // let newDate = this.addMonth(dateStart, c.month() - b.month())
    // let ss = moment(newDate, "DD-MM-YYYY");

    let days = b.diff(c, 'days');
    return days;
  }

  addMonth(date, mon) {
    let dateStart = moment(date, 'DD-MM-YYYY');
    let dd = dateStart.date();
    let mm = dateStart.month() + 1 + mon;
    let yy = dateStart.year();
    return dd + '-' + mm + '-' + yy;

  }

  clickRow(data) {
    // const dialogRef = this.dialog.open(DialogOverviewComponent, {
    //   width: '600px',
    //   data: data
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

}
