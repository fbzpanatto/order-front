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

  // Método para comparar dois objetos e retornar um objeto com as diferenças
  private findDifferences(original: any, edited: any): any {
    let differences:any = {};

    for (const key in original) {
      if (original.hasOwnProperty(key) && edited.hasOwnProperty(key)) {
        if (Array.isArray(original[key]) && Array.isArray(edited[key])) {
          const arrayDiff = this.findArrayDifferences(original[key], edited[key]);
          if (arrayDiff.length > 0) {
            differences[key] = arrayDiff;
          }
        } else if (typeof original[key] === 'object' && original[key] !== null && edited[key] !== null) {
          const nestedDiff = this.findDifferences(original[key], edited[key]);
          if (Object.keys(nestedDiff).length > 0) {
            differences[key] = nestedDiff;
          }
        } else if (original[key] !== edited[key]) {
          differences[key] = edited[key];
        }
      }
    }

    for (const key in edited) {
      if (edited.hasOwnProperty(key) && !original.hasOwnProperty(key)) {
        differences[key] = edited[key];
      }
    }

    return differences;
  }

  // Método para comparar dois arrays e retornar as diferenças
  private findArrayDifferences(original: any[], edited: any[]): any[] {
    const differences = [];
    
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

  // Método para obter os valores alterados do formulário
  getChangedValues(): any {
    const currentValues = this.#currentF.value;
    return this.findDifferences(this.#original, currentValues);
  }
}
