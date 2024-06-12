import { Component } from '@angular/core';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [],
  templateUrl: './roles.component.html',
  styleUrls: ['../../../styles/title-bar.scss', '../../../styles/table.scss']
})
export class RolesComponent {

  get rolesArray(): any[] { return [] }

}
