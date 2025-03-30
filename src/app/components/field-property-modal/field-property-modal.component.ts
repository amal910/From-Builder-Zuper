import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { FormElement, ElementType, SelectOption } from '../../models/form-element.model';

export interface FieldPropertyDialogData {
  element: FormElement;
  groupId: string;
}

@Component({
  selector: 'app-field-property-modal',
  templateUrl: './field-property-modal.component.html',
  styleUrls: ['./field-property-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSelectModule
  ]
})
export class FieldPropertyModalComponent implements OnInit {
  propertyForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FieldPropertyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FieldPropertyDialogData
  ) {
    this.propertyForm = this.createPropertyForm();
  }

  ngOnInit(): void {
    this.initPropertyForm(this.data.element);
  }

  private createPropertyForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      placeholder: [''],
      required: [false],
      minLength: [null],
      maxLength: [null],
      minDate: [null],
      maxDate: [null],
      validationPattern: [''],
      validationMessage: [''],
      acceptedFileTypes: [[]],
      options: this.fb.array([])
    });
  }


  private initPropertyForm(element: FormElement): void {
    this.propertyForm = this.createPropertyForm();
    this.propertyForm.patchValue({
      name: element.name,
      description: element.description,
      placeholder: element.placeholder || '',
      required: element.required,
      minLength: element.minLength,
      maxLength: element.maxLength,
      minDate: element.minDate,
      maxDate: element.maxDate,
      validationPattern: element.validationPattern || '',
      validationMessage: element.validationMessage || '',
      acceptedFileTypes: element.acceptedFileTypes || []
    });
    
    if (element.options && element.options.length > 0) {
      const optionsArray = this.propertyForm.get('options') as FormArray;
      while (optionsArray.length > 0) {
        optionsArray.removeAt(0);
      }

      element.options.forEach(option => {
        optionsArray.push(
          this.fb.group({
            value: [option.value, Validators.required],
            label: [option.label, Validators.required]
          })
        );
      });
    } else if (this.hasOptions(element.type)) {
      this.addOption();
      this.addOption();
    }
  }


  hasOptions(type: ElementType | undefined): boolean {
    if (!type) return false;
    return ['dropdown', 'single-select', 'multi-select'].includes(type);
  }


  isTextField(type: ElementType | undefined): boolean {
    if (!type) return false;
    return ['text-single', 'text-multi'].includes(type);
  }

  isDateField(type: ElementType | undefined): boolean {
    if (!type) return false;
    return ['date', 'datetime'].includes(type);
  }

  isFileUpload(type: ElementType | undefined): boolean {
    if (!type) return false;
    return type === 'media-upload';
  }

  get options(): FormArray {
    return this.propertyForm.get('options') as FormArray;
  }

  addOption(): void {
    this.options.push(
      this.fb.group({
        value: ['', Validators.required],
        label: ['', Validators.required]
      })
    );
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }
  
  addFileType(event: any): void {
    const value = (event.value || '').trim();
    if (value) {
      const fileTypes = this.propertyForm.get('acceptedFileTypes')?.value || [];
      fileTypes.push(value);
      this.propertyForm.get('acceptedFileTypes')?.setValue(fileTypes);
    }
    if (event.chipInput) {
      event.chipInput.clear();
    }
  }

  saveChanges(): void {
    if (this.propertyForm.invalid) {
      this.markFormGroupTouched(this.propertyForm);
      return;
    }
    
    const formValue = this.propertyForm.value;
    
    const elementUpdate: Partial<FormElement> = {
      name: formValue.name,
      description: formValue.description,
      placeholder: formValue.placeholder,
      required: formValue.required
    };
    
    if (this.isTextField(this.data.element.type)) {
      elementUpdate.minLength = formValue.minLength;
      elementUpdate.maxLength = formValue.maxLength;
      elementUpdate.validationPattern = formValue.validationPattern;
      elementUpdate.validationMessage = formValue.validationMessage;
    }
    
    if (this.isDateField(this.data.element.type)) {
      elementUpdate.minDate = formValue.minDate;
      elementUpdate.maxDate = formValue.maxDate;
    }
    
    if (this.hasOptions(this.data.element.type)) {
      elementUpdate.options = formValue.options as SelectOption[];
    }
    
    if (this.isFileUpload(this.data.element.type)) {
      elementUpdate.acceptedFileTypes = formValue.acceptedFileTypes;
    }
    
    this.dialogRef.close({
      groupId: this.data.groupId,
      elementId: this.data.element.id,
      updates: elementUpdate
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          if (control.at(i) instanceof FormGroup) {
            this.markFormGroupTouched(control.at(i) as FormGroup);
          } else {
            control.at(i).markAsTouched();
          }
        }
      }
    });
  }
}