import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  #originalForm?: { [key: string]: any }
  #formGroup?: FormGroup

  patchValues(values: any) { this.formGroup?.patchValue(values) }

  markAsPristineAndUntouched() {
    this.#formGroup?.markAsPristine()
    this.#formGroup?.markAsUntouched()
  }

  resetToOriginalValues() {
    this.#formGroup?.patchValue(this.originalValues)
    this.#formGroup?.markAsUntouched()
    this.#formGroup?.markAsPristine()
  }

  get formValue() { return this.formGroup?.value }

  get originalValues() { return this.#originalForm }
  set originalValues(values: any) { this.#originalForm = values }

  get formGroup(): FormGroup | undefined { return this.#formGroup }
  set formGroup(form: FormGroup | undefined) { this.#formGroup = form }
}
