import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FieldGroup } from '../models/field-group.model';
import { FormElement } from '../models/form-element.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FieldGroupService {
  private readonly STORAGE_KEY = 'field_groups';
  
  // BehaviorSubjects to manage state
  private fieldGroupsSubject = new BehaviorSubject<FieldGroup[]>([]);
  private selectedGroupSubject = new BehaviorSubject<FieldGroup | null>(null);
  private selectedElementSubject = new BehaviorSubject<FormElement | null>(null);

  // Observables for components to subscribe to
  public fieldGroups$: Observable<FieldGroup[]> = this.fieldGroupsSubject.asObservable();
  public selectedGroup$: Observable<FieldGroup | null> = this.selectedGroupSubject.asObservable();
  public selectedElement$: Observable<FormElement | null> = this.selectedElementSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadFieldGroups();
  }

  // Load field groups from storage
  private loadFieldGroups(): void {
    const groups = this.storageService.load<FieldGroup[]>(this.STORAGE_KEY) || [];
    this.fieldGroupsSubject.next(groups);
    
    // If there are groups, select the first one by default
    if (groups.length > 0) {
      this.selectGroup(groups[0].id);
    }
  }

  // Save field groups to storage
  private saveFieldGroups(groups: FieldGroup[]): void {
    this.storageService.save(this.STORAGE_KEY, groups);
    this.fieldGroupsSubject.next(groups);
  }

  // Get all field groups
  getFieldGroups(): FieldGroup[] {
    return this.fieldGroupsSubject.value;
  }

  // Select a field group by ID
  selectGroup(groupId: string | null): void {
    if (!groupId) {
      this.selectedGroupSubject.next(null);
      this.selectedElementSubject.next(null);
      return;
    }

    const groups = this.fieldGroupsSubject.value;
    const selectedGroup = groups.find(group => group.id === groupId) || null;
    this.selectedGroupSubject.next(selectedGroup);
    this.selectedElementSubject.next(null); // Clear selected element
  }

  // Select a form element
  selectElement(elementId: string | null): void {
    if (!elementId) {
      this.selectedElementSubject.next(null);
      return;
    }

    const currentGroup = this.selectedGroupSubject.value;
    if (!currentGroup) return;

    const selectedElement = currentGroup.elements.find(element => element.id === elementId) || null;
    this.selectedElementSubject.next(selectedElement);
  }

  // Add a new field group
  addFieldGroup(group: Omit<FieldGroup, 'id' | 'elements' | 'createdAt' | 'updatedAt'>): void {
    const groups = this.fieldGroupsSubject.value;
    const newGroup: FieldGroup = {
      ...group,
      id: this.generateId(),
      elements: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    this.saveFieldGroups([...groups, newGroup]);
    this.selectGroup(newGroup.id);
  }

  // Update an existing field group
  updateFieldGroup(groupId: string, updates: Partial<Omit<FieldGroup, 'id' | 'elements' | 'createdAt' | 'updatedAt'>>): void {
    const groups = this.fieldGroupsSubject.value;
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          ...updates,
          updatedAt: Date.now()
        };
      }
      return group;
    });
    
    this.saveFieldGroups(updatedGroups);
    
    // Update selected group if it was the one updated
    if (this.selectedGroupSubject.value?.id === groupId) {
      this.selectGroup(groupId);
    }
  }

  // Delete a field group
  deleteFieldGroup(groupId: string): void {
    const groups = this.fieldGroupsSubject.value;
    const filteredGroups = groups.filter(group => group.id !== groupId);
    
    this.saveFieldGroups(filteredGroups);
    
    // If the deleted group was selected, select another one or null
    if (this.selectedGroupSubject.value?.id === groupId) {
      const newSelectedId = filteredGroups.length > 0 ? filteredGroups[0].id : null;
      this.selectGroup(newSelectedId);
    }
  }

  // Add a form element to a field group
  addFormElement(groupId: string, element: Omit<FormElement, 'id'>): void {
    const groups = this.fieldGroupsSubject.value;
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        // Ensure the element has a valid type
        const elementType = element.type || 'text-single';
        
        const newElement: FormElement = {
          ...element,
          type: elementType, // Explicitly set the type to ensure it's preserved
          id: this.generateId()
        };
        
        // Log the element type for debugging
        console.log(`Adding element of type: ${newElement.type}`);
        
        return {
          ...group,
          elements: [...group.elements, newElement],
          updatedAt: Date.now()
        };
      }
      return group;
    });
    
    this.saveFieldGroups(updatedGroups);
    
    // Update selected group if it was the one updated
    if (this.selectedGroupSubject.value?.id === groupId) {
      this.selectGroup(groupId);
    }
  }

  // Update a form element
  updateFormElement(groupId: string, elementId: string, updates: Partial<Omit<FormElement, 'id' | 'type'>>): void {
    const groups = this.fieldGroupsSubject.value;
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        const updatedElements = group.elements.map(element => {
          if (element.id === elementId) {
            return {
              ...element,
              ...updates
            };
          }
          return element;
        });
        
        return {
          ...group,
          elements: updatedElements,
          updatedAt: Date.now()
        };
      }
      return group;
    });
    
    this.saveFieldGroups(updatedGroups);
    
    // Update selected group and element if they were the ones updated
    if (this.selectedGroupSubject.value?.id === groupId) {
      this.selectGroup(groupId);
      if (this.selectedElementSubject.value?.id === elementId) {
        this.selectElement(elementId);
      }
    }
  }

  // Delete a form element
  deleteFormElement(groupId: string, elementId: string): void {
    const groups = this.fieldGroupsSubject.value;
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          elements: group.elements.filter(element => element.id !== elementId),
          updatedAt: Date.now()
        };
      }
      return group;
    });
    
    this.saveFieldGroups(updatedGroups);
    
    // Update selected group if it was the one updated
    if (this.selectedGroupSubject.value?.id === groupId) {
      this.selectGroup(groupId);
      // Clear selected element if it was deleted
      if (this.selectedElementSubject.value?.id === elementId) {
        this.selectElement(null);
      }
    }
  }

  // Reorder form elements within a group
  reorderFormElements(groupId: string, newOrderIds: string[]): void {
    const groups = this.fieldGroupsSubject.value;
    const groupToUpdate = groups.find(group => group.id === groupId);
    
    if (!groupToUpdate) return;
    
    // Create a map of elements by ID for quick lookup
    const elementsMap = new Map<string, FormElement>();
    groupToUpdate.elements.forEach(element => {
      elementsMap.set(element.id, element);
    });
    
    // Create the new ordered array of elements
    const reorderedElements: FormElement[] = [];
    for (const id of newOrderIds) {
      const element = elementsMap.get(id);
      if (element) {
        reorderedElements.push(element);
      }
    }
    
    // Make sure we didn't lose any elements
    if (reorderedElements.length !== groupToUpdate.elements.length) {
      console.error('Element count mismatch during reordering');
      return;
    }
    
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          elements: reorderedElements,
          updatedAt: Date.now()
        };
      }
      return group;
    });
    
    this.saveFieldGroups(updatedGroups);
    
    // Update selected group if it was the one updated
    if (this.selectedGroupSubject.value?.id === groupId) {
      this.selectGroup(groupId);
    }
  }

  // Export the configuration as JSON
  exportConfiguration(): string {
    return JSON.stringify(this.fieldGroupsSubject.value);
  }

  // Import configuration from JSON
  importConfiguration(jsonConfig: string): boolean {
    try {
      const config = JSON.parse(jsonConfig) as FieldGroup[];
      // Validate the imported data
      if (!Array.isArray(config)) {
        throw new Error('Invalid configuration format');
      }
      
      for (const group of config) {
        if (!group.id || !group.name || !Array.isArray(group.elements)) {
          throw new Error('Invalid group structure');
        }
      }
      
      this.saveFieldGroups(config);
      this.selectGroup(config.length > 0 ? config[0].id : null);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  // Generate a unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}
