import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../../shared/services/form.service';

@Component({
  selector: 'app-users-form',
  standalone: true,
  templateUrl: './users-form.component.html',
  styleUrls: ['../../../styles/resource.scss', '../../../styles/form.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class UsersFormComponent {

  #title?: string

  #user = {}
  #userId?: number

  #router = inject(Router)
  #fb = inject(FormBuilder)
  #route = inject(ActivatedRoute)
  #formService = inject(FormService)
  #toolbarMenuService = inject(ToolbarMenuService)

  form = this.#fb.group({
    person: this.#fb.group({
      first_name: [''],
      middle_name: [''],
      last_name: ['']
    }),
    user: this.#fb.group({
      username: [''],
      password: [''],
      active: [''],
      role: ['']
    }),
    company: this.#fb.group({
      companyId: [''],
      companyName: ['']
    })
  })

  async ngOnInit() {
    this.menuSettings()
    this.titleSettings()

    this.#formService.currentForm = this.form;

    if (!isNaN(Number(this.command))) {
      this.userId = parseInt(this.command as string)
      this.user = await this.getByUserId(this.userId)
      return this.user != undefined ? this.updateFormValues(this.user) : null
    }

    if (this.command != 'new') { return this.redirect() }
  }

  async getByUserId(userId: number) {
    // TODO
  }

  redirect() { this.#router.navigate(['/users']) }

  menuSettings() {
    this.#toolbarMenuService.menuName = this.menuName
    this.#toolbarMenuService.hasFilter = this.hasFilter
  }

  updateFormValues(user: any) {
    this.form.patchValue(user)
    this.#formService.originalValues = this.form.value;
  }

  onSubmit() {

  }

  titleSettings() { this.command !== 'new' ? this.title = 'Editando' : this.title = 'Novo usuário' }

  get formDiff() { return this.#formService.getChangedValues() }
  get originalValues() { return this.#formService.originalValues }
  get currentValues() { return this.#formService.currentForm.value }

  get command() { return this.#route.snapshot.paramMap.get('command') }

  get user() { return this.#user }
  set user(value: any) { this.#user = value }

  get userId() { return this.#userId }
  set userId(value: number | undefined) { this.#userId = value }

  get title() { return this.#title }
  set title(value: string | undefined) { this.#title = value }

  get hasFilter() { return this.#route.snapshot.data[environment.FILTER] as boolean }
  get menuName() { return this.#route.snapshot.data[environment.MENU] as string }
}
