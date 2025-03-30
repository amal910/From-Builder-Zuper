import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ElementType, FormElement, ELEMENT_TEMPLATES } from '../../models/form-element.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['./right-pane.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class RightPaneComponent implements OnInit {
  availableElements = Object.values(ELEMENT_TEMPLATES);

  constructor() {}

  ngOnInit(): void {}

  getElementByType(type: string): Omit<FormElement, 'id'> {
    if (type === 'time') {
      const timeElement = { ...ELEMENT_TEMPLATES['datetime'] };
      timeElement.name = 'Time';
      timeElement.description = 'Select time from timepicker';
      return timeElement;
    }
    
    if (type === 'text-number') {
      const numberElement = { ...ELEMENT_TEMPLATES['text-single'] };
      numberElement.name = 'Integer';
      numberElement.description = 'Integer type area';
      return numberElement;
    }
    
    return ELEMENT_TEMPLATES[type as ElementType] || ELEMENT_TEMPLATES['text-single'];
  }

  currentDragElementType: ElementType | null = null;

  onDragStarted(event: any): void {
    console.log(event);
    
    document.body.classList.add('dragging');
    
    const draggedElement = event.source.data;
    if (draggedElement && draggedElement.type) {
      this.currentDragElementType = draggedElement.type;
      
      (window as any)._currentDragElementType = draggedElement.type;
      
      console.log('Started dragging element of type:', draggedElement.type);
    }
  }

  onDragEnded(event: any): void {
    document.body.classList.remove('dragging');
    this.currentDragElementType = null;
  }

  onDrop(event: CdkDragDrop<any[]>): void {
  }


  getElementIcon(type: ElementType): string {
    switch (type) {
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

  getElementTypeClass(type: ElementType): string {
    return `element-type-${type}`;
  }
}
