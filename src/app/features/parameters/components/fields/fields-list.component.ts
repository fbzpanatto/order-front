import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../../../shared/services/form.service';
import { SuccessPATCH } from '../../../../shared/interfaces/response/response';

@Component({
  selector: 'app-fields',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './fields-list.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/form.scss', '../../../../styles/table.scss'],
})
export class FieldsListComponent {

  #title?: string

  #route = inject(ActivatedRoute)

  titleSettings() { this.title = 'Campos personalizados para Clientes' }

  async onSubmit() {

  }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }
}
