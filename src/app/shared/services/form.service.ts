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

  // Método para comparar dois objetos e retornar um objeto com as diferenças, mantendo os campos especificados
  private findDifferences(original: any, edited: any, fieldsToKeep: string[] = []): any {
    let differences: any = {}

    for (const key in original) {
      if (original.hasOwnProperty(key) && edited.hasOwnProperty(key)) {
        if (Array.isArray(original[key]) && Array.isArray(edited[key])) {
          const arrayDiff = this.findArrayDifferences(original[key], edited[key], fieldsToKeep);
          if (arrayDiff.length > 0) {
            differences[key] = arrayDiff;
          }
        } else if (typeof original[key] === 'object' && original[key] !== null && edited[key] !== null) {
          const nestedDiff = this.findDifferences(original[key], edited[key], fieldsToKeep);
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

    // Adicionar campos que devem ser mantidos
    fieldsToKeep.forEach(field => {
      if (edited.hasOwnProperty(field)) {
        differences[field] = edited[field];
      }
    });

    return differences;
  }

  // Método para comparar dois arrays e retornar as diferenças, mantendo os campos especificados
  private findArrayDifferences(original: any[], edited: any[], fieldsToKeep: string[] = []): any[] {
    let differences: any = []

    for (let i = 0; i < edited.length; i++) {
      if (i < original.length) {
        const diff = this.findDifferences(original[i], edited[i], fieldsToKeep);
        if (Object.keys(diff).length > 0) {
          differences.push(diff);
        }
      } else {
        let diff: any = {}
        for (const key of fieldsToKeep) {
          if (edited[i].hasOwnProperty(key)) {
            diff[key] = edited[i][key];
          }
        }
        differences.push({ ...edited[i], ...diff });
      }
    }

    return differences;
  }

  // Método para obter os valores alterados do formulário, mantendo os campos especificados
  getChangedValues(fieldsToKeep: string[] = []): any {
    const currentValues = this.#currentF.value;
    return this.findDifferences(this.#original, currentValues, fieldsToKeep);
  }
}
