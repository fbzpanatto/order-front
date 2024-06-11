import { Injectable } from '@angular/core';
import {Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  showDialog = false
  message: string = ''

  #subject = new Subject<boolean>()
  subject = this.#subject.asObservable()

  next(value: boolean) { this.#subject.next(value) }
}
