# Form Builder

A dynamic, user-friendly form builder application designed for intuitive drag-and-drop form creation with advanced customization capabilities.

## Features

- **Three-Pane Layout**: 
  - Left Pane: Manage field groups
  - Middle Pane: View and manage elements of selected field groups
  - Right Pane: Contains form elements that can be dragged to the Middle Pane

- **Drag and Drop Interface**: Easily drag form elements from the right pane to build your form in the middle pane

- **Field Property Customization**: Edit field properties via modal dialog for precise form configuration

- **Field Group Management**: Create, edit, duplicate, and delete field groups to organize your forms

- **Local Storage Persistence**: Forms and configurations are automatically saved to browser local storage

## Technical Stack

- **Framework**: Angular 
- **Styling**: SCSS with responsive design
- **UI Components**: Angular Material
- **Drag and Drop**: Angular CDK

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Angular CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/form-builder.git
cd form-builder
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Development

### Project Structure

- `src/app/components/`: Contains all components for the three-pane layout
- `src/app/services/`: Service files for data management and storage
- `src/app/models/`: TypeScript interfaces and models
- `src/app/dialogs/`: Modal dialog components for editing properties

