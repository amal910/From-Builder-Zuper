import { Component, OnInit, Input } from '@angular/core';
import { FormElement } from '../../models/form-element.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styleUrls: ['./form-element.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatDatepickerModule
  ]
})
export class FormElementComponent implements OnInit {
  @Input() element!: FormElement;
  
  constructor() {}

  ngOnInit(): void {}

  getElementIcon(): string {
    switch (this.element.type) {
      case 'text-single':
        return 'short_text';
      case 'text-multi':
        return 'notes';
      case 'date':
        return 'calendar_today';
      case 'datetime':
        return 'schedule';
      case 'dropdown':
        return 'arrow_drop_down_circle';
      case 'single-select':
        return 'radio_button_checked';
      case 'multi-select':
        return 'check_box';
      case 'media-upload':
        return 'cloud_upload';
      default:
        return 'widgets';
    }
  }

  getElementTypeClass(): string {
    return `element-type-${this.element.type}`;
  }
}
