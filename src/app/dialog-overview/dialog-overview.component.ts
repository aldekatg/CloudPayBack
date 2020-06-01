import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AppComponent, DialogData} from "../app.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Task, TaskService} from "../shared/task.service";


interface Status {
  value: string;
  viewValue: string;
}

const STATUS_DATA: Status[] = [
  {value: 'call-0', viewValue: 'Связаться'},
  {value: 'sink-1', viewValue: 'Думает'},
  {value: 'pay-2', viewValue: 'Жду оплату'},
  {value: 'payed-2', viewValue: 'Оплачено'},
  {value: 'cancel-2', viewValue: 'Отказ'}
]

@Component({
  selector: 'app-dialog-overview',
  templateUrl: './dialog-overview.component.html',
  styleUrls: ['./dialog-overview.component.css']
})
export class DialogOverviewComponent implements OnInit {
  status = STATUS_DATA;
  selected;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public tasksService: TaskService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      date: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      status: new FormControl
    })
    this.selected = this.data.status;
  }

  saveChange() {
    let datePerson = this.form.value.date;
    let name = this.form.value.name;
    let phone = this.form.value.phone;
    let status = this.form.value.status;
    let id = this.data['id'];
    let dateSave = this.data['dateSave']

    const
      task: Task = {
        datePerson,
        name,
        phone,
        status,
        id,
        dateSave
      }
    console.log(this.data)
    this.tasksService.change(task).subscribe(task => {
      console.log(task)
    }, error => console.log(error))
  }
}
