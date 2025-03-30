import { FormElement } from './form-element.model';

export interface FieldGroup {
  id: string;
  name: string;
  description: string;
  elements: FormElement[];
  createdAt: number;
  updatedAt: number;
}
