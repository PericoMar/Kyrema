import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() isProductSelected : boolean = false;
  @Input() product!: any | null;
  productForm: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder) { 
    this.isProductSelected = false;
  }

  ngOnInit() {
    if (this.product) {
      this.createForm(this.product);
      console.log(this.product);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.isProductSelected = true;  
      this.createForm(this.product);
    }
  }

  createForm(product: any) {
    const formGroup: any = {};

    Object.keys(product).forEach(key => {
      formGroup[key] = new FormControl(product[key]);
    });

    this.productForm = this.fb.group(formGroup);
  }

  productKeys(): string[] {
    return this.product ? Object.keys(this.product) : [];
  }

  getInputType(key: string): string {
    const value = this.product[key];
    if (typeof value === 'number') {
      return 'number';
    } else if (typeof value === 'boolean') {
      return 'checkbox';
    } else {
      return 'text';
    }
  }

  capitalizeFirstLetter(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  eliminateProductSelected() {
    const emptyProduct: any = {};
    Object.keys(this.product).forEach(key => {
      const value = this.product[key];
      if (typeof value === 'boolean') {
        emptyProduct[key] = false;
      } else if (typeof value === 'string') {
        emptyProduct[key] = '';
      } else {
        emptyProduct[key] = null;
      }
    });
    this.product = emptyProduct;
    this.createForm(this.product);
    this.isProductSelected = false;
  }
  onSubmit() {
    console.log(this.productForm.value);
  }
}
