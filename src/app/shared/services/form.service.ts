import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  #original = {};
  #currentF = new FormGroup({});

  get currentForm() { return this.#currentF; }
  set currentForm(formGroup: FormGroup) { this.#currentF = formGroup; }

  get originalValues() { return this.#original; }
  set originalValues(formValues: Partial<{}>) { this.#original = formValues; }

  private findDifferences(original: any, current: any): any {
    let differences: any = {};

    for (const key of Object.keys(original)) {
      if (current.hasOwnProperty(key)) {
        if (Array.isArray(original[key]) && Array.isArray(current[key])) {
          const arrayDiff = this.findArrayDifferences(original[key], current[key]);
          if (arrayDiff.length > 0) {
            differences[key] = arrayDiff;
          }
        } else if (typeof original[key] === 'object' && original[key] !== null && current[key] !== null) {
          const nestedDiff = this.findDifferences(original[key], current[key]);
          if (Object.keys(nestedDiff).length > 0) {
            differences[key] = nestedDiff;
          }
        } else if (original[key] !== current[key]) {
          differences[key] = current[key];
        }
        // Preserve properties with "_id" in their name
        if (key.includes('_id')) {
          differences[key] = current[key];
        }
      }
    }

    for (const key of Object.keys(current)) {
      if (!original.hasOwnProperty(key)) {
        differences[key] = current[key];
      }
      // Ensure new "_id" properties are also preserved
      if (key.includes('_id')) {
        differences[key] = current[key];
      }
    }

    return differences;
  }

  private findArrayDifferences(original: any[], edited: any[]): any[] {
    const differences: any[] = [];

    for (let i = 0; i < edited.length; i++) {
      if (i < original.length) {
        const diff = this.findDifferences(original[i], edited[i]);
        if (Object.keys(diff).length > 0) {
          differences.push(edited[i]);
        }
      } else {
        differences.push(edited[i]);
      }
    }

    return differences;
  }

  getChangedValues(): any {
    const currentValues = this.#currentF.value;
    return this.findDifferences(this.#original, currentValues);
  }
}
