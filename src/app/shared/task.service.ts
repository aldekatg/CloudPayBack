import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import * as moment from "moment";

export interface Task {
  id?: string
  title: string
  date?: string
}

@Injectable({providedIn: 'root'})

export class TaskService {
  static url = 'https://sport-project-e052f.firebaseio.com/'

  constructor(private http: HttpClient) {

  }

  load(): Observable<Task[]>{
    return this.http
      .get<Task[]>(`${TaskService.url}.json`)
      .pipe(map(value => {
        console.log(value)
        if (!value){
          return []
        }
        return Object.keys(value).map(key => ({...value[key], id: key}))
      }))
  }

  create(task: Task): Observable<Task> {
    return this.http.post<any>(`${TaskService.url}/${task.date}.json`, task)
      .pipe(map(res => {
        console.log(res)
        return res
      }))
  }
}
