import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './permissions-list.component.html',
  styleUrls: ['../../../../styles/title-bar.scss', '../../../../styles/table.scss']
})
export class PermissionsListComponent {

}
