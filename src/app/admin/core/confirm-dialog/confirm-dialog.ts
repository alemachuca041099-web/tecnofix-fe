import { Component, inject } from '@angular/core';
import { ConfirmService } from '../confirm.service';

@Component({
  selector: 'tf-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  protected readonly confirmService = inject(ConfirmService);
}
