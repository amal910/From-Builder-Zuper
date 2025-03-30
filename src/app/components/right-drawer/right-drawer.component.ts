import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FieldGroup } from '../../models/field-group.model';
import { FormElement, ElementType, SelectOption } from '../../models/form-element.model';
import { FieldGroupService } from '../../services/field-group.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-right-drawer',
  templateUrl: './right-drawer.component.html',
  styleUrls: ['./right-drawer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatCardModule
  ]
})
export class RightDrawerComponent implements OnInit, OnDestroy {
  selectedGroup: FieldGroup | null = null;
  selectedElement: FormElement | null = null;
  propertyForm: FormGroup;
  showDrawer = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private fieldGroupService: FieldGroupService,
    private fb: FormBuilder
  ) {
    this.propertyForm = this.createPropertyForm();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.fieldGroupService.selectedGroup$.subscribe(group => {
        this.selectedGroup = group;
      })
    );

    this.subscriptions.push(
      this.fieldGroupService.selectedElement$.subscribe(element => {
        this.selectedElement = element;
        
        if (element) {
          this.showDrawer = true;
          this.initPropertyForm(element);
        } else {
          this.showDrawer = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  onSubmit(): void {
    if (this.propertyForm.invalid) {
      this.markFormGroupTouched(this.propertyForm);
      return;
    }
    
    if (!this.selectedGroup || !this.selectedElement) return;
    
    const formValue = this.propertyForm.value;
    
    const elementUpdate: Partial<FormElement> = {
      name: formValue.name,
      description: formValue.description,
      placeholder: formValue.placeholder,
      required: formValue.required
    };
    
    if (this.isTextField(this.selectedElement.type)) {
      elementUpdate.minLength = formValue.minLength;
      elementUpdate.maxLength = formValue.maxLength;
      elementUpdate.validationPattern = formValue.validationPattern;
      elementUpdate.validationMessage = formValue.validationMessage;
    }
    
    if (this.isDateField(this.selectedElement.type)) {
      elementUpdate.minDate = formValue.minDate;
      elementUpdate.maxDate = formValue.maxDate;
    }
    
    if (this.hasOptions(this.selectedElement.type)) {
      elementUpdate.options = formValue.options as SelectOption[];
    }
    
    if (this.isFileUpload(this.selectedElement.type)) {
      elementUpdate.acceptedFileTypes = formValue.acceptedFileTypes;
    }

    this.fieldGroupService.updateFormElement(
      this.selectedGroup.id,
      this.selectedElement.id,
      elementUpdate
    );
  }

  closeDrawer(): void {
    this.fieldGroupService.selectElement(null);
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
