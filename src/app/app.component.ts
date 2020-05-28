import {Component, Input, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {DateService} from '../app/shared/data.service'
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Task, TaskService} from "./shared/task.service";
import {MatPaginator} from "@angular/material/paginator";
import {getSortHeaderNotContainedWithinSortError} from "@angular/material/sort/sort-errors";
import {MatDialog, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DialogOverviewComponent} from "./dialog-overview/dialog-overview.component";

export interface DialogData {
  name: string;
  phone: string;
  datePerson: string;
  status: string;
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
  table: string[] = ['date', 'name', 'phone', 'status', 'button'];
  tableData: string[] = ['date', 'name', 'phone', 'status'];
  data = [];
  form: FormGroup;
  globalData = [];
  status = STATUS_DATA;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private _http: HttpClient,
              private tasksService: TaskService,
              public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.dataStorage = new MatTableDataSource<any>()


    this.form = new FormGroup({
      date: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required)
    })

// загрузка данных из firebase
    this.tasksService.load().subscribe(value => {
      console.log(value)
      let data = Object.keys(value);
      for (let i = 0; i < data.length; i++) {
        let info = Object.keys(value[data[i]])
        for (let z = 0; z < info.length; z++) {
          this.data.push(value[data[i]][info[z]])
          value[data[i]][info[z]]['id'] = info[z];
          this.changeClick(value[data[i]][info[z]]);

        }
      }
      console.log(this.data);
      this.dataStorage.data = this.data;
    }, error => console.log(error))

  }


  changeClick(item) {
    switch (item.status) {
      case 'Оплачено': {
        item['color'] = 'green';
        break;
      }
      case 'Связаться': {
        item['color'] = 'pink';
        break;
      }
      case 'Думает': {
        item['color'] = 'yellow';
        break;
      }
      case 'Отказ': {
        item['color'] = 'red';
        break;
      }
      case 'Жду оплату': {
        item['color'] = 'brown';
        break;
      }
      default: {
        item['color'] = 'white';
        break;
      }
    }
    this.tasksService.change(item).subscribe(value => {
      console.log(value)
    })
  }

  submit() {
    let datePerson = this.form.value.date;
    let name = this.form.value.name;
    let phone = this.form.value.phone;
    let status = this.form.value.status;

    datePerson = this.dateFormatter(datePerson);


    const task: Task = {
      datePerson,
      name,
      phone,
      status
    }
    console.log(datePerson)
    this.tasksService.create(task).subscribe(task => {
      this.data.push(task);
      this.form.reset();
      this.dataStorage.data = this.data;
      this.dataStorage.paginator = this.paginator;
    }, error => console.log(error))
    console.log(this.dataStorage)
  }

  dateFormatter(dateGet) {
    let date = new Date(dateGet);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    console.log(dd + "-" + mm + "-" + yyyy);
    return dd + "-" + mm + "-" + yyyy;
  }

  clickRow(data) {
    console.log(data)
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
