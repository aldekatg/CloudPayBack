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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface DialogData {
  animal: string;
  name: string;
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
  dataStorage: MatTableDataSource<any>;
  data = [];
  form: FormGroup;


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.dataStorage = new MatTableDataSource<any>()
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
          this.data.push(value[data[i]][info[z]])
        }
      }
      this.dataStorage.data = this.data;
      this.dataStorage.paginator = this.paginator;
    }, error => console.log(error))
    console.log(this.dataStorage);

  }

  constructor(private _http: HttpClient,
              public  dateService: DateService,
              private tasksService: TaskService,
              public dialog: MatDialog) {
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
      this.data.push(task);
      this.form.reset();
      this.dataStorage.data = this.data;
      this.dataStorage.paginator = this.paginator;
    }, error => console.log(error))
    console.log(this.dataStorage)
  }

  clickRow(data) {
    console.log(data);
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
}
