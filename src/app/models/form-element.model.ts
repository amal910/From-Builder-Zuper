export type ElementType = 
  | 'text-single'      
  | 'text-multi'       
  | 'text-number'
  | 'date'             
  | 'datetime'         
  | 'dropdown'         
  | 'single-select'    
  | 'multi-select'     
  | 'media-upload';    

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormElement {
  id: string;
  type: ElementType;
  name: string;
  description: string;
  placeholder?: string;
  required: boolean;
  
  options?: SelectOption[];      
  minDate?: string;              
  maxDate?: string;              
  minLength?: number;            
  maxLength?: number;            
  acceptedFileTypes?: string[];  
  validationPattern?: string;    
  validationMessage?: string;    
}


export const ELEMENT_TEMPLATES: { [key in ElementType]: Omit<FormElement, 'id'> } = {
  'text-single': {
    type: 'text-single',
    name: 'Single Line Text',
    description: 'Input for single line of text',
    placeholder: 'Enter text here',
    required: false,
  },
  'text-multi': {
    type: 'text-multi',
    name: 'Multi Line Text',
    description: 'Text area for multiple lines of text',
    placeholder: 'Enter text here',
    required: false,
  },
  'text-number': {
    type: 'text-number',
    name: 'Single Line Integer',
    description: 'Input for single line of Integer',
    placeholder: 'Enter here',
    required: false,
  },
  'date': {
    type: 'date',
    name: 'Date',
    description: 'Input for date selection',
    required: false,
  },
  'datetime': {
    type: 'datetime',
    name: 'Date & Time',
    description: 'Input for date and time selection',
    required: false,
  },
  'single-select': {
    type: 'single-select',
    name: 'Single Selection',
    description: 'Radio button selection',
    required: false,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ]
  },
  'multi-select': {
    type: 'multi-select',
    name: 'Multi Selection',
    description: 'Checkbox selection',
    required: false,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ]
  },
  'dropdown': {
    type: 'dropdown',
    name: 'Dropdown',
    description: 'Dropdown selection',
    required: false,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ]
  },
  'media-upload': {
    type: 'media-upload',
    name: 'Media Upload',
    description: 'File upload field',
    required: false,
    acceptedFileTypes: ['image/*', 'application/pdf']
  }
};
