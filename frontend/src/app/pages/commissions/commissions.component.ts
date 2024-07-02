import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { SocietyService } from '../../services/society.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './commissions.component.html',
  styleUrl: './commissions.component.css'
})
export class CommissionsComponent {
  entidad! : string;
  comisionesForm!: FormGroup;
  comisionesArray!: FormArray;
  displayedColumns: string[] = ['type', 'fixedFee', 'percentageFee', 'totalPrice'];

  comisiones: { type: string }[] = [
    { type: 'Comisión 1' },
    { type: 'Comisión 2' },
    { type: 'Comisión 3' },
  ];
  
  defaultPrices: { fixedFee: number, percentageFee: number, totalPrice: number }[] = [
    { fixedFee: 100, percentageFee: 0, totalPrice: 150 },
    { fixedFee: 120, percentageFee: 0, totalPrice: 180 },
    { fixedFee: 90, percentageFee: 0, totalPrice: 135 },
  ];

  constructor(
    private fb: FormBuilder,
    private sociedadService: SocietyService,
    private userService: UserService,
    public dialog: MatDialog,
    private route: ActivatedRoute
    ) {}

    ngOnInit() {
      this.route.params.subscribe(params => {
        const sociedad = params['sociedad'];
        const comercial = params['comercial'];
    
        if (sociedad) {
          // Lógica para manejar la sociedad
          this.sociedadService.getSocietyById(sociedad).subscribe(
            sociedad => {
              this.entidad = sociedad.nombre;
            }
          );
        } else if (comercial) {
          // Lógica para manejar el comercial
          this.userService.getComercialById(comercial).subscribe(
            comercial => {
              this.entidad = comercial.nombre;
            }
          );
        }
      });
    
      this.comisionesForm = this.fb.group({
        comisiones: this.fb.array(this.comisiones.map((comision, index) => this.createComisionGroup(comision, index)))
      });
    
      this.comisionesArray = this.comisionesForm.get('comisiones') as FormArray;
    }


  createComisionGroup(comision: { type: string }, index: number): FormGroup {
    const defaultPrice = this.defaultPrices[index];
    return this.fb.group({
      type: [comision.type],
      fixedFee: [defaultPrice.fixedFee, [this.fixedOrPercentageValidator('percentageFee')]],
      percentageFee: [defaultPrice.percentageFee, [this.fixedOrPercentageValidator('fixedFee')]],
      totalPrice: [{value: defaultPrice.totalPrice, disabled: true}] // Campo deshabilitado
    });
  }

  fixedOrPercentageValidator(otherControlName: string) {
    return (control: any) => {
      if (!control.parent) {
        return null;
      }
      const otherControl = control.parent.get(otherControlName);
      if (control.value && otherControl?.value) {
        return { bothFilled: true };
      }
      return null;
    };
  }

  onSubmit() {
    if (this.comisionesForm.valid) {
      console.log(this.comisionesForm.value);
      // Procesa los datos del formulario aquí
    } else {
      this.showErrorDialog("No se puede rellenar ambos campos (fijo y porcentual) para el mismo seguro.");
    }
  }

  showErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '300px',
      data: { message }
    });
  }
}
