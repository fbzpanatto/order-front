import { Component, inject } from '@angular/core';
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  #dialogService = inject(DialogService)

  ngOnInit(): void { }

  accept() {
    this.#dialogService.next(true)
    this.#dialogService.showDialog = false
  }

  refuse() {
    this.#dialogService.next(false)
    this.#dialogService.showDialog = false
  }

  cancel() {
    this.#dialogService.next(false)
    this.#dialogService.showDialog = false
  }
}
