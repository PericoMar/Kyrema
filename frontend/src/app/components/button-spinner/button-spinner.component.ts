import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-spinner.component.html',
  styleUrl: './button-spinner.component.css'
})
export class ButtonSpinnerComponent {
  @Input() color!: string; // Color del borde superior del spinner
  @Input() borderColor!: string; // Color del resto del borde
  @Input() size!: string; // Tamaño del spinner
}
