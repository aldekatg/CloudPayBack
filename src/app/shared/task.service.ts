import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import * as moment from "moment";
import {DateService} from "./data.service";

export interface Task {
  id?: string
  datePerson: string
  name: string
  phone: string
  status: string
}

@Injectable({providedIn: 'root'})

export class TaskService {
  static url = 'https://sport-project-e052f.firebaseio.com/'

  constructor(private http: HttpClient,
              private dateService: DateService) {

  }

  load(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TaskService.url}.json`)
      .pipe(map(value => {
        if (!value) {
          return []
        }
        return value
      }))
  }

  create(task: Task): Observable<Task> {
    task['dateSave'] = this.dateService.date.value.format('DD-MM-YYYY');
    return this.http.post<any>(`${TaskService.url}/${this.dateService.date.value.format('DD-MM-YYYY')}.json`, task)
      .pipe(map(res => {
        console.log(`${TaskService.url}/${this.dateService.date.value.format('DD-MM-YYYY')}.json`, task)
        console.log(res)
        return task
      }))
  }

  change(task: Task): Observable<Task> {
    console.log(task)
    return this.http.put<any>(`${TaskService.url}${task['dateSave']}/${task.id}.json`, task)
      .pipe(map(res => {
        console.log(res)
        return task
      }))
  }
}
