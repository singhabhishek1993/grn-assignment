import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormBuilder, ReactiveFormsModule , FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

interface FormData {
  itemCategory: string;
  item: string;
  strain: string;
  quantity: number;
  uom: number;
  totalCost: number;
  costPerUnit: number;
  supplier: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule, HttpClientModule, MatSnackBarModule, ReactiveFormsModule, CommonModule ], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  formData!: FormData;
  formCount: number = 1;
  apiUrl = 'http://localhost:3000/submitForm'; // Change this to your API URL
  grnForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formData = this.getFormDataFromLocalStorage() || this.getMockData();
    this.createForm();
    this.calculateTotalCost();
  }

  createForm(): void {
    this.grnForm = this.formBuilder.group({
      itemCategory: [this.formData.itemCategory, Validators.required],
      item: [this.formData.item, Validators.required],
      strain: [this.formData.strain, Validators.required],
      quantity: [this.formData.quantity, [Validators.required, Validators.min(1)]],
      uom: [this.formData.uom],
      totalCost: [this.formData.totalCost],
      costPerUnit: [this.formData.costPerUnit, [Validators.required, Validators.min(0.01)]],
      supplier: [this.formData.supplier, Validators.required]
    });
  }

  getMockData(): FormData {
    return {
      itemCategory: 'Category',
      item: 'Item',
      strain: 'Strain',
      quantity: 10,
      uom: 1,
      totalCost: 100,
      costPerUnit: 10,
      supplier: 'Supplier'
    };
  }

  getFormDataFromLocalStorage(): FormData | null {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('formData');
      return data ? JSON.parse(data) : null;
    } else {
      return null;
    }
  }

  updateLocalStorage(formData: FormData): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  }

  onSubmit(): void {
    if (this.grnForm.valid) {
      this.formData = this.grnForm.value;
      this.http.post<any>(this.apiUrl, this.formData).subscribe({
        next: (response) => {
          console.log('Response:', response);
          this._snackBar.open('Form submitted successfully', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error:', error);
          this._snackBar.open('Form submission failed', 'Close', {
            duration: 3000
          });
        }
      });
    } else {
      this._snackBar.open('Please fill out all required fields correctly', 'Close', {
        duration: 3000
      });
    }
  }

  clearAll(): void {
    this.formData = this.getMockData();
    this.updateLocalStorage(this.formData);
    this.createForm();
  }

  delete(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('formData');
    }
    this.formData = this.getMockData();
    this.createForm();
  }

  calculateTotalCost(): void {
    this.formData.totalCost = this.formData.quantity * this.formData.costPerUnit;
    this.grnForm.patchValue({ totalCost: this.formData.totalCost });
  }

  onQuantityChange(): void {
    this.calculateTotalCost();
  }

  onCostPerUnitChange(): void {
    this.calculateTotalCost();
  }

  addNewForm(): void {
    this.formCount++;
  }
}