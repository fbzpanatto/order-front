import { Component } from '@angular/core';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss', '../../../styles/resource.scss']
})
export class RolesComponent {

  get rolesArray():any[] { return [] }

}
