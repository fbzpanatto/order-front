import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormService } from '../../../../shared/services/form.service';
import { CommonModule } from '@angular/common';
import { SelectComponent } from "../../../../shared/components/select.component";
import { FetchRolesService } from '../../../../shared/services/fetchRoles.service';
import { SuccessGET } from '../../../../shared/interfaces/response/response';
import { Option } from '../../../../shared/components/select.component';

@Component({
  selector: 'app-permissions-form',
  standalone: true,
  templateUrl: './permissions-form.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/form.scss'],
  imports: [ReactiveFormsModule, CommonModule, SelectComponent]
})
export class PermissionsFormComponent {

  #rolesArray: any[] = []

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #rolesHttp = inject(FetchRolesService)

  form = this.#fb.group({
  })

  async ngOnInit() {
    await this.getRoles()
  }

  async getRoles() {
    const response = ((await this.#rolesHttp.getAll() as SuccessGET).data) as any[]
    const id = response.length ? response.length + 1 : 1
    this.rolesArray = [...response, { id: id, label: 'Adicionar novo', value: 'Adicionar novo' }]
  }

  onSubmit() {

  }

  get rolesArray() { return this.#rolesArray }
  set rolesArray(value: any[]) { this.#rolesArray = value }

  get command() { return this.#route.snapshot.paramMap.get('command') }

}
