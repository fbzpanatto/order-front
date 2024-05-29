import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss', '../../../styles/resource.scss']
})
export class UsersComponent {

  private route = inject(ActivatedRoute)
  private toolbarMenuService = inject(ToolbarMenuService)

  ngOnInit() {
    this.toolbarMenuService.menuName = this.route.snapshot.data[environment.MENU]
  }
}
