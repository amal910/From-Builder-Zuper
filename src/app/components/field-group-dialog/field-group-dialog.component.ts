import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface DialogData {
  mode: 'create' | 'edit';
  group: {
    name: string;
    description: string;
  } | null;
}

@Component({
  selector: 'app-field-group-dialog',
  templateUrl: './field-group-dialog.component.html',
  styleUrls: ['./field-group-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class FieldGroupDialogComponent implements OnInit {
  groupForm: FormGroup;
  dialogTitle: string;
  submitButtonText: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FieldGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)]
    });

    if (this.data.mode === 'create') {
      this.dialogTitle = 'Create Field Group';
      this.submitButtonText = 'Create';
    } else {
      this.dialogTitle = 'Edit Field Group';
      this.submitButtonText = 'Save Changes';
      
      if (this.data.group) {
        this.groupForm.patchValue({
          name: this.data.group.name,
          description: this.data.group.description
        });
      }
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.groupForm.valid) {
      this.dialogRef.close(this.groupForm.value);
    } else {
      this.groupForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
