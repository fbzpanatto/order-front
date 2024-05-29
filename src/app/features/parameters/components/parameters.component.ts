import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToolbarMenuService } from '../../../shared/services/toolbarMenu.service';

@Component({
  selector: 'app-parameters',
  standalone: true,
  imports: [],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss'
})
export class ParametersComponent {

  private route = inject(ActivatedRoute)
  private toolbarMenuService = inject(ToolbarMenuService)

  ngOnInit() {
    this.toolbarMenuService.currentMenu = this.route.snapshot.data[environment.MENU]
  }
}
