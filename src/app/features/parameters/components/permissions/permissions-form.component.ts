import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormService } from '../../../../shared/services/form.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permissions-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './permissions-form.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/form.scss']
})
export class PermissionsFormComponent {

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)

  form = this.#fb.group({
  })

  onSubmit(){

  }

  get command() { return this.#route.snapshot.paramMap.get('command') }

}
