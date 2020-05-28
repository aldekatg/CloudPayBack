import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../app.component";


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

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    console.log(this.data)
    this.selected = this.data.status;
  }

}
