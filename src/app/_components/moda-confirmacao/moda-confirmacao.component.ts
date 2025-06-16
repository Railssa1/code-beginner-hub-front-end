import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-moda-confirmacao',
  templateUrl: './moda-confirmacao.component.html',
  styleUrls: ['./moda-confirmacao.component.css'],
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule]
})
export class ModaConfirmacaoComponent {
  constructor(private dialogRef: MatDialogRef<ModaConfirmacaoComponent>) {

  }

  publicarTopico(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
