import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../../shared/services/form.service';

@Component({
  selector: 'app-fields',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './fields.component.html',
  styleUrls: ['../../../styles/title-bar.scss', '../../../styles/form.scss', '../../../styles/table.scss'],
})
export class FieldsComponent {

  #title?: string

  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)

  form: FormGroup;

  constructor() {
    this.form = this.#fb.group({
      first_field: ['Primeiro Campo', {
        validators: [Validators.required]
      }],
      first_field_custom: ['', {
        validators: [Validators.required]
      }],
      second_field: ['Segundo Campo', {
        validators: [Validators.required]
      }],
      second_field_custom: ['', {
        validators: [Validators.required]
      }],
      third_field: ['Terceiro Campo', {
        validators: [Validators.required]
      }],
      third_field_custom: ['', {
        validators: [Validators.required]
      }]
    })
  }

  titleSettings() { this.title = 'Campos personalizados para Clientes' }

  onSubmit() {

  }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get command() { return this.#route.snapshot.paramMap.get(environment.COMMAND) }
}
