import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FieldGroup } from '../../models/field-group.model';
import { FormElement } from '../../models/form-element.model';
import { FieldGroupService } from '../../services/field-group.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormElementComponent } from '../form-element/form-element.component';
import { FieldGroupDialogComponent } from '../field-group-dialog/field-group-dialog.component';
import { FieldPropertyModalComponent } from '../field-property-modal/field-property-modal.component';

@Component({
  selector: 'app-middle-pane',
  templateUrl: './middle-pane.component.html',
  styleUrls: ['./middle-pane.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormElementComponent,
    FieldGroupDialogComponent,
    FieldPropertyModalComponent
  ]
})
export class MiddlePaneComponent implements OnInit, OnDestroy {
  selectedGroup: FieldGroup | null = null;
  selectedElementId: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private fieldGroupService: FieldGroupService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.fieldGroupService.selectedGroup$.subscribe(group => {
        this.selectedGroup = group;
      })
    );

    this.subscriptions.push(
      this.fieldGroupService.selectedElement$.subscribe(element => {
        this.selectedElementId = element?.id || null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  onDrop(event: CdkDragDrop<FormElement[]>): void {
    if (!this.selectedGroup) return;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      const newOrder = event.container.data.map(element => element.id);
      this.fieldGroupService.reorderFormElements(this.selectedGroup.id, newOrder);
      
    } else {
      if (event.previousContainer.id === 'available-elements' && 
          event.container.id === 'form-elements') {
        const templateElement = event.previousContainer.data[event.previousIndex];
        const draggedType = (window as any)._currentDragElementType || templateElement.type;
        const newElement = JSON.parse(JSON.stringify(templateElement));
        newElement.type = draggedType;
        this.fieldGroupService.addFormElement(this.selectedGroup.id, newElement);
      }
    }
  }


  openElementProperties(element: FormElement, event?: Event): void {
    if (!this.selectedGroup) return;
    
    if (event) {
      event.stopPropagation();
    }

    const dialogRef = this.dialog.open(FieldPropertyModalComponent, {
      width: '600px',
      data: {
        element: element,
        groupId: this.selectedGroup.id
      },
      panelClass: 'field-property-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fieldGroupService.updateFormElement(
          result.groupId,
          result.elementId,
          result.updates
        );
      }
    });
  }


  duplicateElement(elementId: string, event: Event): void {
    event.stopPropagation(); 
    
    if (!this.selectedGroup) return;

    const elementToDuplicate = this.selectedGroup.elements.find(el => el.id === elementId);
    if (!elementToDuplicate) return;
    const elementCopy = { ...elementToDuplicate };
    delete (elementCopy as any).id; 
    elementCopy.name = `${elementCopy.name} (Copy)`;
    this.fieldGroupService.addFormElement(this.selectedGroup.id, elementCopy);
  }


  deleteElement(elementId: string, event: Event): void {
    event.stopPropagation(); 

    if (!this.selectedGroup) return;
    if (confirm('Are you sure you want to delete this element?')) {
      this.fieldGroupService.deleteFormElement(this.selectedGroup.id, elementId);
    }
  }

  getElementTypeClass(type: string): string {
    return `element-type-${type}`;
  }
  
  openEditDialog(group: FieldGroup, event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(FieldGroupDialogComponent, {
      width: '500px',
      data: {
        mode: 'edit',
        group: {
          name: group.name,
          description: group.description
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fieldGroupService.updateFieldGroup(group.id, result);
      }
    });
  }
  

  duplicateGroup(groupId: string, event: Event): void {
    event.stopPropagation();
    
    if (!this.selectedGroup) return;
    
    const newGroup = {
      name: `${this.selectedGroup.name} (Copy)`,
      description: this.selectedGroup.description
    };
    
    this.fieldGroupService.addFieldGroup(newGroup);
  }
  

  deleteGroup(groupId: string, event: Event): void {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this field group? This action cannot be undone.')) {
      this.fieldGroupService.deleteFieldGroup(groupId);
    }
  }
}
