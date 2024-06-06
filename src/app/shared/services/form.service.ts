import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  #original: FormGroup = new FormGroup({})
  #currentF: FormGroup = new FormGroup({})

  get current() { return this.#currentF }
  set current(form: FormGroup) { this.#currentF = form }

  get original() { return this.#original }
  set original(form: FormGroup) { this.#original = form }
}
